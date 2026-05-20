import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

const settingsSchema = z.object({
  whatsapp_access_token: z.string().optional(),
  whatsapp_phone_number_id: z.string().optional(),
  whatsapp_verify_token: z.string().optional(),
  gemini_api_key: z.string().optional(),
  bot_enabled: z.boolean().optional(),
  business_name: z.string().optional(),
  business_description: z.string().optional(),
  ai_tone: z.enum(["professional", "friendly", "casual"]).optional(),
  ai_language: z.enum(["en", "ur", "both"]).optional(),
});

async function getWorkspaceId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("workspace_id")
      .eq("id", user.id)
      .single();

    return profile?.workspace_id ?? null;
  } catch {
    const service = await createServiceClient();
    const { data } = await service.from("workspaces").select("id").limit(1).single();
    return data?.id ?? null;
  }
}

export async function GET() {
  try {
    const workspaceId = await getWorkspaceId();
    if (!workspaceId) {
      return NextResponse.json({ settings: getDefaultSettings() });
    }

    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("workspace_settings")
      .select("*")
      .eq("workspace_id", workspaceId)
      .single();

    return NextResponse.json({ settings: data ?? getDefaultSettings() });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ settings: getDefaultSettings() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const workspaceId = await getWorkspaceId();
    if (!workspaceId) {
      return NextResponse.json({ error: "No workspace found. Please configure Supabase and create a workspace." }, { status: 400 });
    }

    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("workspace_settings")
      .upsert({ workspace_id: workspaceId, ...parsed.data })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ settings: data, success: true });
  } catch (error) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}

function getDefaultSettings() {
  return {
    whatsapp_access_token: null,
    whatsapp_phone_number_id: null,
    whatsapp_verify_token: "botfilta_verify_2024",
    gemini_api_key: null,
    bot_enabled: true,
    business_name: "BOTFILTA Store",
    business_description: "Premium fashion and lifestyle products with fast delivery across Pakistan.",
    ai_tone: "friendly",
    ai_language: "both",
  };
}
