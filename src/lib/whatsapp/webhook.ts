import type { WhatsAppWebhookPayload, WhatsAppIncomingMessage } from "@/types";

export function verifyWebhook(
  mode: string | null,
  token: string | null,
  challenge: string | null
): { valid: boolean; challenge?: string } {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken && challenge) {
    return { valid: true, challenge };
  }

  return { valid: false };
}

export function parseIncomingMessages(
  payload: WhatsAppWebhookPayload
): ParsedWhatsAppMessage[] {
  const messages: ParsedWhatsAppMessage[] = [];

  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value;
      if (!value?.messages) continue;

      const phoneNumberId = value.metadata.phone_number_id;

      for (const msg of value.messages) {
        const contact = value.contacts?.find((c) => c.wa_id === msg.from);

        messages.push({
          whatsappMessageId: msg.id,
          from: msg.from,
          phoneNumberId,
          customerName: contact?.profile?.name || msg.from,
          timestamp: new Date(parseInt(msg.timestamp) * 1000).toISOString(),
          type: msg.type,
          text: extractMessageText(msg),
          raw: msg,
        });
      }
    }
  }

  return messages;
}

export interface ParsedWhatsAppMessage {
  whatsappMessageId: string;
  from: string;
  phoneNumberId: string;
  customerName: string;
  timestamp: string;
  type: string;
  text: string;
  raw: WhatsAppIncomingMessage;
}

function extractMessageText(msg: WhatsAppIncomingMessage): string {
  switch (msg.type) {
    case "text":
      return msg.text?.body || "";
    case "image":
      return msg.image?.caption || "[Image]";
    case "audio":
      return "[Voice message]";
    default:
      return `[${msg.type} message]`;
  }
}

export function isStatusUpdate(payload: WhatsAppWebhookPayload): boolean {
  return payload.entry?.some((e) =>
    e.changes?.some((c) => c.value?.statuses?.length)
  ) ?? false;
}
