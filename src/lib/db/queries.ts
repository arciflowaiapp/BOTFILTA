import { createServiceClient } from "@/lib/supabase/server";

export interface WorkspaceSettings {
  workspace_id: string;
  whatsapp_access_token: string | null;
  whatsapp_phone_number_id: string | null;
  whatsapp_verify_token: string | null;
  gemini_api_key: string | null;
  bot_enabled: boolean;
  business_name: string;
  business_description: string;
  ai_tone: "professional" | "friendly" | "casual";
  ai_language: "en" | "ur" | "both";
}

export async function getFirstWorkspaceId(): Promise<string | null> {
  try {
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("workspaces")
      .select("id")
      .limit(1)
      .single();
    return data?.id ?? null;
  } catch {
    return null;
  }
}

export async function getWorkspaceByPhoneNumberId(
  phoneNumberId: string
): Promise<string | null> {
  try {
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("workspaces")
      .select("id")
      .eq("whatsapp_phone_number_id", phoneNumberId)
      .single();
    return data?.id ?? null;
  } catch {
    return null;
  }
}

export async function getWorkspaceSettings(
  workspaceId: string
): Promise<WorkspaceSettings | null> {
  try {
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("workspace_settings")
      .select("*")
      .eq("workspace_id", workspaceId)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

export async function upsertWorkspaceSettings(
  workspaceId: string,
  settings: Partial<Omit<WorkspaceSettings, "workspace_id">>
): Promise<boolean> {
  try {
    const supabase = await createServiceClient();
    const { error } = await supabase.from("workspace_settings").upsert({
      workspace_id: workspaceId,
      ...settings,
    });
    return !error;
  } catch {
    return false;
  }
}

export async function findOrCreateCustomer(
  workspaceId: string,
  phone: string,
  name: string
): Promise<string | null> {
  try {
    const supabase = await createServiceClient();

    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("workspace_id", workspaceId)
      .eq("phone", phone)
      .single();

    if (existing) return existing.id;

    const { data: created } = await supabase
      .from("customers")
      .insert({ workspace_id: workspaceId, phone, name })
      .select("id")
      .single();

    return created?.id ?? null;
  } catch {
    return null;
  }
}

export async function findOrCreateConversation(
  workspaceId: string,
  customerId: string
): Promise<string | null> {
  try {
    const supabase = await createServiceClient();

    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("workspace_id", workspaceId)
      .eq("customer_id", customerId)
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (existing) return existing.id;

    const { data: created } = await supabase
      .from("conversations")
      .insert({ workspace_id: workspaceId, customer_id: customerId })
      .select("id")
      .single();

    return created?.id ?? null;
  } catch {
    return null;
  }
}

export async function saveMessage(params: {
  conversationId: string;
  workspaceId: string;
  direction: "inbound" | "outbound";
  content: string;
  senderType: "customer" | "agent" | "ai" | "system";
  whatsappMessageId?: string;
  type?: string;
}): Promise<boolean> {
  try {
    const supabase = await createServiceClient();
    const { error } = await supabase.from("messages").insert({
      conversation_id: params.conversationId,
      workspace_id: params.workspaceId,
      direction: params.direction,
      content: params.content,
      sender_type: params.senderType,
      whatsapp_message_id: params.whatsappMessageId,
      type: params.type ?? "text",
    });
    return !error;
  } catch {
    return false;
  }
}

export async function updateConversationLastMessage(
  conversationId: string,
  lastMessage: string,
  incrementUnread = false
): Promise<void> {
  try {
    const supabase = await createServiceClient();
    const update: Record<string, unknown> = {
      last_message: lastMessage,
      last_message_at: new Date().toISOString(),
    };
    if (incrementUnread) {
      const { data } = await supabase
        .from("conversations")
        .select("unread_count")
        .eq("id", conversationId)
        .single();
      update.unread_count = (data?.unread_count ?? 0) + 1;
    }
    await supabase
      .from("conversations")
      .update(update)
      .eq("id", conversationId);
  } catch {
  }
}

export async function saveAILog(params: {
  workspaceId: string;
  conversationId?: string;
  inputText: string;
  outputText: string;
  intent?: string;
  language?: string;
  tokensUsed?: number;
}): Promise<void> {
  try {
    const supabase = await createServiceClient();
    await supabase.from("ai_conversation_logs").insert({
      workspace_id: params.workspaceId,
      conversation_id: params.conversationId,
      input_text: params.inputText,
      output_text: params.outputText,
      intent: params.intent,
      language: params.language,
      prompt_tokens: params.tokensUsed ?? 0,
      completion_tokens: 0,
    });
  } catch {
  }
}

export async function getDashboardStats(workspaceId: string) {
  try {
    const supabase = await createServiceClient();

    const [customersRes, messagesRes, conversationsRes, aiLogsRes] =
      await Promise.all([
        supabase
          .from("customers")
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspaceId),
        supabase
          .from("messages")
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspaceId),
        supabase
          .from("conversations")
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspaceId)
          .eq("status", "open"),
        supabase
          .from("ai_conversation_logs")
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspaceId),
      ]);

    return {
      totalContacts: customersRes.count ?? 0,
      totalMessages: messagesRes.count ?? 0,
      activeConversations: conversationsRes.count ?? 0,
      aiReplies: aiLogsRes.count ?? 0,
    };
  } catch {
    return {
      totalContacts: 0,
      totalMessages: 0,
      activeConversations: 0,
      aiReplies: 0,
    };
  }
}
