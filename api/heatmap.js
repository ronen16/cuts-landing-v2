// Vercel Serverless Function — /api/heatmap
// POST: ingest click/scroll/rage/move/form batches from the self-hosted collector.
// GET ?mode=agg: aggregated data for the viewer (requires HEATMAP_VIEW_KEY).
// GET ?mode=trends: per-day sessions/clicks/leads for the same slice.
//
// Same raw-fetch Supabase pattern as api/lead.js — service key stays
// server-side, and a missing env config degrades to a no-op rather than
// an error the collector would retry against.

import { createHash } from "node:crypto";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const VIEW_KEY = process.env.HEATMAP_VIEW_KEY;
// Fallback when the env var isn't set: a one-way SHA-256 of the view key.
// The key itself lives only in Ronen's viewer URL — this hash can't produce it.
const VIEW_KEY_SHA256 = "67db196eab780f203604bc0f0c925d8117ef16bf29619850d2f1a0643638a348";
const TABLE = "heatmap_events";

function viewKeyValid(key) {
  if (typeof key !== "string" || !key) return false;
  if (VIEW_KEY) return key === VIEW_KEY;
  return createHash("sha256").update(key).digest("hex") === VIEW_KEY_SHA256;
}

const MAX_BODY_BYTES = 32 * 1024;
const MAX_EVENTS = 200;
// "-" is the variant of every page that isn't the home page, where the A/B
// split doesn't exist.
const VARIANTS = new Set(["a", "b", "c", "d", "-"]);
const DEVICES = new Set(["mobile", "desktop"]);
// Not a device an event can carry — only a slice that spans both.
const DEVICE_ALL = "all";
const MAX_PAGE_LEN = 80;
const DEFAULT_PAGE = "/";
const MAX_SECTION_LEN = 40;
// Kinds that carry a point inside a section: same shape, same validation.
const COORD_KINDS = new Set(["click", "rage", "move"]);
// form_field reuses reached_section to carry what happened to the field.
const FIELD_ACTIONS = new Set(["focus", "abandon", "complete"]);
// Traffic source, as the collector writes it: "c:<network>" for campaign
// traffic, "r:<host>" for an organic referral, "direct" for neither. The
// dashboard's campaign/organic split is that "c:" prefix and nothing else.
// Hebrew and spaces are in the class because Meta expands {{campaign.name}}
// and {{ad.name}} to names typed in Ads Manager, which are Hebrew here.
const SOURCE_PATTERN = /^[a-z0-9֐-׿._:\- ]{1,40}$/;
const DEFAULT_SOURCE = "direct";
const SOURCE_FILTERS = new Set(["all", "campaign", "organic"]);
// The campaign name behind a campaign source, same grammar as the source
// token. "" means the visit named no campaign, which is most of the traffic.
const DEFAULT_CAMPAIGN = "";
// The picker's "no campaign chosen" value — never a campaign name itself.
const CAMPAIGN_ALL = "all";
const GRID = 40;
const DAY_MS = 86400000;

// A path the collector normalized: absolute, short, no whitespace.
// Anything else is treated as absent rather than rejected — old collector
// batches carry no page at all and must still land.
function cleanPage(value) {
  if (typeof value !== "string" || !value.startsWith("/")) return null;
  // "//evil.com" and "/\evil.com" are protocol-relative URLs — the admin
  // viewer iframes the page value, so these would load an attacker origin
  // inside the trusted dashboard.
  if (value[1] === "/" || value[1] === "\\") return null;
  if (value.length > MAX_PAGE_LEN || /\s/.test(value)) return null;
  return value;
}

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

function sectionValid(value) {
  return typeof value === "string" && value.length <= MAX_SECTION_LEN;
}

// The coord kinds have always tolerated an empty section_id; the form kinds
// key their aggregates by it, so there it has to actually be there.
function sectionNamed(value) {
  return sectionValid(value) && value.length > 0;
}

// Collectors deployed before the source column existed send no source at all,
// and the column is NOT NULL — an unusable value becomes "direct" rather than
// dropping an otherwise valid event.
function cleanSource(value) {
  return typeof value === "string" && SOURCE_PATTERN.test(value) ? value : DEFAULT_SOURCE;
}

// Unlike the source, an absent campaign is the normal case rather than a
// degraded one, so anything unusable collapses to the same empty string.
function cleanCampaign(value) {
  return typeof value === "string" && SOURCE_PATTERN.test(value) ? value : DEFAULT_CAMPAIGN;
}

// Accept only what the schema expects, drop everything else. A row that
// fails validation is skipped silently — analytics never earns a retry loop.
function sanitize(ev, sessionId) {
  if (!ev || typeof ev !== "object") return null;
  if (!VARIANTS.has(ev.variant) || !DEVICES.has(ev.device)) return null;
  const page = cleanPage(ev.page) || DEFAULT_PAGE;
  // Every kind is written with the same key set: PostgREST refuses a bulk
  // insert whose objects don't all carry the same columns, and one batch
  // mixes clicks, scrolls, moves and form events.
  const common = {
    session_id: sessionId,
    page,
    variant: ev.variant,
    device: ev.device,
    source: cleanSource(ev.source),
    campaign: cleanCampaign(ev.campaign),
    section_id: null,
    rel_x: null,
    rel_y: null,
    scroll_pct: null,
    reached_section: null,
  };

  if (COORD_KINDS.has(ev.kind)) {
    const relX = Number(ev.rel_x);
    const relY = Number(ev.rel_y);
    if (!sectionValid(ev.section_id)) return null;
    if (!(relX >= 0 && relX <= 1) || !(relY >= 0 && relY <= 1)) return null;
    return {
      ...common,
      kind: ev.kind,
      section_id: ev.section_id,
      rel_x: relX,
      rel_y: relY,
    };
  }

  if (ev.kind === "form_view") {
    if (!sectionNamed(ev.section_id)) return null;
    return { ...common, kind: "form_view", section_id: ev.section_id };
  }

  if (ev.kind === "lead") {
    return { ...common, kind: "lead" };
  }

  if (ev.kind === "form_field") {
    if (!sectionNamed(ev.section_id)) return null;
    if (!FIELD_ACTIONS.has(ev.reached_section)) return null;
    return {
      ...common,
      kind: "form_field",
      section_id: ev.section_id,
      reached_section: ev.reached_section,
    };
  }

  if (ev.kind === "scroll") {
    const pct = Number(ev.scroll_pct);
    if (!(pct >= 0 && pct <= 100)) return null;
    const reached = sectionValid(ev.reached_section) ? ev.reached_section : null;
    return {
      ...common,
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

// "organic" is everything that isn't a campaign — an r: referral and a direct
// visit answer the same question ("didn't come from an ad"), so they share a
// bucket instead of splitting Ronen's numbers three ways.
function sourceClause(src) {
  if (src === "campaign") return "&source=like.c:*";
  if (src === "organic") return "&source=not.like.c:*";
  return "";
}

// The slice every GET mode works on: one page, one variant, one device,
// one source class, one time window. Trend days bucket by UTC date — an
// Israel session before 03:00 local lands on the previous bar; acceptable
// for reading trends.
function sliceOf(req) {
  const { variant, device, days, page, src, camp } = req.query || {};
  const v = VARIANTS.has(variant) ? variant : "c";
  // "all" is the honest default: with a per-device filter and nothing else,
  // no number on the dashboard was ever the site's total, which invites
  // reading a mobile figure as the whole picture.
  const d = DEVICES.has(device) ? device : DEVICE_ALL;
  const p = cleanPage(page) || DEFAULT_PAGE;
  const s = SOURCE_FILTERS.has(src) ? src : "all";
  const c =
    typeof camp === "string" && camp !== CAMPAIGN_ALL && SOURCE_PATTERN.test(camp) ? camp : "";
  const windowDays = Math.min(90, Math.max(1, parseInt(days, 10) || 30));
  const since = new Date(Date.now() - windowDays * DAY_MS).toISOString();
  const sinceParam = encodeURIComponent(since);
  // baseAll is the same slice without the source filter — the breakdowns have
  // to keep showing every source and campaign, including the ones a filter hides.
  const deviceClause = d === DEVICE_ALL ? "" : `&device=eq.${d}`;
  const baseAll =
    `${SUPABASE_URL}/rest/v1/${TABLE}` +
    `?page=eq.${encodeURIComponent(p)}&variant=eq.${v}` +
    `${deviceClause}&ts=gte.${sinceParam}`;
  // A named campaign is campaign traffic by definition, so it replaces the
  // source clause instead of stacking with it — "organic" plus a campaign
  // name would otherwise be an empty slice no matter what the data says.
  const filter = c ? `&campaign=eq.${encodeURIComponent(c)}` : sourceClause(s);
  return { v, d, p, s, c, windowDays, since, sinceParam, deviceClause, baseAll, base: baseAll + filter };
}

// A panel whose query fails degrades to zeros — one missing block must never
// take the whole dashboard down with it.
async function fetchRows(url) {
  try {
    const r = await fetch(url, { headers: headers() });
    if (!r.ok) {
      console.error(`[heatmap] query failed: ${r.status}`);
      return [];
    }
    const rows = await r.json();
    return Array.isArray(rows) ? rows : [];
  } catch (err) {
    console.error("[heatmap] query error:", (err && err.message) || err);
    return [];
  }
}

// Point events → GRID×GRID cell counts per section.
function bucketPoints(rows) {
  const sections = {};
  for (const row of rows) {
    const sec = (sections[row.section_id] ||= {});
    const cell =
      Math.min(GRID - 1, Math.floor(row.rel_x * GRID)) +
      "," +
      Math.min(GRID - 1, Math.floor(row.rel_y * GRID));
    sec[cell] = (sec[cell] || 0) + 1;
  }
  return sections;
}

function countSessions(rows) {
  const seen = new Set();
  for (const row of rows) {
    if (row && row.session_id) seen.add(row.session_id);
  }
  return seen.size;
}

// Sessions per raw source value. A session that somehow carries two sources
// (a reload that picked up new UTM params) is counted once, under the first
// one seen, so the breakdown always sums to the session count.
function countSourceSessions(rows) {
  const sourceOf = new Map();
  for (const row of rows) {
    if (!row || !row.session_id || sourceOf.has(row.session_id)) continue;
    sourceOf.set(row.session_id, cleanSource(row.source));
  }
  const counts = {};
  for (const source of sourceOf.values()) {
    counts[source] = (counts[source] || 0) + 1;
  }
  return counts;
}

// Sessions per device, so an "all devices" total can show its own split
// instead of leaving the reader to guess which half they are looking at.
function countDeviceSessions(rows) {
  const deviceOf = new Map();
  for (const row of rows) {
    if (!row || !row.session_id || deviceOf.has(row.session_id)) continue;
    deviceOf.set(row.session_id, DEVICES.has(row.device) ? row.device : "mobile");
  }
  const counts = {};
  for (const device of deviceOf.values()) counts[device] = (counts[device] || 0) + 1;
  return counts;
}

// Sessions per campaign, first value per session wins for the same reason.
// The empty campaign is every organic visit plus every untagged ad — it can't
// be drilled into, so it never reaches the picker.
function countCampaignSessions(rows) {
  const campaignOf = new Map();
  for (const row of rows) {
    if (!row || !row.session_id || campaignOf.has(row.session_id)) continue;
    campaignOf.set(row.session_id, cleanCampaign(row.campaign));
  }
  const counts = {};
  for (const campaign of campaignOf.values()) {
    if (!campaign) continue;
    counts[campaign] = (counts[campaign] || 0) + 1;
  }
  return counts;
}

async function handleGet(req, res) {
  if (!viewKeyValid((req.query || {}).key)) return res.status(403).json({ error: "forbidden" });
  if (!configured()) return res.status(503).json({ error: "storage not configured" });

  const slice = sliceOf(req);
  if ((req.query || {}).mode === "trends") return handleTrends(res, slice);
  return handleAgg(res, slice);
}

async function handleAgg(res, slice) {
  const { v, d, p, s, c, windowDays, sinceParam, deviceClause, base, baseAll } = slice;

  // PostgREST has no group-by; volumes here are small (a landing page, capped
  // at 200 events/session), so fetch raw rows and bucket in the function.
  // Same for DISTINCT — the page list is deduped here.
  const [
    clicksRes,
    scrollsRes,
    pagesRes,
    rageRows,
    moveRows,
    formViewRows,
    leadRows,
    fieldRows,
    breakdownRows,
  ] = await Promise.all([
    fetch(`${base}&kind=eq.click&select=section_id,rel_x,rel_y&limit=50000`, { headers: headers() }),
    fetch(
      `${base}&kind=eq.scroll&select=session_id,scroll_pct,reached_section,device,source&limit=20000`,
      { headers: headers() }
    ),
    fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?ts=gte.${sinceParam}${deviceClause}` +
        `&select=page&limit=2000`,
      { headers: headers() }
    ),
    fetchRows(`${base}&kind=eq.rage&select=section_id,rel_x,rel_y&limit=20000`),
    fetchRows(`${base}&kind=eq.move&select=section_id,rel_x,rel_y&limit=50000`),
    fetchRows(`${base}&kind=eq.form_view&select=session_id&limit=20000`),
    fetchRows(`${base}&kind=eq.lead&select=session_id&limit=20000`),
    fetchRows(`${base}&kind=eq.form_field&select=session_id,section_id,reached_section&limit=20000`),
    // Deliberately on baseAll: the breakdowns are the whole picture of the
    // slice, which is what tells Ronen whether a filter is worth applying.
    // One row set feeds both — a campaign missing from the list because the
    // current filter hides it would be a campaign he can never get back to.
    fetchRows(`${baseAll}&kind=eq.scroll&select=session_id,source,campaign,device&limit=20000`),
  ]);
  if (!clicksRes.ok || !scrollsRes.ok) {
    return res.status(502).json({ error: "storage query failed" });
  }
  const clicks = await clicksRes.json();
  const scrolls = await scrollsRes.json();

  // The page picker must never be the reason the view fails — "/" always exists.
  const pageSet = new Set([DEFAULT_PAGE, p]);
  if (pagesRes.ok) {
    for (const row of await pagesRes.json()) {
      const clean = cleanPage(row && row.page);
      if (clean) pageSet.add(clean);
    }
  }
  const pages = [...pageSet].sort((a, b) =>
    a === DEFAULT_PAGE ? -1 : b === DEFAULT_PAGE ? 1 : a.localeCompare(b)
  );

  const sections = bucketPoints(clicks);

  // Per field: how many distinct sessions focused / abandoned / completed it.
  const fieldSessions = {};
  for (const row of fieldRows) {
    if (!row || !FIELD_ACTIONS.has(row.reached_section) || !row.section_id) continue;
    const field = (fieldSessions[row.section_id] ||= {
      focus: new Set(),
      abandon: new Set(),
      complete: new Set(),
    });
    if (row.session_id) field[row.reached_section].add(row.session_id);
  }
  const fields = {};
  for (const [name, actions] of Object.entries(fieldSessions)) {
    fields[name] = {
      focus: actions.focus.size,
      abandon: actions.abandon.size,
      complete: actions.complete.size,
    };
  }

  // A visit sends a scroll record on every visibilitychange, so a single
  // visitor leaves several rows — usually a deep one and a few shallow ones
  // from tabbing away. Counting rows inflated the visitor count and dragged
  // the depth curve down; only the deepest row per session is that session.
  const deepest = new Map();
  for (const s of scrolls) {
    if (!s || !s.session_id) continue;
    const prev = deepest.get(s.session_id);
    if (!prev || (+s.scroll_pct || 0) > (+prev.scroll_pct || 0)) deepest.set(s.session_id, s);
  }

  // Scroll → % of sessions reaching each 10% bucket (cumulative),
  // plus how many sessions got at least as deep as each section.
  const buckets = Array(11).fill(0);
  const reach = {};
  for (const s of deepest.values()) {
    const b = Math.min(10, Math.floor(s.scroll_pct / 10));
    for (let i = 0; i <= b; i++) buckets[i]++;
    if (s.reached_section) reach[s.reached_section] = (reach[s.reached_section] || 0) + 1;
  }

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    page: p,
    pages,
    variant: v,
    device: d,
    src: s,
    // Describes the slice on screen. The campaign picker below stays on
    // baseAll: a filter must never hide the way back out of itself.
    sources: countSourceSessions([...deepest.values()]),
    camp: c,
    campaigns: countCampaignSessions(breakdownRows),
    devices: countDeviceSessions([...deepest.values()]),
    days: windowDays,
    grid: GRID,
    total_clicks: clicks.length,
    total_scroll_sessions: deepest.size,
    sections,
    scroll_buckets: buckets,
    deepest_section_counts: reach,
    rage: { total: rageRows.length, sections: bucketPoints(rageRows) },
    moves: { total: moveRows.length, sections: bucketPoints(moveRows) },
    funnel: {
      sessions: deepest.size,
      form_view: countSessions(formViewRows),
      leads: countSessions(leadRows),
    },
    forms: { fields },
  });
}

function utcDate(value) {
  const ms = typeof value === "number" ? value : Date.parse(value);
  return Number.isNaN(ms) ? null : new Date(ms).toISOString().slice(0, 10);
}

// Every UTC day the window touches, oldest→newest. The first day is partial
// (the window starts mid-day), but dropping it would silently lose events.
function utcDays(fromIso, toMs) {
  const days = [];
  let cursor = Date.parse(`${utcDate(fromIso)}T00:00:00Z`);
  const last = Date.parse(`${utcDate(toMs)}T00:00:00Z`);
  while (cursor <= last) {
    days.push(utcDate(cursor));
    cursor += DAY_MS;
  }
  return days;
}

async function handleTrends(res, slice) {
  const rows = await fetchRows(`${slice.base}&select=ts,kind,session_id&limit=50000`);

  const byDate = new Map();
  for (const row of rows) {
    const date = row && row.ts ? utcDate(row.ts) : null;
    if (!date) continue;
    let day = byDate.get(date);
    if (!day) {
      day = { sessions: new Set(), clicks: 0, leads: new Set() };
      byDate.set(date, day);
    }
    if (row.session_id) day.sessions.add(row.session_id);
    if (row.kind === "click") day.clicks += 1;
    if (row.kind === "lead" && row.session_id) day.leads.add(row.session_id);
  }

  const series = utcDays(slice.since, Date.now()).map((date) => {
    const day = byDate.get(date);
    return {
      date,
      sessions: day ? day.sessions.size : 0,
      clicks: day ? day.clicks : 0,
      leads: day ? day.leads.size : 0,
    };
  });

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    page: slice.p,
    variant: slice.v,
    device: slice.d,
    src: slice.s,
    camp: slice.c,
    days: slice.windowDays,
    series,
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
