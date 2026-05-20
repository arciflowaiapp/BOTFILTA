import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAIService } from "@/lib/ai/service";
import { createServiceClient } from "@/lib/supabase/server";
import { saveMessage, updateConversationLastMessage, saveAILog } from "@/lib/db/queries";
import { mockProducts } from "@/lib/data/mock";
import type { AIConfig } from "@/types";

const schema = z.object({
  message: z.string().min(1),
  conversationId: z.string().optional(),
  customerId: z.string().optional(),
  workspaceId: z.string().optional(),
  mode: z.enum(["auto", "sales", "faq", "suggest", "sentiment"]).default("auto"),
  sendToWhatsApp: z.boolean().optional().default(false),
  recipientPhone: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { message, conversationId, customerId, workspaceId, mode, sendToWhatsApp, recipientPhone } = parsed.data;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        text: "BOTFILTA AI: Thank you for your message! Our team will get back to you shortly.",
        intent: "general_faq",
        language: "en",
        demo: true,
      });
    }

    let customer = null;
    let orders: unknown[] = [];
    let messages: unknown[] = [];
    let products = mockProducts;

    if (workspaceId && customerId) {
      const supabase = await createServiceClient();

      const [customerRes, ordersRes, messagesRes, productsRes] = await Promise.all([
        supabase.from("customers").select("*").eq("id", customerId).single(),
        supabase.from("orders").select("*").eq("customer_id", customerId).limit(5),
        conversationId
          ? supabase.from("messages").select("*").eq("conversation_id", conversationId).order("created_at", { ascending: false }).limit(20)
          : Promise.resolve({ data: [] }),
        supabase.from("products").select("*").eq("workspace_id", workspaceId).eq("is_active", true).limit(20),
      ]);

      customer = customerRes.data;
      orders = ordersRes.data ?? [];
      messages = (messagesRes.data ?? []).reverse();
      products = productsRes.data?.length ? productsRes.data : mockProducts;
    }

    const aiConfig: AIConfig = {
      auto_reply_enabled: true,
      suggested_replies_enabled: true,
      sales_assistant_enabled: true,
      faq_enabled: true,
      sentiment_detection_enabled: true,
      voice_to_text_enabled: true,
      language: "both",
      tone: "friendly",
      business_name: "BOTFILTA Store",
      business_description: "Premium fashion and lifestyle products with fast delivery across Pakistan.",
    };

    const ai = createAIService({ workspaceId: workspaceId ?? "ws-1", conversationId, config: aiConfig });

    let response;
    if (mode === "suggest") {
      const suggestions = await ai.getSuggestedReplies(message, products as never, customer, orders as never[], messages as never[]);
      return NextResponse.json({ suggestions });
    }
    if (mode === "sentiment") {
      const sentiment = await ai.analyzeSentiment(message);
      return NextResponse.json({ sentiment });
    }
    if (mode === "sales") {
      response = await ai.salesAssistant(message, products as never, customer, orders as never[], messages as never[]);
    } else if (mode === "faq") {
      response = await ai.faqReply(message, products as never, customer, orders as never[], messages as never[]);
    } else {
      response = await ai.autoReply(message, products as never, customer, orders as never[], messages as never[]);
    }

    if (workspaceId && conversationId) {
      await saveMessage({
        conversationId,
        workspaceId,
        direction: "outbound",
        content: response.text,
        senderType: "ai",
      });

      await updateConversationLastMessage(conversationId, response.text);

      await saveAILog({
        workspaceId,
        conversationId,
        inputText: message,
        outputText: response.text,
        intent: response.intent,
        language: response.language,
        tokensUsed: response.tokensUsed,
      });
    }

    if (sendToWhatsApp && recipientPhone) {
      const token = process.env.WHATSAPP_ACCESS_TOKEN;
      const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      if (token && phoneId) {
        const { createWhatsAppClient } = await import("@/lib/whatsapp/client");
        const wa = createWhatsAppClient(token, phoneId);
        await wa.sendText(recipientPhone, response.text);
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI reply error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI request failed" },
      { status: 500 }
    );
  }
}
