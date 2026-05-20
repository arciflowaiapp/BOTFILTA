import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createWhatsAppClient } from "@/lib/whatsapp/client";
import { saveMessage, updateConversationLastMessage } from "@/lib/db/queries";

const schema = z.object({
  to: z.string().min(7),
  message: z.string().min(1),
  conversationId: z.string().optional(),
  workspaceId: z.string().optional(),
  senderType: z.enum(["agent", "ai"]).optional().default("agent"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { to, message, conversationId, workspaceId, senderType } = parsed.data;

    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneId) {
      if (conversationId && workspaceId) {
        await saveMessage({
          conversationId,
          workspaceId,
          direction: "outbound",
          content: message,
          senderType,
        });
        await updateConversationLastMessage(conversationId, message);
      }
      return NextResponse.json({
        success: true,
        demo: true,
        message: "Message saved (configure WHATSAPP_ACCESS_TOKEN to send via WhatsApp)",
      });
    }

    const client = createWhatsAppClient(token, phoneId);
    const result = await client.sendText(to, message);

    if (conversationId && workspaceId) {
      await saveMessage({
        conversationId,
        workspaceId,
        direction: "outbound",
        content: message,
        senderType,
      });
      await updateConversationLastMessage(conversationId, message);
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send" },
      { status: 500 }
    );
  }
}
