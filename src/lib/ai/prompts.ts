import type { AIConfig, Customer, Message, Order, Product } from "@/types";

export function buildSystemPrompt(config: AIConfig, context: BusinessContext): string {
  return `You are BOTFILTA AI — a premium WhatsApp business assistant for "${config.business_name}".

ROLE: Professional sales & support assistant. Help customers with products, orders, FAQs, and general inquiries.

LANGUAGE: Respond in the same language the customer uses. Support both English and Urdu (اردو). If mixed, respond bilingually when helpful.

TONE: ${config.tone} — warm, helpful, concise. Never robotic.

BUSINESS:
${config.business_description || "A premium retail business."}

PRODUCTS DATABASE:
${formatProducts(context.products)}

CUSTOMER CONTEXT:
- Name: ${context.customer?.name || "Customer"}
- Tags: ${context.customer?.tags?.join(", ") || "none"}
- Total orders: ${context.customer?.total_orders || 0}
- Total spent: ${context.customer?.total_spent || 0} PKR
${context.customer?.notes ? `- Notes: ${context.customer.notes}` : ""}

RECENT ORDERS:
${formatOrders(context.orders)}

RULES:
1. Answer product questions using exact prices from the database
2. For order tracking, use order data provided
3. Keep responses under 3 sentences unless detail is needed
4. Use PKR for prices unless specified otherwise
5. Suggest relevant products when appropriate
6. Detect purchase intent and offer to help place orders
7. Never invent products or prices not in the database
8. If unsure, offer to connect with a human agent
9. For voice messages (transcribed), respond naturally to the content

EXAMPLE (English):
Customer: "Blue hoodie price?"
You: "Our Blue Hoodie is available for PKR 2,500. We have sizes S–XL in stock. Delivery in 2–3 days. Would you like to order?"

EXAMPLE (Urdu):
Customer: "نیلے ہڈی کی قیمت کیا ہے؟"
You: "نیلی Hoodie PKR 2,500 میں دستیاب ہے۔ S سے XL سائز موجود ہیں۔ ڈیلیوری 2-3 دن میں۔ آرڈر کریں؟"`;
}

export interface BusinessContext {
  products: Product[];
  customer?: Customer | null;
  orders: Order[];
  conversationHistory: Message[];
}

function formatProducts(products: Product[]): string {
  if (!products.length) return "No products loaded.";
  return products
    .filter((p) => p.is_active)
    .map(
      (p) =>
        `- ${p.name}: ${p.price} ${p.currency} | Stock: ${p.stock} | Category: ${p.category}${
          p.colors?.length ? ` | Colors: ${p.colors.join(", ")}` : ""
        }${p.sizes?.length ? ` | Sizes: ${p.sizes.join(", ")}` : ""}${
          p.description ? ` | ${p.description}` : ""
        }`
    )
    .join("\n");
}

function formatOrders(orders: Order[]): string {
  if (!orders.length) return "No recent orders.";
  return orders
    .slice(0, 5)
    .map(
      (o) =>
        `- Order #${o.id.slice(0, 8)}: ${o.status} | ${o.total} ${o.currency} | ${new Date(o.created_at).toLocaleDateString()}`
    )
    .join("\n");
}

export function buildConversationHistory(messages: Message[]): string {
  return messages
    .slice(-20)
    .map((m) => {
      const role = m.sender_type === "customer" ? "Customer" : "Assistant";
      return `${role}: ${m.content}`;
    })
    .join("\n");
}

export const INTENT_PROMPTS = {
  product_inquiry: "Customer is asking about a product. Use exact database prices.",
  order_tracking: "Customer wants order status. Use order data from context.",
  general_faq: "Answer from business knowledge. Be helpful and concise.",
  sales: "Customer shows purchase intent. Guide toward ordering.",
  complaint: "Customer has a complaint. Be empathetic, offer resolution.",
  greeting: "Warm greeting. Introduce how you can help briefly.",
} as const;

export type AIIntent = keyof typeof INTENT_PROMPTS;

export function buildIntentDetectionPrompt(message: string): string {
  return `Classify this WhatsApp customer message into ONE intent. Reply with only the intent key.

Intents: product_inquiry, order_tracking, general_faq, sales, complaint, greeting

Message: "${message}"

Intent:`;
}

export function buildSuggestedRepliesPrompt(
  lastMessage: string,
  context: BusinessContext
): string {
  return `Generate 3 short suggested reply options for a business agent responding to this customer message.
Return as JSON array of strings only. Keep each under 100 characters. Match customer language (English/Urdu).

Customer message: "${lastMessage}"
Products available: ${context.products.slice(0, 5).map((p) => p.name).join(", ")}

JSON array:`;
}

export function buildSentimentPrompt(message: string): string {
  return `Analyze sentiment of this customer message. Reply with exactly one word: positive, neutral, or negative.

Message: "${message}"`;
}
