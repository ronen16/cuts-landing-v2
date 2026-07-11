// Vercel Serverless Function — POST /api/lead
// Creates a Monday item for every lead submitted from the landing page form.
// Replaces the previous Make webhook integration, which kept failing with
// "Invalid column values' definition" — Make's internal column encoder needs
// rich UI-only metadata that the API can't provide. Direct GraphQL bypasses it.

const MONDAY_API_URL = "https://api.monday.com/v2";
const BOARD_ID = 5091244482;
const GROUP_ID = "group_mkyptfa0";

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

export default async function handler(req, res) {
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
    return res.status(200).json({ ok: true, item_id: stored.monday_item_id, deduped: true });
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

    // Forward to Make for WhatsApp + research pipeline. Awaited so the call
    // completes before Vercel kills the instance; best-effort — failures
    // don't change the 200 response since the lead is already in Monday.
    const enrichment = await forwardToMake({
      ...body,
      item_id: itemId,
      phone_normalized: phoneNorm,
    });
    return res.status(200).json({ ok: true, item_id: itemId, enrichment });
  } catch (err) {
    console.error("[lead] exception:", err?.message || err);
    await patchLead(clientId, { status: "monday_error" });
    return res.status(500).json({ error: "internal", message: String(err?.message || err), saved: !!stored });
  }
}
