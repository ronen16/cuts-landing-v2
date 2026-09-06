// Vercel Serverless Function — POST /api/lead
// Creates a Monday item for every lead submitted from the landing page form.
// Replaces the previous Make webhook integration, which kept failing with
// "Invalid column values' definition" — Make's internal column encoder needs
// rich UI-only metadata that the API can't provide. Direct GraphQL bypasses it.

import { createHash } from "node:crypto";

const MONDAY_API_URL = "https://api.monday.com/v2";
const BOARD_ID = 5091244482;
const GROUP_ID = "group_mkyptfa0";

// ── Meta Conversions API ───────────────────────────────────────────────────────
// The browser pixel misses whatever an ad blocker or ITP eats, and it can only offer
// Meta a cookie. This server has the things that actually match a conversion back to
// the click: the fbclid the visitor arrived with, their IP and user agent, and the
// phone they just typed. Sent alongside the pixel and deduplicated by event_id, so
// Meta counts one lead, matched far better.
//
// Two switches, both off by default — deploying this file sends nothing:
//   META_CAPI_ENABLED=1  turns sending on
//   META_CAPI_TEST_CODE  routes events to Events Manager's Test Events tool
const GRAPH_URL = "https://graph.facebook.com/v23.0";

const sha256 = (value) => {
  const text = String(value || "").trim().toLowerCase();
  return text ? createHash("sha256").update(text).digest("hex") : "";
};

function metaEnabled() {
  return ["1", "true", "yes"].includes(String(process.env.META_CAPI_ENABLED || "").trim());
}

// Meta's click id cookie format. The visitor never had the cookie set for us (we
// never wrote one), so it is rebuilt from the fbclid we stored on the first landing.
function buildFbc(attribution) {
  const fbclid = (attribution && attribution.fbclid) || "";
  if (!fbclid) return "";
  const landed = Date.parse((attribution && attribution.landed_at) || "") || Date.now();
  return `fb.1.${landed}.${fbclid}`;
}

async function sendLeadToMeta({ body, phoneNorm, email, fullName, clientId, req }) {
  if (!metaEnabled()) return { sent: false, reason: "disabled" };
  const token = process.env.META_CAPI_TOKEN;
  const pixel = process.env.META_PIXEL_ID;
  if (!token || !pixel) return { sent: false, reason: "not-configured" };

  const attribution = body.attribution || {};
  const nameParts = String(fullName || "").split(/\s+/).filter(Boolean);
  const userData = {
    ph: [sha256(phoneNorm)],
    country: [sha256("il")],
    client_ip_address: (req.headers["x-forwarded-for"] || "").split(",")[0].trim(),
    client_user_agent: req.headers["user-agent"] || "",
  };
  if (email) userData.em = [sha256(email)];
  if (nameParts.length) userData.fn = [sha256(nameParts[0])];
  if (nameParts.length > 1) userData.ln = [sha256(nameParts[nameParts.length - 1])];
  const fbc = buildFbc(attribution);
  if (fbc) userData.fbc = fbc;

  const event = {
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    // The same id the browser pixel reports, so Meta collapses the pair into one.
    event_id: clientId,
    event_source_url: body.page_url || "https://www.cuts.co.il/",
    user_data: userData,
  };

  const payload = new URLSearchParams({
    data: JSON.stringify([event]),
    access_token: token,
  });
  const testCode = String(process.env.META_CAPI_TEST_CODE || "").trim();
  if (testCode) payload.set("test_event_code", testCode);

  try {
    const res = await fetch(`${GRAPH_URL}/${pixel}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload,
    });
    const out = await res.json();
    if (!res.ok) {
      // Never log the URL or token — only Meta's own message.
      console.error(`[lead] capi rejected: ${res.status} ${(out.error || {}).message || ""}`);
      return { sent: false, reason: `http-${res.status}` };
    }
    console.log(`[lead] capi accepted ${out.events_received} event(s)` +
      (testCode ? ` (test ${testCode})` : "") + (fbc ? " with fbc" : " without fbc"));
    return { sent: true, fbc: !!fbc };
  } catch (err) {
    console.error("[lead] capi exception:", (err && err.message) || err);
    return { sent: false, reason: "exception" };
  }
}

// Monday column IDs (the suffix is opaque — never infer meaning from the
// prefix). Mapping verified against the working FB Lead Ads scenario blueprint.
const COL = {
  adName:   "text_mkyajcp2", // "שם מודעה"
  adset:    "text_mm28cbs2", // "סדרת מודעות"
  campaign: "text_mm28ekf2", // "קמפיין"
  platform: "text_mm28pjva", // "מיקום"
  phone:    "phone_mkyatssw",
  date:     "date_mkya6rts",
  source:   "color_mm28myj7",
};

function normalizePhone(raw) {
  const digits = String(raw || "").replace(/\D+/g, "");
  if (!digits) return "";
  if (digits.startsWith("972")) return digits;
  if (digits.startsWith("0")) return "972" + digits.slice(1);
  return digits;
}

// After the Monday item is created, forward the lead to a Make scenario that
// handles WhatsApp greeting + Tavily search + Claude research + Monday update.
// Make is better for that pipeline because (a) it's already wired with all the
// required service connections and (b) the message/research prompts are easy
// to edit in Make's UI without redeploying code.
//
// Best-effort — failures here don't change the 200 we return to the frontend,
// since the lead is already in Monday and the Make scenario can be replayed
// from its DLQ if anything downstream errors.
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/nljeo1gq5n7hk8q9vkgqamjjt12urc21";

async function forwardToMake(payload) {
  try {
    const res = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(`[lead] Make webhook failed: ${res.status}`);
      return { forwarded: false, status: res.status };
    }
    return { forwarded: true };
  } catch (err) {
    console.error("[lead] Make webhook exception:", err && err.message || err);
    return { forwarded: false, error: String(err && err.message || err) };
  }
}

// ── Durable lead store (Supabase) ──────────────────────────────────────────
// Every submission is upserted to Supabase BEFORE Monday, so a Monday/Make
// failure can never lose it. Uses the REST API (no SDK — matches the raw-fetch
// pattern used for Monday/Make). The service-role key is server-only and never
// reaches the client. If the env vars aren't set, all of this is skipped
// gracefully and the existing flow is unchanged.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const LEADS_TABLE = "landing_leads";

function supabaseConfigured() {
  return !!(SUPABASE_URL && SUPABASE_KEY);
}
function supabaseHeaders(extra) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

// Upsert a lead (idempotent on client_id) and return the stored row (or null).
async function upsertLead(row) {
  if (!supabaseConfigured()) return null;
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${LEADS_TABLE}?on_conflict=client_id`, {
      method: "POST",
      headers: supabaseHeaders({ Prefer: "resolution=merge-duplicates,return=representation" }),
      body: JSON.stringify(row),
    });
    if (!r.ok) {
      console.error(`[lead] supabase upsert failed: ${r.status} ${(await r.text()).slice(0, 200)}`);
      return null;
    }
    const rows = await r.json();
    return Array.isArray(rows) ? rows[0] : rows;
  } catch (e) {
    console.error("[lead] supabase upsert exception:", (e && e.message) || e);
    return null;
  }
}

// Defense in depth against the customer being spammed. A correct submit creates
// exactly one lead, but if several still slip through (double-tap that survives
// across a reload, two devices, a client regression) we must not create a Monday
// item + fire a WhatsApp for each. Returns true when this phone already produced
// a Monday item within the last `windowMs`. Note: this can't catch a same-instant
// burst (none of the racing rows has a monday_item_id yet) — the client-side
// re-entry guard handles that; this covers duplicates that arrive seconds apart.
async function phoneRecentlyLanded(phoneNorm, clientId, windowMs = 120000) {
  if (!supabaseConfigured() || !phoneNorm) return false;
  try {
    const since = new Date(Date.now() - windowMs).toISOString();
    const q = `${SUPABASE_URL}/rest/v1/${LEADS_TABLE}` +
      `?select=client_id&phone_normalized=eq.${encodeURIComponent(phoneNorm)}` +
      `&monday_item_id=not.is.null&created_at=gte.${encodeURIComponent(since)}` +
      `&client_id=neq.${encodeURIComponent(clientId)}&limit=1`;
    const r = await fetch(q, { headers: supabaseHeaders() });
    if (!r.ok) return false;
    const rows = await r.json();
    return Array.isArray(rows) && rows.length > 0;
  } catch (e) {
    console.error("[lead] phone-dedup exception:", (e && e.message) || e);
    return false;
  }
}

// Best-effort patch of a stored lead after Monday responds.
async function patchLead(clientId, patch) {
  if (!supabaseConfigured() || !clientId) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/${LEADS_TABLE}?client_id=eq.${encodeURIComponent(clientId)}`, {
      method: "PATCH",
      headers: supabaseHeaders({ Prefer: "return=minimal" }),
      body: JSON.stringify(patch),
    });
  } catch (e) {
    console.error("[lead] supabase patch exception:", (e && e.message) || e);
  }
}

function nowInJerusalem() {
  // Monday's date column expects { date: "YYYY-MM-DD", time: "HH:MM:SS" }.
  // Vercel functions run in UTC; format explicitly in Asia/Jerusalem.
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const g = (t) => parts.find((p) => p.type === t).value;
  return { date: `${g("year")}-${g("month")}-${g("day")}`, time: `${g("hour")}:${g("minute")}:${g("second")}` };
}

// ── GET: recent leads with their delivery status, for triage ───────────────
// Answers "Ads Manager says N leads — did they all reach Monday?" without
// Supabase credentials. Gated by the same view key as the heatmap dashboard;
// the data is Ronen's own leads.
const VIEW_KEY = process.env.HEATMAP_VIEW_KEY;
const VIEW_KEY_SHA256 = "67db196eab780f203604bc0f0c925d8117ef16bf29619850d2f1a0643638a348";

function viewKeyValid(key) {
  if (typeof key !== "string" || !key) return false;
  if (VIEW_KEY) return key === VIEW_KEY;
  return createHash("sha256").update(key).digest("hex") === VIEW_KEY_SHA256;
}

async function listRecentLeads(req, res) {
  if (!viewKeyValid((req.query || {}).key)) return res.status(403).json({ error: "forbidden" });
  if (!supabaseConfigured()) return res.status(503).json({ error: "storage not configured" });
  const days = Math.min(30, Math.max(1, parseInt((req.query || {}).days, 10) || 3));
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const q = `${SUPABASE_URL}/rest/v1/${LEADS_TABLE}` +
    `?select=created_at,full_name,phone_normalized,status,monday_item_id,ad_name,campaign_name,source` +
    `&created_at=gte.${encodeURIComponent(since)}&order=created_at.desc&limit=100`;
  const r = await fetch(q, { headers: supabaseHeaders() });
  if (!r.ok) return res.status(502).json({ error: `query failed: ${r.status}` });
  return res.status(200).json({ since, leads: await r.json() });
}

export default async function handler(req, res) {
  if (req.method === "GET") return listRecentLeads(req, res);
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method-not-allowed" });
  }

  const body = req.body || {};
  const data = body.data || {};
  const fullName = String(data.full_name || "").trim();
  const phoneRaw = String(data.phone_number || "").trim();

  if (!fullName || !phoneRaw) {
    return res.status(400).json({ error: "missing-required-fields" });
  }

  // Shared fields used by both the durable store and Monday.
  // Source ("מקור הגעה"): a Meta-campaign click (fbclid / a facebook|instagram
  // utm_source) reads "מטא"; everything else is organic and reads "דף נחיתה".
  const attr = body.attribution || {};
  const utmSource = String(attr.utm_source || "").toLowerCase();
  const isMeta = !!(attr.fbclid || /facebook|fb|instagram|ig|meta/.test(utmSource));
  const source = isMeta ? "מטא" : "דף נחיתה";
  const phoneNorm = normalizePhone(phoneRaw);
  const adName       = String(body.adName       || "").trim();
  const adsetName    = String(body.adsetName    || "").trim();
  const campaignName = String(body.campaignName || "").trim();
  const clientId = String(body.client_id || "").trim() ||
    `srv-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  // ── Durable save FIRST — before Monday, so nothing downstream can lose it.
  const stored = await upsertLead({
    client_id: clientId,
    full_name: fullName,
    phone: phoneRaw,
    phone_normalized: phoneNorm,
    email: String(data.email || "").trim() || null,
    platform: String(body.platform || "אורגני"),
    source,
    ad_name: adName || null,
    adset_name: adsetName || null,
    campaign_name: campaignName || null,
    ab_variant: String(body.ab_variant || "").trim() || null,
    attribution: body.attribution || null,
    raw: body,
    status: "received",
  });
  // Replay dedup: this submission already produced a Monday item — don't repeat.
  if (stored && stored.monday_item_id) {
    // The upsert above just reset status to "received"; put the truth back so
    // the status column stays readable in triage.
    await patchLead(clientId, { status: "monday_ok" });
    return res.status(200).json({ ok: true, item_id: stored.monday_item_id, deduped: true });
  }

  // Phone-window dedup: same number already landed a Monday item moments ago —
  // this is a duplicate submission, not a new lead. Skip Monday + Make so the
  // customer isn't added repeatedly and messaged repeatedly.
  if (await phoneRecentlyLanded(phoneNorm, clientId)) {
    console.log(`[lead] skipping duplicate for ${phoneNorm} (recent Monday item exists)`);
    await patchLead(clientId, { status: "dup_phone" });
    return res.status(200).json({ ok: true, deduped: true, reason: "recent-phone" });
  }

  const token = process.env.MONDAY_API_TOKEN;
  if (!token) {
    console.error("[lead] MONDAY_API_TOKEN env var is not set");
    return res.status(500).json({ error: "server-misconfigured" });
  }

  // Always-populated columns: phone, date, source, and platform ("אורגני" for
  // organic). The ad/adset/campaign columns are only included when the frontend
  // captured real attribution from the URL, else they stay empty in Monday.
  const columnValues = {
    [COL.platform]: String(body.platform || "אורגני"),
    [COL.phone]:    { phone: phoneNorm, countryShortName: "IL" },
    [COL.date]:     nowInJerusalem(),
    [COL.source]:   { label: source },
  };
  if (adName)       columnValues[COL.adName]   = adName;
  if (adsetName)    columnValues[COL.adset]    = adsetName;
  if (campaignName) columnValues[COL.campaign] = campaignName;

  const mutation = `mutation ($name: String!, $cols: JSON!) {
    create_item(
      board_id: ${BOARD_ID},
      group_id: "${GROUP_ID}",
      item_name: $name,
      column_values: $cols,
      create_labels_if_missing: true
    ) { id }
  }`;

  try {
    const mondayRes = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
        "API-Version": "2024-01",
      },
      body: JSON.stringify({
        query: mutation,
        variables: { name: fullName, cols: JSON.stringify(columnValues) },
      }),
    });

    const out = await mondayRes.json();

    if (!mondayRes.ok || out.errors || out.error_message) {
      console.error("[lead] monday error:", JSON.stringify(out));
      await patchLead(clientId, { status: "monday_failed" });
      return res.status(502).json({ error: "monday-failed", detail: out, saved: !!stored });
    }

    const itemId = out?.data?.create_item?.id;
    if (!itemId) {
      console.error("[lead] monday returned no item id:", JSON.stringify(out));
      await patchLead(clientId, { status: "monday_no_id" });
      return res.status(502).json({ error: "monday-no-id", detail: out, saved: !!stored });
    }

    console.log(`[lead] created Monday item ${itemId} for "${fullName}" (${phoneNorm})`);
    await patchLead(clientId, { monday_item_id: itemId, status: "monday_ok" });

    // Both are awaited so they finish before Vercel kills the instance, and both are
    // best-effort: the lead is already in Monday, so neither can change the 200.
    const [enrichment, capi] = await Promise.all([
      forwardToMake({ ...body, item_id: itemId, phone_normalized: phoneNorm }),
      sendLeadToMeta({
        body,
        phoneNorm,
        email: String(data.email || "").trim(),
        fullName,
        clientId,
        req,
      }),
    ]);
    return res.status(200).json({ ok: true, item_id: itemId, enrichment, capi });
  } catch (err) {
    console.error("[lead] exception:", err?.message || err);
    await patchLead(clientId, { status: "monday_error" });
    return res.status(500).json({ error: "internal", message: String(err?.message || err), saved: !!stored });
  }
}
