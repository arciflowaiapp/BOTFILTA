import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

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

export async function GET(req: NextRequest) {
  try {
    const workspaceId = await getWorkspaceId();
    if (!workspaceId) {
      return NextResponse.json({ conversations: [], demo: true });
    }

    const supabase = await createServiceClient();
    const url = new URL(req.url);
    const status = url.searchParams.get("status");

    let query = supabase
      .from("conversations")
      .select(`
        id,
        status,
        last_message,
        last_message_at,
        unread_count,
        tags,
        sentiment,
        created_at,
        customers (
          id,
          name,
          phone,
          sentiment
        )
      `)
      .eq("workspace_id", workspaceId)
      .order("last_message_at", { ascending: false })
      .limit(50);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;

    const conversations = (data ?? []).map((c: Record<string, unknown>) => {
      const customer = c.customers as Record<string, unknown> | null;
      return {
        id: c.id,
        status: c.status,
        last_message: c.last_message,
        last_message_at: c.last_message_at,
        unread_count: c.unread_count,
        tags: c.tags,
        sentiment: c.sentiment,
        created_at: c.created_at,
        customer_id: customer?.id ?? null,
        customer_name: customer?.name ?? "Unknown",
        customer_phone: customer?.phone ?? "",
      };
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("GET /api/conversations error:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}
