import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook, parseIncomingMessages } from "@/lib/whatsapp/webhook";
import { createWhatsAppClient } from "@/lib/whatsapp/client";
import { createAIService, defaultAIConfig } from "@/lib/ai/service";
import { mockProducts } from "@/lib/data/mock";
import type { WhatsAppWebhookPayload } from "@/types";

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

    const whatsapp = createWhatsAppClient();

    for (const msg of messages) {
      if (!msg.text || msg.type !== "text") continue;

      let replyText =
        "Thank you for your message! Our team will respond shortly.";

      if (process.env.GEMINI_API_KEY) {
        const ai = createAIService({
          workspaceId: "ws-1",
          config: defaultAIConfig,
        });
        const response = await ai.autoReply(msg.text, mockProducts, null, [], []);
        replyText = response.text;
      } else {
        const lower = msg.text.toLowerCase();
        if (lower.includes("hoodie") || lower.includes("blue")) {
          replyText =
            "Our Blue Hoodie is available for PKR 2,500. Sizes S–XL in stock. Delivery in 2–3 days.";
        }
      }

      if (process.env.WHATSAPP_ACCESS_TOKEN) {
        await whatsapp.sendText(msg.from, replyText);
        await whatsapp.markAsRead(msg.whatsappMessageId);
      }

      // TODO: Persist to Supabase — customer, conversation, message, AI log
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
