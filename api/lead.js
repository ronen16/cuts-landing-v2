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

// Send a WhatsApp greeting via Green API. Best-effort — we still return 200
// to the frontend even if WhatsApp fails, because the lead is already in
// Monday. Gracefully no-ops if the env vars are not configured.
async function sendWhatsApp(phoneIntl, fullName) {
  const instance = process.env.GREEN_API_INSTANCE_ID;
  const token = process.env.GREEN_API_TOKEN;
  if (!instance || !token) {
    return { sent: false, reason: "not-configured" };
  }
  // Green API uses sharded hosts for newer instances — the shard is the
  // 4-digit prefix of the instance id. e.g. 7105278107 → 7105.api.green-api.com
  const host = process.env.GREEN_API_HOST || `${String(instance).slice(0, 4)}.api.green-api.com`;
  const firstName = String(fullName || "").trim().split(/\s+/)[0] || "";
  const message =
    `היי${firstName ? " " + firstName : ""}, ראיתי שהשארת לנו פרטים לגבי האולפן פודקאסטים שלנו\n` +
    `מסקרן אותי לשמוע, מה הנושא של הפודקאסט?`;
  const url = `https://${host}/waInstance${instance}/sendMessage/${token}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: `${phoneIntl}@c.us`,
        message,
        linkPreview: false,
      }),
    });
    const out = await res.json().catch(() => ({}));
    if (res.ok && out.idMessage) {
      console.log(`[lead] WhatsApp sent to ${phoneIntl}, idMessage=${out.idMessage}`);
      return { sent: true, idMessage: out.idMessage };
    }
    console.error(`[lead] WhatsApp failed: ${res.status}`, JSON.stringify(out));
    return { sent: false, status: res.status, detail: out };
  } catch (err) {
    console.error("[lead] WhatsApp exception:", err && err.message || err);
    return { sent: false, error: String(err && err.message || err) };
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

  const token = process.env.MONDAY_API_TOKEN;
  if (!token) {
    console.error("[lead] MONDAY_API_TOKEN env var is not set");
    return res.status(500).json({ error: "server-misconfigured" });
  }

  // Always-populated columns: phone, date, source, and platform (which is
  // "אורגני" for organic visitors). The ad/adset/campaign columns are only
  // included when the frontend captured real attribution from the URL —
  // otherwise they stay empty in Monday so it's visually clear the lead
  // didn't come from a tracked campaign.
  const columnValues = {
    [COL.platform]: String(body.platform || "אורגני"),
    [COL.phone]:    { phone: normalizePhone(phoneRaw), countryShortName: "IL" },
    [COL.date]:     nowInJerusalem(),
    [COL.source]:   { label: "דף נחיתה" },
  };
  const adName       = String(body.adName       || "").trim();
  const adsetName    = String(body.adsetName    || "").trim();
  const campaignName = String(body.campaignName || "").trim();
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
      return res.status(502).json({ error: "monday-failed", detail: out });
    }

    const itemId = out?.data?.create_item?.id;
    if (!itemId) {
      console.error("[lead] monday returned no item id:", JSON.stringify(out));
      return res.status(502).json({ error: "monday-no-id", detail: out });
    }

    console.log(`[lead] created Monday item ${itemId} for "${fullName}" (${normalizePhone(phoneRaw)})`);

    // Send WhatsApp greeting (awaited so the function completes the call
    // before Vercel kills the instance; best-effort — failures don't change
    // the 200 response since the lead is already in Monday).
    const whatsapp = await sendWhatsApp(normalizePhone(phoneRaw), fullName);
    return res.status(200).json({ ok: true, item_id: itemId, whatsapp });
  } catch (err) {
    console.error("[lead] exception:", err?.message || err);
    return res.status(500).json({ error: "internal", message: String(err?.message || err) });
  }
}
