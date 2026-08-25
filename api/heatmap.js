// Vercel Serverless Function — /api/heatmap
// POST: ingest click/scroll batches from the self-hosted collector.
// GET ?mode=agg: aggregated data for the viewer (requires HEATMAP_VIEW_KEY).
//
// Same raw-fetch Supabase pattern as api/lead.js — service key stays
// server-side, and a missing env config degrades to a no-op rather than
// an error the collector would retry against.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const VIEW_KEY = process.env.HEATMAP_VIEW_KEY;
const TABLE = "heatmap_events";

const MAX_BODY_BYTES = 32 * 1024;
const MAX_EVENTS = 200;
const VARIANTS = new Set(["a", "b", "c", "d"]);
const DEVICES = new Set(["mobile", "desktop"]);

function configured() {
  return !!(SUPABASE_URL && SUPABASE_KEY);
}

function headers(extra) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

// Accept only what the schema expects, drop everything else. A row that
// fails validation is skipped silently — analytics never earns a retry loop.
function sanitize(ev, sessionId) {
  if (!ev || typeof ev !== "object") return null;
  if (!VARIANTS.has(ev.variant) || !DEVICES.has(ev.device)) return null;

  if (ev.kind === "click") {
    const relX = Number(ev.rel_x);
    const relY = Number(ev.rel_y);
    if (typeof ev.section_id !== "string" || ev.section_id.length > 40) return null;
    if (!(relX >= 0 && relX <= 1) || !(relY >= 0 && relY <= 1)) return null;
    return {
      session_id: sessionId,
      variant: ev.variant,
      device: ev.device,
      kind: "click",
      section_id: ev.section_id,
      rel_x: relX,
      rel_y: relY,
    };
  }

  if (ev.kind === "scroll") {
    const pct = Number(ev.scroll_pct);
    if (!(pct >= 0 && pct <= 100)) return null;
    const reached =
      typeof ev.reached_section === "string" && ev.reached_section.length <= 40
        ? ev.reached_section
        : null;
    return {
      session_id: sessionId,
      variant: ev.variant,
      device: ev.device,
      kind: "scroll",
      scroll_pct: Math.round(pct),
      reached_section: reached,
    };
  }

  return null;
}

async function handlePost(req, res) {
  let body = req.body;
  if (typeof body === "string") {
    if (body.length > MAX_BODY_BYTES) return res.status(413).end();
    try { body = JSON.parse(body); } catch { return res.status(400).end(); }
  }
  if (!body || typeof body !== "object") return res.status(400).end();

  const sessionId = typeof body.session_id === "string" ? body.session_id.slice(0, 64) : "";
  const events = Array.isArray(body.events) ? body.events.slice(0, MAX_EVENTS) : [];
  if (!sessionId || !events.length) return res.status(400).end();

  const rows = events.map((e) => sanitize(e, sessionId)).filter(Boolean);
  if (!rows.length) return res.status(204).end(); // nothing valid — not an error

  if (!configured()) return res.status(204).end();

  const r = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify(rows),
  });
  if (!r.ok) {
    console.error(`[heatmap] insert failed: ${r.status} ${await r.text().catch(() => "")}`);
  }
  return res.status(204).end();
}

async function handleGet(req, res) {
  const { key, variant, device, days } = req.query || {};
  if (!VIEW_KEY || key !== VIEW_KEY) return res.status(403).json({ error: "forbidden" });
  if (!configured()) return res.status(503).json({ error: "storage not configured" });

  const v = VARIANTS.has(variant) ? variant : "c";
  const d = DEVICES.has(device) ? device : "mobile";
  const windowDays = Math.min(90, Math.max(1, parseInt(days, 10) || 30));
  const since = new Date(Date.now() - windowDays * 86400000).toISOString();

  const base =
    `${SUPABASE_URL}/rest/v1/${TABLE}` +
    `?variant=eq.${v}&device=eq.${d}&ts=gte.${encodeURIComponent(since)}`;

  // PostgREST has no group-by; volumes here are small (a landing page, capped
  // at 200 events/session), so fetch raw rows and bucket in the function.
  const [clicksRes, scrollsRes] = await Promise.all([
    fetch(`${base}&kind=eq.click&select=section_id,rel_x,rel_y&limit=50000`, { headers: headers() }),
    fetch(`${base}&kind=eq.scroll&select=scroll_pct,reached_section&limit=10000`, { headers: headers() }),
  ]);
  if (!clicksRes.ok || !scrollsRes.ok) {
    return res.status(502).json({ error: "storage query failed" });
  }
  const clicks = await clicksRes.json();
  const scrolls = await scrollsRes.json();

  // Clicks → 40×40 grid per section.
  const GRID = 40;
  const sections = {};
  for (const c of clicks) {
    const sec = (sections[c.section_id] ||= {});
    const cell =
      Math.min(GRID - 1, Math.floor(c.rel_x * GRID)) +
      "," +
      Math.min(GRID - 1, Math.floor(c.rel_y * GRID));
    sec[cell] = (sec[cell] || 0) + 1;
  }

  // Scroll → % of sessions reaching each 10% bucket (cumulative),
  // plus how many sessions got at least as deep as each section.
  const buckets = Array(11).fill(0);
  const reach = {};
  for (const s of scrolls) {
    const b = Math.min(10, Math.floor(s.scroll_pct / 10));
    for (let i = 0; i <= b; i++) buckets[i]++;
    if (s.reached_section) reach[s.reached_section] = (reach[s.reached_section] || 0) + 1;
  }

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    variant: v,
    device: d,
    days: windowDays,
    grid: GRID,
    total_clicks: clicks.length,
    total_scroll_sessions: scrolls.length,
    sections,
    scroll_buckets: buckets,
    deepest_section_counts: reach,
  });
}

export default async function handler(req, res) {
  try {
    if (req.method === "POST") return await handlePost(req, res);
    if (req.method === "GET") return await handleGet(req, res);
    return res.status(405).end();
  } catch (err) {
    console.error("[heatmap] unhandled:", (err && err.message) || err);
    // POST callers are beacons — nobody reads the response.
    return res.status(req.method === "GET" ? 500 : 204).end();
  }
}
