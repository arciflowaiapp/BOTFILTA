import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createWhatsAppClient } from "@/lib/whatsapp/client";

const schema = z.object({
  to: z.string().min(10),
  message: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    if (!process.env.WHATSAPP_ACCESS_TOKEN) {
      return NextResponse.json({
        success: true,
        demo: true,
        message: "Message queued (configure WHATSAPP_ACCESS_TOKEN to send)",
      });
    }

    const client = createWhatsAppClient();
    const result = await client.sendText(parsed.data.to, parsed.data.message);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send" },
      { status: 500 }
    );
  }
}
