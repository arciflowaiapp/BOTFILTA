import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

const createSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
  tags: z.array(z.string()).optional().default([]),
  notes: z.string().optional(),
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

export async function GET(req: NextRequest) {
  try {
    const workspaceId = await getWorkspaceId();
    if (!workspaceId) {
      return NextResponse.json({ contacts: [], demo: true });
    }

    const supabase = await createServiceClient();
    const url = new URL(req.url);
    const search = url.searchParams.get("search") ?? "";
    const limit = parseInt(url.searchParams.get("limit") ?? "50");

    let query = supabase
      .from("customers")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ contacts: data ?? [] });
  } catch (error) {
    console.error("GET /api/contacts error:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const workspaceId = await getWorkspaceId();
    if (!workspaceId) {
      return NextResponse.json({ error: "No workspace found. Please configure Supabase." }, { status: 400 });
    }

    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("customers")
      .insert({
        workspace_id: workspaceId,
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        tags: parsed.data.tags,
        notes: parsed.data.notes || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "A contact with this phone number already exists." }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ contact: data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/contacts error:", error);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const workspaceId = await getWorkspaceId();
    if (!workspaceId) return NextResponse.json({ error: "No workspace" }, { status: 400 });

    const supabase = await createServiceClient();
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id)
      .eq("workspace_id", workspaceId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/contacts error:", error);
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}
