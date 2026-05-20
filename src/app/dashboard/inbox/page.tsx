"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockConversations, mockMessages } from "@/lib/data/mock";
import { formatRelativeTime, cn } from "@/lib/utils";
import { Bot, Send, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Conversation {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_id?: string;
  workspace_id?: string;
  status: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  tags?: string[];
}

interface Message {
  id: string;
  conversation_id: string;
  direction: "inbound" | "outbound";
  content: string;
  sender_type: "customer" | "agent" | "ai" | "system";
  created_at: string;
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const selectedConv = conversations.find((c) => c.id === selected);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      if (data.demo || !data.conversations?.length) {
        setIsDemo(true);
        const fallback = mockConversations.map((c) => ({
          ...c,
          workspace_id: "ws-1",
        }));
        setConversations(fallback);
        if (!selected && fallback.length > 0) setSelected(fallback[0].id);
      } else {
        setConversations(data.conversations);
        if (!selected && data.conversations.length > 0) {
          setSelected(data.conversations[0].id);
        }
      }
    } catch {
      setIsDemo(true);
      const fallback = mockConversations.map((c) => ({ ...c, workspace_id: "ws-1" }));
      setConversations(fallback);
      if (!selected && fallback.length > 0) setSelected(fallback[0].id);
    } finally {
      setLoading(false);
    }
  }, [selected]);

  const fetchMessages = useCallback(async (convId: string) => {
    if (!convId) return;
    setLoadingMsgs(true);
    try {
      if (isDemo) {
        const mock = mockMessages[convId] ?? [];
        setMessages(mock as Message[]);
        return;
      }
      const res = await fetch(`/api/conversations/${convId}/messages`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      } else {
        setMessages(mockMessages[convId] as Message[] ?? []);
      }
    } catch {
      setMessages(mockMessages[convId] as Message[] ?? []);
    } finally {
      setLoadingMsgs(false);
    }
  }, [isDemo]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selected) fetchMessages(selected);
  }, [selected, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isDemo || !selected) return;

    const channel = supabase
      .channel(`messages:${selected}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selected}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          setConversations((prev) =>
            prev.map((c) =>
              c.id === selected
                ? { ...c, last_message: (payload.new as Message).content, last_message_at: (payload.new as Message).created_at }
                : c
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selected, isDemo]);

  async function handleSend() {
    if (!reply.trim() || !selectedConv) return;
    const text = reply.trim();
    setReply("");
    setSending(true);

    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: selected,
      direction: "outbound",
      content: text,
      sender_type: "agent",
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedConv.customer_phone,
          message: text,
          conversationId: selected,
          workspaceId: selectedConv.workspace_id,
          senderType: "agent",
        }),
      });
      if (!isDemo) await fetchMessages(selected);
    } catch {
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  async function handleAiReply() {
    if (!selectedConv) return;
    const lastCustomerMsg = [...messages].reverse().find((m) => m.direction === "inbound");
    if (!lastCustomerMsg) return;

    setAiLoading(true);
    try {
      const res = await fetch("/api/ai-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: lastCustomerMsg.content,
          conversationId: selected,
          customerId: selectedConv.customer_id,
          workspaceId: selectedConv.workspace_id,
          mode: "auto",
          sendToWhatsApp: !isDemo,
          recipientPhone: selectedConv.customer_phone,
        }),
      });
      const data = await res.json();
      if (data.text) {
        setReply(data.text);
      }
    } catch {
      alert("AI reply generation failed.");
    } finally {
      setAiLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      <DashboardHeader
        title="WhatsApp Inbox"
        subtitle={`${conversations.length} conversation${conversations.length !== 1 ? "s" : ""}${isDemo ? " (Demo Mode)" : " — Real-time"}`}
      />
      <div className="flex h-[calc(100vh-8rem)] border-t border-gray-100">
        <aside className="w-80 border-r border-gray-100 bg-white flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-100 flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 flex-1">
              {conversations.length} conversations
            </span>
            <button onClick={fetchConversations} className="text-gray-400 hover:text-gray-600">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-gray-400">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400 text-sm">
                No conversations yet
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelected(conv.id)}
                  className={cn(
                    "w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50/70 transition-colors",
                    selected === conv.id && "bg-green-50 border-l-2 border-l-green-500"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm text-gray-900 truncate max-w-[140px]">
                      {conv.customer_name}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0 ml-1">
                      {formatRelativeTime(conv.last_message_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conv.last_message}</p>
                  {conv.unread_count > 0 && (
                    <span className="mt-1 inline-block rounded-full bg-green-500 px-2 py-0.5 text-xs font-semibold text-white">
                      {conv.unread_count}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </aside>

        <div className="flex-1 flex flex-col bg-[#fafcfb] min-w-0">
          {selectedConv ? (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3 shrink-0">
                <div>
                  <p className="font-semibold text-gray-900">{selectedConv.customer_name}</p>
                  <p className="text-xs text-gray-400 font-mono">{selectedConv.customer_phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isDemo && <Badge variant="outline" className="text-xs">Demo</Badge>}
                  <Badge variant="outline" className="text-xs gap-1">
                    <Bot className="h-3 w-3 text-green-500" />
                    AI Active
                  </Badge>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {loadingMsgs ? (
                  <div className="flex items-center justify-center py-10 text-gray-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400 text-sm">
                    <Bot className="h-10 w-10 mb-2 opacity-30" />
                    No messages yet
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn("flex", m.direction === "outbound" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[72%] px-4 py-2.5 text-sm rounded-2xl shadow-sm",
                          m.direction === "outbound"
                            ? "bg-green-500 text-white rounded-br-sm"
                            : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                        )}
                      >
                        {m.sender_type === "ai" && (
                          <span className="text-xs opacity-70 block mb-1 flex items-center gap-1">
                            <Bot className="h-3 w-3 inline" /> AI Reply
                          </span>
                        )}
                        <p className="whitespace-pre-wrap">{m.content}</p>
                        <p className={cn("text-xs mt-1 opacity-60", m.direction === "outbound" ? "text-right" : "text-left")}>
                          {new Date(m.created_at).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-100 bg-white p-4 shrink-0">
                <div className="flex gap-2">
                  <button
                    onClick={handleAiReply}
                    disabled={aiLoading}
                    title="Generate AI reply"
                    className="flex items-center gap-1.5 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-100 transition disabled:opacity-50 shrink-0"
                  >
                    {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                    AI Reply
                  </button>
                  <Input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message… (Enter to send)"
                    className="flex-1"
                    disabled={sending}
                  />
                  <Button onClick={handleSend} disabled={sending || !reply.trim()} className="shrink-0">
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Click <strong>AI Reply</strong> to auto-generate a response, or type manually and press Enter.
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
              <Bot className="h-16 w-16 mb-4 opacity-20" />
              <p className="font-medium">Select a conversation to start</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
