const WHATSAPP_API = "https://graph.facebook.com/v21.0";

export interface SendMessageParams {
  to: string;
  type: "text" | "template" | "image";
  text?: { body: string };
  template?: {
    name: string;
    language: { code: string };
    components?: unknown[];
  };
  image?: { link: string; caption?: string };
}

export class WhatsAppClient {
  private accessToken: string;
  private phoneNumberId: string;

  constructor(accessToken?: string, phoneNumberId?: string) {
    this.accessToken = accessToken || process.env.WHATSAPP_ACCESS_TOKEN || "";
    this.phoneNumberId =
      phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID || "";
  }

  private get baseUrl() {
    return `${WHATSAPP_API}/${this.phoneNumberId}`;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
    };
  }

  async sendMessage(params: SendMessageParams) {
    const body: Record<string, unknown> = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: params.to.replace(/\D/g, ""),
      type: params.type,
    };

    if (params.type === "text" && params.text) {
      body.text = { preview_url: true, ...params.text };
    } else if (params.type === "template" && params.template) {
      body.template = params.template;
    } else if (params.type === "image" && params.image) {
      body.image = params.image;
    }

    const res = await fetch(`${this.baseUrl}/messages`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`);
    }

    return res.json();
  }

  async sendText(to: string, message: string) {
    return this.sendMessage({
      to,
      type: "text",
      text: { body: message },
    });
  }

  async markAsRead(messageId: string) {
    const res = await fetch(`${this.baseUrl}/messages`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId,
      }),
    });
    return res.json();
  }

  async getMediaUrl(mediaId: string): Promise<string> {
    const res = await fetch(`${WHATSAPP_API}/${mediaId}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    const data = await res.json();
    return data.url;
  }

  async downloadMedia(mediaId: string): Promise<ArrayBuffer> {
    const url = await this.getMediaUrl(mediaId);
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    return res.arrayBuffer();
  }
}

export function createWhatsAppClient(
  accessToken?: string,
  phoneNumberId?: string
) {
  return new WhatsAppClient(accessToken, phoneNumberId);
}
