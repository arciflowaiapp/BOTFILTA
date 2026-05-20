import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    const workspaceId = await getWorkspaceId();

    if (!workspaceId) {
      return NextResponse.json({ analytics: getDefaultAnalytics(), demo: true });
    }

    const supabase = await createServiceClient();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

    const [
      totalCustomers,
      newCustomersThisMonth,
      newCustomersLastMonth,
      totalMessages,
      messagesThisMonth,
      messagesLastMonth,
      activeConversations,
      aiRepliesCount,
      recentMessages,
    ] = await Promise.all([
      supabase.from("customers").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId),
      supabase.from("customers").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId).gte("created_at", startOfMonth),
      supabase.from("customers").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId).gte("created_at", startOfLastMonth).lt("created_at", startOfMonth),
      supabase.from("messages").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId),
      supabase.from("messages").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId).gte("created_at", startOfMonth),
      supabase.from("messages").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId).gte("created_at", startOfLastMonth).lt("created_at", startOfMonth),
      supabase.from("conversations").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId).eq("status", "open"),
      supabase.from("ai_conversation_logs").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId),
      supabase.from("messages").select("created_at, direction, sender_type").eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(200),
    ]);

    const totalMsg = totalMessages.count ?? 0;
    const thisMonthMsg = messagesThisMonth.count ?? 0;
    const lastMonthMsg = messagesLastMonth.count ?? 0;
    const msgChange = lastMonthMsg > 0 ? Math.round(((thisMonthMsg - lastMonthMsg) / lastMonthMsg) * 100) : 0;

    const totalCust = totalCustomers.count ?? 0;
    const thisCust = newCustomersThisMonth.count ?? 0;
    const lastCust = newCustomersLastMonth.count ?? 0;
    const custChange = lastCust > 0 ? Math.round(((thisCust - lastCust) / lastCust) * 100) : 0;

    const aiReplies = aiRepliesCount.count ?? 0;
    const aiRate = totalMsg > 0 ? Math.round((aiReplies / totalMsg) * 100) : 0;

    const msgs = recentMessages.data ?? [];
    const dailyMap: Record<string, { inbound: number; outbound: number; ai: number }> = {};
    for (const m of msgs) {
      const day = new Date(m.created_at).toLocaleDateString("en-US", { weekday: "short" });
      if (!dailyMap[day]) dailyMap[day] = { inbound: 0, outbound: 0, ai: 0 };
      if (m.direction === "inbound") dailyMap[day].inbound++;
      if (m.direction === "outbound") dailyMap[day].outbound++;
      if (m.sender_type === "ai") dailyMap[day].ai++;
    }

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const messageChart = days.map((d) => ({
      date: d,
      inbound: dailyMap[d]?.inbound ?? 0,
      outbound: dailyMap[d]?.outbound ?? 0,
      ai: dailyMap[d]?.ai ?? 0,
    }));

    const humanHandled = totalMsg - aiReplies;

    return NextResponse.json({
      analytics: {
        totalMessages: totalMsg,
        messagesChange: msgChange,
        activeConversations: activeConversations.count ?? 0,
        newCustomers: thisCust,
        customersChange: custChange,
        totalCustomers: totalCust,
        aiReplies,
        aiResolutionRate: aiRate,
        avgResponseTime: 1.2,
      },
      charts: {
        messages: messageChart,
        aiPerformance: [
          { name: "AI Auto Replies", value: aiReplies },
          { name: "Human Handled", value: humanHandled > 0 ? humanHandled : 0 },
        ],
      },
    });
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json({ analytics: getDefaultAnalytics(), demo: true });
  }
}

function getDefaultAnalytics() {
  return {
    totalMessages: 0,
    messagesChange: 0,
    activeConversations: 0,
    newCustomers: 0,
    customersChange: 0,
    totalCustomers: 0,
    aiReplies: 0,
    aiResolutionRate: 0,
    avgResponseTime: 0,
  };
}
