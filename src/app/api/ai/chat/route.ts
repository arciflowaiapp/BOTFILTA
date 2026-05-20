import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAIService, defaultAIConfig } from "@/lib/ai/service";
import { mockProducts, mockCustomers, mockOrders, mockMessages } from "@/lib/data/mock";

const schema = z.object({
  message: z.string().min(1),
  conversationId: z.string().optional(),
  customerId: z.string().optional(),
  mode: z.enum(["auto", "sales", "faq", "suggest", "sentiment"]).default("auto"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { message, conversationId, customerId, mode } = parsed.data;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        text: "Blue Hoodie is available for PKR 2,500. Sizes S–XL in stock. Delivery in 2–3 days.",
        intent: "product_inquiry",
        language: "en",
        demo: true,
      });
    }

    const ai = createAIService({
      workspaceId: "ws-1",
      conversationId,
      config: defaultAIConfig,
    });

    const customer = mockCustomers.find((c) => c.id === customerId) || null;
    const orders = mockOrders.filter((o) => o.customer_id === customerId);
    const messages = conversationId ? mockMessages[conversationId] || [] : [];

    if (mode === "suggest") {
      const suggestions = await ai.getSuggestedReplies(message, mockProducts, customer, orders, messages);
      return NextResponse.json({ suggestions });
    }

    if (mode === "sentiment") {
      const sentiment = await ai.analyzeSentiment(message);
      return NextResponse.json({ sentiment });
    }

    let response;
    if (mode === "sales") {
      response = await ai.salesAssistant(message, mockProducts, customer, orders, messages);
    } else if (mode === "faq") {
      response = await ai.faqReply(message, mockProducts, customer, orders, messages);
    } else {
      response = await ai.autoReply(message, mockProducts, customer, orders, messages);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI request failed" },
      { status: 500 }
    );
  }
}
