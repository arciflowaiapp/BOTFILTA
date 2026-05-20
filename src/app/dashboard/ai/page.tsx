"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles } from "lucide-react";

export default function AIPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "ai", text: "Assalam o Alaikum! I'm BOTFILTA AI. Ask me about products, orders, or anything!" },
  ]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg = input;
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
      setMessages((m) => [...m, { role: "ai", text: data.text || data.error }]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Sorry, something went wrong." }]);
    }
    setLoading(false);
  }

  return (
    <>
      <DashboardHeader title="AI Assistant" subtitle="Powered by Gemini 2.5 Flash" />
      <motion.div className="p-6 max-w-3xl mx-auto">
        <Card className="shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#25d366]" /> AI Playground
              <Badge variant="whatsapp">Urdu + English</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div className="h-96 overflow-y-auto space-y-3 mb-4">
              {messages.map((m, i) => (
                <motion.div key={i} className={m.role === "user" ? "chat-bubble-in max-w-[80%] p-3 text-sm" : "chat-bubble-out max-w-[85%] ml-auto p-3 text-sm"}>
                  {m.text}
                </motion.div>
              ))}
            </motion.div>
            <motion.div className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about products, orders..." onKeyDown={(e) => e.key === "Enter" && send()} />
              <Button onClick={send} disabled={loading}><Send className="h-4 w-4" /></Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
