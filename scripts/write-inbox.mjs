import fs from "fs";
const tag = "div";
const o = `<${tag}`;
const c = "</div>";

const page = `"use client";
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockConversations, mockMessages } from "@/lib/data/mock";
import { formatRelativeTime, cn } from "@/lib/utils";
import { Bot, Send, Sparkles, Paperclip, MoreVertical } from "lucide-react";

export default function InboxPage() {
  const [selected, setSelected] = useState(mockConversations[0]?.id || "");
  const [reply, setReply] = useState("");
  const messages = mockMessages[selected] || [];
  const conversation = mockConversations.find((c) => c.id === selected);

  return (
    <>
      <DashboardHeader title="Shared Inbox" subtitle="Team collaboration on WhatsApp" />
      ${o} className="flex h-[calc(100vh-4rem)]">
        <aside className="w-80 border-r border-[#e8eeeb] bg-white flex flex-col">
          ${o} className="p-4 border-b border-[#e8eeeb]"><Input placeholder="Search conversations..." />${c}
          ${o} className="flex-1 overflow-y-auto">
            {mockConversations.map((conv) => (
              <button key={conv.id} onClick={() => setSelected(conv.id)}
                className={cn("w-full text-left p-4 border-b hover:bg-[#f0faf4]", selected === conv.id && "bg-[#f0faf4]")}>
                ${o} className="flex justify-between mb-1">
                  <span className="font-medium text-sm">{conv.customer_name}</span>
                  <span className="text-xs text-[#5c6b63]">{formatRelativeTime(conv.last_message_at)}</span>
                ${c}
                <p className="text-sm text-[#5c6b63] truncate">{conv.last_message}</p>
              </button>
            ))}
          ${c}
        </aside>
        ${o} className="flex-1 flex flex-col bg-[#fafcfb]">
          {conversation && (
            <>
              ${o} className="flex items-center justify-between border-b bg-white px-6 py-4">
                ${o}><p className="font-semibold">{conversation.customer_name}</p><p className="text-xs text-[#5c6b63]">{conversation.customer_phone}</p>${c}
                <Badge variant="whatsapp"><Bot className="h-3 w-3 inline mr-1" />AI Active</Badge>
              ${c}
              ${o} className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((m) => (
                  ${o} key={m.id} className={cn("flex", m.direction === "outbound" ? "justify-end" : "justify-start")}>
                    ${o} className={cn("max-w-[70%] p-3 text-sm rounded-2xl", m.direction === "outbound" ? "chat-bubble-out" : "chat-bubble-in")}>
                      {m.sender_type === "ai" && "🤖 "}{m.content}
                    ${c}
                  ${c}
                ))}
              ${c}
              ${o} className="border-t bg-white p-4 flex gap-2">
                <Input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type a message..." className="flex-1" />
                <Button><Send className="h-4 w-4" /></Button>
              ${c}
            </>
          )}
        ${c}
      ${c}
    </>
  );
}
`;

fs.writeFileSync("d:/whatsapp saas ai/src/app/dashboard/inbox/page.tsx", page);
console.log("inbox ok");
