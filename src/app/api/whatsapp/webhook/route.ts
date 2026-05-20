import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook, parseIncomingMessages } from "@/lib/whatsapp/webhook";
import { createWhatsAppClient } from "@/lib/whatsapp/client";
import { createAIService } from "@/lib/ai/service";
import { mockProducts } from "@/lib/data/mock";
import {
  getWorkspaceByPhoneNumberId,
  getFirstWorkspaceId,
  getWorkspaceSettings,
  findOrCreateCustomer,
  findOrCreateConversation,
  saveMessage,
  updateConversationLastMessage,
  saveAILog,
} from "@/lib/db/queries";
import type { WhatsAppWebhookPayload, AIConfig } from "@/types";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  const result = verifyWebhook(mode, token, challenge);
  if (result.valid && result.challenge) {
    return new NextResponse(result.challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const payload: WhatsAppWebhookPayload = await req.json();
    const messages = parseIncomingMessages(payload);

    if (!messages.length) {
      return NextResponse.json({ status: "ok" });
    }

    for (const msg of messages) {
      if (!msg.text || msg.type !== "text") continue;

      let workspaceId: string | null = await getWorkspaceByPhoneNumberId(msg.phoneNumberId);
      if (!workspaceId) {
        workspaceId = await getFirstWorkspaceId();
      }

      let conversationId: string | null = null;
      let customerId: string | null = null;

      if (workspaceId) {
        customerId = await findOrCreateCustomer(workspaceId, msg.from, msg.customerName);
        if (customerId) {
          conversationId = await findOrCreateConversation(workspaceId, customerId);
        }
        if (conversationId) {
          await saveMessage({
            conversationId,
            workspaceId,
            direction: "inbound",
            content: msg.text,
            senderType: "customer",
            whatsappMessageId: msg.whatsappMessageId,
          });
          await updateConversationLastMessage(conversationId, msg.text, true);
        }
      }

      const settings = workspaceId ? await getWorkspaceSettings(workspaceId) : null;
      const botEnabled = settings?.bot_enabled ?? true;
      const geminiKey = settings?.gemini_api_key ?? process.env.GEMINI_API_KEY;
      const waToken = settings?.whatsapp_access_token ?? process.env.WHATSAPP_ACCESS_TOKEN;
      const waPhoneId = settings?.whatsapp_phone_number_id ?? process.env.WHATSAPP_PHONE_NUMBER_ID;

      if (!botEnabled) continue;

      let replyText = "Thank you for your message! Our team will respond shortly.";

      if (geminiKey) {
        try {
          const aiConfig: AIConfig = {
            auto_reply_enabled: true,
            suggested_replies_enabled: true,
            sales_assistant_enabled: true,
            faq_enabled: true,
            sentiment_detection_enabled: true,
            voice_to_text_enabled: true,
            language: (settings?.ai_language as AIConfig["language"]) ?? "both",
            tone: (settings?.ai_tone as AIConfig["tone"]) ?? "friendly",
            business_name: settings?.business_name ?? "BOTFILTA Store",
            business_description: settings?.business_description ?? "Premium fashion and lifestyle products.",
          };

          const ai = createAIService({
            workspaceId: workspaceId ?? "ws-1",
            conversationId: conversationId ?? undefined,
            config: aiConfig,
          });

          const response = await ai.autoReply(msg.text, mockProducts, null, [], []);
          replyText = response.text;

          if (workspaceId && conversationId) {
            await saveAILog({
              workspaceId,
              conversationId,
              inputText: msg.text,
              outputText: replyText,
              intent: response.intent,
              language: response.language,
              tokensUsed: response.tokensUsed,
            });
          }
        } catch (aiError) {
          console.error("AI reply error in webhook:", aiError);
        }
      } else {
        const lower = msg.text.toLowerCase();
        if (lower.includes("hoodie") || lower.includes("blue")) {
          replyText = "Our Blue Hoodie is available for PKR 2,500. Sizes S–XL in stock. Delivery in 2–3 days.";
        } else if (lower.includes("price") || lower.includes("qeemat")) {
          replyText = "We have great prices! Blue Hoodie: PKR 2,500 | White Tee: PKR 1,200 | Slim Jeans: PKR 3,200.";
        } else if (lower.includes("delivery") || lower.includes("deliver")) {
          replyText = "We deliver across Pakistan in 2–3 business days. Free shipping on orders above PKR 3,000!";
        }
      }

      if (waToken && waPhoneId) {
        const whatsapp = createWhatsAppClient(waToken, waPhoneId);
        await whatsapp.sendText(msg.from, replyText);
        await whatsapp.markAsRead(msg.whatsappMessageId);
      }

      if (workspaceId && conversationId) {
        await saveMessage({
          conversationId,
          workspaceId,
          direction: "outbound",
          content: replyText,
          senderType: "ai",
        });
        await updateConversationLastMessage(conversationId, replyText);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
