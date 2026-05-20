// Uses plain fetch to call Supabase REST API — no Realtime/WebSocket needed
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const waToken = process.env.WHATSAPP_ACCESS_TOKEN || "";
const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
const waBizId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || "";
const waVerify = process.env.WHATSAPP_VERIFY_TOKEN || "botfilta_webhook_verify_2024";
const geminiKey = process.env.GEMINI_API_KEY || "";

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const headers = {
  "apikey": serviceKey,
  "Authorization": `Bearer ${serviceKey}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation",
};

async function query(path, options = {}) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers,
    ...options,
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { json = text; }
  return { ok: res.ok, status: res.status, data: json };
}

async function run() {
  console.log("🔗 Connecting to:", supabaseUrl);

  // Step 1: Check if workspaces table exists
  const check = await query("workspaces?select=id&limit=1");
  if (!check.ok) {
    if (check.status === 404 || (typeof check.data === "object" && check.data?.code === "42P01")) {
      console.error("\n❌ Tables not found. Please run the schema SQL first:");
      console.error("   → https://supabase.com/dashboard/project/cdhcbtzllnvaguzgfdum/editor");
      console.error("   1. Paste contents of: supabase/schema.sql  → Run");
      console.error("   2. Paste contents of: supabase/schema-additions.sql  → Run");
    } else {
      console.error("❌ Could not connect to Supabase:", JSON.stringify(check.data));
    }
    process.exit(1);
  }

  console.log("✅ Tables exist.");

  // Step 2: Check for existing workspace
  const existing = await query("workspaces?select=id,name&limit=1");
  let workspaceId = null;

  if (existing.ok && Array.isArray(existing.data) && existing.data.length > 0) {
    workspaceId = existing.data[0].id;
    console.log("✅ Workspace found:", existing.data[0].name, `(${workspaceId})`);
  } else {
    // Step 3: Create default workspace
    const created = await query("workspaces", {
      method: "POST",
      body: JSON.stringify({
        name: "BOTFILTA Store",
        slug: "botfilta-store",
        whatsapp_phone_number_id: waPhoneId,
        whatsapp_business_account_id: waBizId,
        plan: "starter",
      }),
    });

    if (!created.ok) {
      console.error("❌ Failed to create workspace:", JSON.stringify(created.data));
      process.exit(1);
    }

    const ws = Array.isArray(created.data) ? created.data[0] : created.data;
    workspaceId = ws.id;
    console.log("✅ Created workspace:", ws.name, `(${workspaceId})`);
  }

  // Step 4: Upsert workspace settings with real API keys
  const settingsRes = await query("workspace_settings", {
    method: "POST",
    headers: { ...headers, "Prefer": "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({
      workspace_id: workspaceId,
      whatsapp_access_token: waToken,
      whatsapp_phone_number_id: waPhoneId,
      whatsapp_verify_token: waVerify,
      gemini_api_key: geminiKey,
      bot_enabled: true,
      business_name: "BOTFILTA Store",
      business_description: "Premium fashion and lifestyle products with fast delivery across Pakistan.",
      ai_tone: "friendly",
      ai_language: "both",
    }),
  });

  if (!settingsRes.ok) {
    if (settingsRes.status === 404 || settingsRes.data?.code === "42P01") {
      console.warn("⚠️  workspace_settings table missing — run supabase/schema-additions.sql");
    } else {
      console.error("⚠️  Settings save issue:", JSON.stringify(settingsRes.data));
    }
  } else {
    console.log("✅ Workspace settings saved (WhatsApp + Gemini keys stored in DB).");
  }

  console.log("\n🎉 Setup complete! Workspace ID:", workspaceId);
  console.log("   The app will now use this workspace for all data.");
}

run().catch(console.error);
