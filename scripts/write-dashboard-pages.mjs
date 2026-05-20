import fs from "fs";
import path from "path";

const d = (cls, inner) => `<div className="${cls}">${inner}</div>`;

const pages = {
  customers: {
    title: "Customers",
    subtitle: "Manage your customer relationships",
    headers: ["Name", "Phone", "Tags", "Orders", "Spent", "Sentiment"],
    rows: `mockCustomers.map((c) => [c.name, c.phone, c.tags.join(", "), c.total_orders, formatCurrency(c.total_spent), c.sentiment || "neutral"])`,
    importMock: "mockCustomers",
  },
  products: {
    title: "Products",
    subtitle: "Product catalog for AI-powered replies",
    headers: ["Product", "Category", "Price", "Stock", "Status"],
    rows: `mockProducts.map((p) => [p.name, p.category, formatCurrency(p.price), p.stock, p.is_active ? "Active" : "Inactive"])`,
    importMock: "mockProducts",
  },
  orders: {
    title: "Orders",
    subtitle: "Track and manage customer orders",
    headers: ["Order", "Customer", "Status", "Total", "Date"],
    rows: `mockOrders.map((o) => [o.id.slice(0,8), o.customer_name, o.status, formatCurrency(o.total), new Date(o.created_at).toLocaleDateString()])`,
    importMock: "mockOrders",
  },
  team: {
    title: "Team Management",
    subtitle: "Manage team members and performance",
    headers: ["Name", "Email", "Role", "Messages", "Avg Response", "Status"],
    rows: `mockTeam.map((t) => [t.name, t.email, t.role, t.messages_handled, t.avg_response_time + " min", t.is_online ? "Online" : "Offline"])`,
    importMock: "mockTeam",
  },
};

function tablePage(name, cfg) {
  return `"use client";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ${cfg.importMock} } from "@/lib/data/mock";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function Page() {
  const rows = ${cfg.rows};
  return (
    <>
      <DashboardHeader title="${cfg.title}" subtitle="${cfg.subtitle}" />
      <motion.div className="p-6">
        <motion.div className="flex justify-end mb-4">
          <Button><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </motion.div>
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8eeeb] bg-[#f0faf4]/50">
                  ${cfg.headers.map((h) => `<th className="text-left p-4 font-medium text-[#5c6b63]">${h}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-[#e8eeeb]/50 hover:bg-[#f0faf4]/30">
                    {row.map((cell, j) => (
                      <td key={j} className="p-4">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
`.replace(/<motion\.div/g, "<div").replace(/<\/motion\.motion.div>/g, "</div>");
}

for (const [name, cfg] of Object.entries(pages)) {
  const dir = `d:/whatsapp saas ai/src/app/dashboard/${name}`;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "page.tsx"), tablePage(name, cfg));
}

// AI page
fs.mkdirSync("d:/whatsapp saas ai/src/app/dashboard/ai", { recursive: true });
fs.writeFileSync(
  "d:/whatsapp saas ai/src/app/dashboard/ai/page.tsx",
  `"use client";
import { useState } from "react";
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
`.replace(/<motion\.motion.div/g, "<div").replace(/<\/motion\.motion.div>/g, "</div>")
);

// Analytics
fs.mkdirSync("d:/whatsapp saas ai/src/app/dashboard/analytics", { recursive: true });
fs.mkdirSync("d:/whatsapp saas ai/src/app/dashboard/settings", { recursive: true });
fs.writeFileSync(
  "d:/whatsapp saas ai/src/app/dashboard/analytics/page.tsx",
  `"use client";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { chartData, mockAnalytics } from "@/lib/data/mock";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#25d366", "#128c41", "#5c6b63"];

export default function AnalyticsPage() {
  return (
    <>
      <DashboardHeader title="Analytics" subtitle="Business insights and performance" />
      <motion.div className="p-6 grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Revenue</CardTitle></CardHeader><CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.revenue}><CartesianGrid strokeDasharray="3 3" stroke="#e8eeeb" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="revenue" fill="#25d366" radius={[8,8,0,0]} /></BarChart>
          </ResponsiveContainer>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>AI vs Human</CardTitle></CardHeader><CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart><Pie data={chartData.aiPerformance} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{chartData.aiPerformance.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </CardContent></Card>
        <Card className="lg:col-span-2"><CardContent className="p-6 grid grid-cols-3 gap-4 text-center">
          <motion.div><p className="text-2xl font-bold">{mockAnalytics.aiResolutionRate}%</p><p className="text-sm text-[#5c6b63]">AI Resolution</p></motion.div>
          <motion.div><p className="text-2xl font-bold">{formatCurrency(mockAnalytics.revenue)}</p><p className="text-sm text-[#5c6b63]">Revenue</p></motion.div>
          <motion.div><p className="text-2xl font-bold">{mockAnalytics.avgResponseTime}m</p><p className="text-sm text-[#5c6b63]">Avg Response</p></motion.div>
        </CardContent></Card>
      </motion.div>
    </>
  );
}
`.replace(/<motion\.div/g, "<motion.div").replace(/<motion\.div/g, "<div").replace(/<\/motion\.motion.div>/g, "</motion.div>").replace(/<\/motion\.div>/g, "</div>")
);

// Settings
fs.writeFileSync(
  "d:/whatsapp saas ai/src/app/dashboard/settings/page.tsx",
  `"use client";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <>
      <DashboardHeader title="Settings" subtitle="Workspace and integrations" />
      <motion.div className="p-6 max-w-2xl space-y-6">
        <Card><CardHeader><CardTitle>Business Profile</CardTitle></CardHeader><CardContent className="space-y-4">
          <Input placeholder="Business name" defaultValue="BOTFILTA Store" />
          <Input placeholder="Business description" defaultValue="Premium fashion and lifestyle products" />
          <Button>Save</Button>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>WhatsApp Cloud API</CardTitle></CardHeader><CardContent className="space-y-4">
          <Input placeholder="Phone Number ID" />
          <Input placeholder="Access Token" type="password" />
          <Input placeholder="Webhook Verify Token" />
          <Button>Connect WhatsApp</Button>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Google Gemini AI</CardTitle></CardHeader><CardContent className="space-y-4">
          <Input placeholder="GEMINI_API_KEY" type="password" />
          <p className="text-xs text-[#5c6b63]">Model: gemini-2.5-flash</p>
          <Button>Save AI Config</Button>
        </CardContent></Card>
      </motion.div>
    </>
  );
}
`.replace(/<motion\.div/g, "<div").replace(/<\/motion\.div>/g, "</div>")
);

console.log("pages written");
