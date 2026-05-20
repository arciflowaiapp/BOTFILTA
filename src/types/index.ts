export type UserRole = "owner" | "admin" | "agent" | "viewer";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  workspace_id: string;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  whatsapp_phone_number_id?: string;
  whatsapp_business_account_id?: string;
  plan: "starter" | "growth" | "enterprise";
  created_at: string;
}

export interface Customer {
  id: string;
  workspace_id: string;
  phone: string;
  name: string;
  email?: string;
  tags: string[];
  notes?: string;
  sentiment?: "positive" | "neutral" | "negative";
  total_orders: number;
  total_spent: number;
  last_message_at?: string;
  created_at: string;
}

export interface Product {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  stock: number;
  category: string;
  image_url?: string;
  sizes?: string[];
  colors?: string[];
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  workspace_id: string;
  customer_id: string;
  customer_name: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  total: number;
  currency: string;
  shipping_address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface Conversation {
  id: string;
  workspace_id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  status: "open" | "pending" | "resolved";
  assigned_to?: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  tags: string[];
  sentiment?: "positive" | "neutral" | "negative";
}

export interface Message {
  id: string;
  conversation_id: string;
  workspace_id: string;
  direction: "inbound" | "outbound";
  content: string;
  type: "text" | "image" | "audio" | "document" | "template";
  sender_type: "customer" | "agent" | "ai" | "system";
  sender_id?: string;
  whatsapp_message_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface QuickReply {
  id: string;
  workspace_id: string;
  title: string;
  content: string;
  shortcut?: string;
}

export interface AIConversationLog {
  id: string;
  workspace_id: string;
  conversation_id: string;
  prompt_tokens: number;
  completion_tokens: number;
  model: string;
  intent?: string;
  language?: "en" | "ur" | "mixed";
  created_at: string;
}

export interface TeamMember {
  id: string;
  workspace_id: string;
  profile_id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  messages_handled: number;
  avg_response_time: number;
  is_online: boolean;
}

export interface AnalyticsSummary {
  totalMessages: number;
  messagesChange: number;
  activeConversations: number;
  conversationsChange: number;
  newCustomers: number;
  customersChange: number;
  revenue: number;
  revenueChange: number;
  aiResolutionRate: number;
  avgResponseTime: number;
  teamPerformance: number;
}

export interface AIConfig {
  auto_reply_enabled: boolean;
  suggested_replies_enabled: boolean;
  sales_assistant_enabled: boolean;
  faq_enabled: boolean;
  sentiment_detection_enabled: boolean;
  voice_to_text_enabled: boolean;
  language: "en" | "ur" | "both";
  tone: "professional" | "friendly" | "casual";
  business_name: string;
  business_description?: string;
}

export interface WhatsAppWebhookPayload {
  object: string;
  entry: WhatsAppEntry[];
}

export interface WhatsAppEntry {
  id: string;
  changes: WhatsAppChange[];
}

export interface WhatsAppChange {
  value: {
    messaging_product: string;
    metadata: { display_phone_number: string; phone_number_id: string };
    contacts?: { profile: { name: string }; wa_id: string }[];
    messages?: WhatsAppIncomingMessage[];
    statuses?: WhatsAppStatus[];
  };
  field: string;
}

export interface WhatsAppIncomingMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  audio?: { id: string; mime_type: string };
  image?: { id: string; caption?: string };
}

export interface WhatsAppStatus {
  id: string;
  status: string;
  timestamp: string;
  recipient_id: string;
}
