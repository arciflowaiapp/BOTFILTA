import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import type { AIConfig, Message } from "@/types";
import {
  buildSystemPrompt,
  buildConversationHistory,
  buildIntentDetectionPrompt,
  buildSuggestedRepliesPrompt,
  buildSentimentPrompt,
  type BusinessContext,
  type AIIntent,
} from "./prompts";

const MODEL = "gemini-2.5-flash";

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

function getModel(systemInstruction?: string): GenerativeModel {
  const client = getClient();
  return client.getGenerativeModel({
    model: MODEL,
    systemInstruction,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 512,
    },
  });
}

export interface AIResponse {
  text: string;
  intent?: AIIntent;
  language?: "en" | "ur" | "mixed";
  tokensUsed?: number;
}

export async function generateAIReply(
  userMessage: string,
  config: AIConfig,
  context: BusinessContext
): Promise<AIResponse> {
  const systemPrompt = buildSystemPrompt(config, context);
  const history = buildConversationHistory(context.conversationHistory);

  const model = getModel(systemPrompt);
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: `Conversation history:\n${history}\n\nCustomer's new message: ${userMessage}` }],
      },
    ],
  });

  const result = await chat.sendMessage(userMessage);
  const text = result.response.text();

  const language = detectLanguage(userMessage, text);

  return {
    text: text.trim(),
    language,
    tokensUsed: estimateTokens(userMessage + text),
  };
}

export async function detectIntent(message: string): Promise<AIIntent> {
  try {
    const model = getModel();
    const result = await model.generateContent(buildIntentDetectionPrompt(message));
    const intent = result.response.text().trim().toLowerCase() as AIIntent;
    const valid: AIIntent[] = [
      "product_inquiry",
      "order_tracking",
      "general_faq",
      "sales",
      "complaint",
      "greeting",
    ];
    return valid.includes(intent) ? intent : "general_faq";
  } catch {
    return "general_faq";
  }
}

export async function generateSuggestedReplies(
  lastMessage: string,
  context: BusinessContext
): Promise<string[]> {
  try {
    const model = getModel();
    const result = await model.generateContent(
      buildSuggestedRepliesPrompt(lastMessage, context)
    );
    const text = result.response.text().trim();
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
  } catch {
    return [
      "Thank you for reaching out! How can I help you today?",
      "Let me check that for you right away.",
      "Would you like me to share our latest products?",
    ];
  }
}

export async function detectSentiment(
  message: string
): Promise<"positive" | "neutral" | "negative"> {
  try {
    const model = getModel();
    const result = await model.generateContent(buildSentimentPrompt(message));
    const sentiment = result.response.text().trim().toLowerCase();
    if (["positive", "neutral", "negative"].includes(sentiment)) {
      return sentiment as "positive" | "neutral" | "negative";
    }
    return "neutral";
  } catch {
    return "neutral";
  }
}

export async function transcribeVoiceNote(
  audioBase64: string,
  mimeType: string
): Promise<string> {
  const client = getClient();
  const model = client.getGenerativeModel({ model: MODEL });

  const result = await model.generateContent([
    {
      inlineData: {
        data: audioBase64,
        mimeType,
      },
    },
    {
      text: "Transcribe this voice message. Support Urdu and English. Return only the transcription text.",
    },
  ]);

  return result.response.text().trim();
}

export async function generateProductRecommendation(
  customerMessage: string,
  products: BusinessContext["products"]
): Promise<string> {
  const productList = products
    .filter((p) => p.is_active && p.stock > 0)
    .map((p) => `${p.name} - ${p.price} PKR`)
    .join("\n");

  const model = getModel(
    `Recommend products from this list based on customer interest. Be concise.\n\nProducts:\n${productList}`
  );

  const result = await model.generateContent(customerMessage);
  return result.response.text().trim();
}

function detectLanguage(
  input: string,
  output: string
): "en" | "ur" | "mixed" {
  const urduRegex = /[\u0600-\u06FF]/;
  const inputUrdu = urduRegex.test(input);
  const outputUrdu = urduRegex.test(output);
  if (inputUrdu && outputUrdu) return "ur";
  if (!inputUrdu && !outputUrdu) return "en";
  return "mixed";
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export { MODEL };
