import type { AIConfig, Customer, Message, Order, Product } from "@/types";
import {
  generateAIReply,
  detectIntent,
  generateSuggestedReplies,
  detectSentiment,
  transcribeVoiceNote,
  generateProductRecommendation,
  type AIResponse,
} from "./gemini";
import type { BusinessContext } from "./prompts";

export interface AIServiceOptions {
  workspaceId: string;
  conversationId?: string;
  config: AIConfig;
}

export class AIService {
  private config: AIConfig;
  private workspaceId: string;
  private conversationId?: string;

  constructor(options: AIServiceOptions) {
    this.config = options.config;
    this.workspaceId = options.workspaceId;
    this.conversationId = options.conversationId;
  }

  private buildContext(
    products: Product[],
    customer: Customer | null,
    orders: Order[],
    messages: Message[]
  ): BusinessContext {
    return {
      products,
      customer,
      orders,
      conversationHistory: messages,
    };
  }

  async autoReply(
    userMessage: string,
    products: Product[],
    customer: Customer | null,
    orders: Order[],
    messages: Message[]
  ): Promise<AIResponse> {
    if (!this.config.auto_reply_enabled) {
      throw new Error("Auto reply is disabled");
    }

    const context = this.buildContext(products, customer, orders, messages);
    const intent = await detectIntent(userMessage);
    const response = await generateAIReply(userMessage, this.config, context);

    return { ...response, intent };
  }

  async getSuggestedReplies(
    lastMessage: string,
    products: Product[],
    customer: Customer | null,
    orders: Order[],
    messages: Message[]
  ): Promise<string[]> {
    if (!this.config.suggested_replies_enabled) return [];

    const context = this.buildContext(products, customer, orders, messages);
    return generateSuggestedReplies(lastMessage, context);
  }

  async analyzeSentiment(message: string) {
    if (!this.config.sentiment_detection_enabled) return "neutral" as const;
    return detectSentiment(message);
  }

  async processVoiceNote(audioBase64: string, mimeType: string): Promise<string> {
    if (!this.config.voice_to_text_enabled) {
      throw new Error("Voice to text is disabled");
    }
    return transcribeVoiceNote(audioBase64, mimeType);
  }

  async getProductRecommendation(
    message: string,
    products: Product[]
  ): Promise<string> {
    return generateProductRecommendation(message, products);
  }

  async salesAssistant(
    userMessage: string,
    products: Product[],
    customer: Customer | null,
    orders: Order[],
    messages: Message[]
  ): Promise<AIResponse> {
    const salesConfig: AIConfig = {
      ...this.config,
      tone: "friendly",
      business_description:
        (this.config.business_description || "") +
        " Focus on helping customers discover products and complete purchases.",
    };

    const context = this.buildContext(products, customer, orders, messages);
    return generateAIReply(userMessage, salesConfig, context);
  }

  async faqReply(
    userMessage: string,
    products: Product[],
    customer: Customer | null,
    orders: Order[],
    messages: Message[]
  ): Promise<AIResponse> {
    const faqConfig: AIConfig = {
      ...this.config,
      tone: "professional",
    };

    const context = this.buildContext(products, customer, orders, messages);
    return generateAIReply(userMessage, faqConfig, context);
  }

  async detectLead(message: string): Promise<boolean> {
    const intent = await detectIntent(message);
    return intent === "sales" || intent === "product_inquiry";
  }
}

export function createAIService(options: AIServiceOptions): AIService {
  return new AIService(options);
}

export const defaultAIConfig: AIConfig = {
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
