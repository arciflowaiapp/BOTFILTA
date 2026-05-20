"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles, Loader2, CheckCircle, Zap, MessageCircle, Globe } from "lucide-react";

interface ChatMsg {
  role: "user" | "ai";
  text: string;
}

export default function AIPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "ai", text: "Assalam o Alaikum! I'm BOTFILTA AI. Ask me anything about products, orders, or how I can help your customers!" },
  ]);
  const [loading, setLoading] = useState(false);
  const [botEnabled, setBotEnabled] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [savingToggle, setSavingToggle] = useState(false);
  const [toggleSaved, setToggleSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.settings) {
          setBotEnabled(data.settings.bot_enabled ?? true);
        }
      } catch {
      } finally {
        setSettingsLoading(false);
      }
    }
    loadSettings();
  }, []);

  async function handleToggleBot(enabled: boolean) {
    setBotEnabled(enabled);
    setSavingToggle(true);
    setToggleSaved(false);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bot_enabled: enabled }),
      });
      setToggleSaved(true);
      setTimeout(() => setToggleSaved(false), 2000);
    } catch {
    } finally {
      setSavingToggle(false);
    }
  }

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, mode: "auto" }),
      });
      const data = await res.json();
      const reply = data.text || data.error || "Sorry, something went wrong.";
      setMessages((m) => [...m, { role: "ai", text: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      <DashboardHeader
        title="AI Automation"
        subtitle="Powered by Google Gemini 2.5 Flash"
      />

      <div className="p-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Auto-Reply Bot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-900">
                    {botEnabled ? "Bot is Active" : "Bot is Paused"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {botEnabled
                      ? "Automatically replies to WhatsApp messages"
                      : "Messages will not be auto-replied"}
                  </p>
                </div>
                {settingsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                ) : (
                  <Switch
                    checked={botEnabled}
                    onCheckedChange={handleToggleBot}
                    disabled={savingToggle}
                  />
                )}
              </div>

              {toggleSaved && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Saved
                </div>
              )}

              <div className={`rounded-xl p-3 text-sm ${botEnabled ? "bg-green-50 border border-green-100" : "bg-gray-50 border border-gray-100"}`}>
                <div className={`flex items-center gap-2 font-medium ${botEnabled ? "text-green-700" : "text-gray-500"}`}>
                  <div className={`h-2 w-2 rounded-full ${botEnabled ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
                  {botEnabled ? "AI is listening for messages" : "AI auto-reply disabled"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                AI Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: MessageCircle, label: "Product Q&A", desc: "Auto answers product questions" },
                { icon: Bot, label: "Order Tracking", desc: "Responds to order inquiries" },
                { icon: Globe, label: "Urdu + English", desc: "Bilingual support included" },
                { icon: Zap, label: "Instant Replies", desc: "Under 3 second response time" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="rounded-lg bg-purple-50 p-1.5 shrink-0">
                    <Icon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-green-500" />
                AI Playground
                <Badge variant="outline" className="ml-auto text-xs">Gemini 2.5 Flash</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 gap-4">
              <div className="flex-1 min-h-[360px] max-h-[400px] overflow-y-auto space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    {m.role === "ai" && (
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center mr-2 shrink-0 mt-1">
                        <Bot className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-2.5 text-sm rounded-2xl ${
                        m.role === "user"
                          ? "bg-green-500 text-white rounded-br-sm"
                          : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm shadow-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center mr-2 shrink-0">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about products, delivery, orders... (Press Enter)"
                  disabled={loading}
                  className="flex-1"
                />
                <Button onClick={send} disabled={loading || !input.trim()}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Blue hoodie price?", "Delivery time?", "Do you have jeans?", "Payment methods?"].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                    className="text-xs rounded-full border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-green-300 hover:text-green-700 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
