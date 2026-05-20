import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

function createFallbackClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => ({
        data: null, error: null, count: 0,
        eq: function() { return this; },
        or: function() { return this; },
        order: function() { return this; },
        limit: function() { return this; },
        gte: function() { return this; },
        lt: function() { return this; },
        ilike: function() { return this; },
        single: function() { return { data: null, error: null }; },
        head: false,
      }),
      insert: () => ({ data: null, error: null, select: () => ({ single: () => ({ data: null, error: null }) }) }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
      upsert: () => ({ data: null, error: null, select: () => ({ single: () => ({ data: null, error: null }) }) }),
      eq: function() { return this; },
      single: function() { return { data: null, error: null }; },
    }),
  } as unknown as ReturnType<typeof createSupabaseClient>;
}

export async function createClient() {
  if (!isSupabaseConfigured) return createFallbackClient();

  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
        }
      },
    },
  });
}

export async function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return createFallbackClient();

  const { createClient } = await import("@supabase/supabase-js");
  return createClient(supabaseUrl, serviceKey);
}
