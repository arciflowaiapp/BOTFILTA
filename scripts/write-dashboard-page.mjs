import fs from "fs";
const o = "<div";
const c = "</motion.div>".replace("motion.", "");

const page = `"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, ShoppingCart, Bot, Inbox } from "lucide-react";
import { mockAnalytics, mockConversations, chartData } from "@/lib/data/mock";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const stats = mockAnalytics;
  return (
    <>
      <DashboardHeader title="Overview" subtitle="Welcome back" />
      ${o} className="p-6 space-y-6">
        ${o} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Messages" value={stats.totalMessages.toLocaleString()} change={stats.messagesChange} icon={MessageSquare} />
          <StatCard title="Active Chats" value={String(stats.activeConversations)} change={stats.conversationsChange} icon={Inbox} />
          <StatCard title="New Customers" value={String(stats.newCustomers)} change={stats.customersChange} icon={Users} />
          <StatCard title="Revenue" value={formatCurrency(stats.revenue)} change={stats.revenueChange} icon={ShoppingCart} />
        ${c}
        ${o} className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Message Activity</CardTitle></CardHeader>
            <CardContent>
              ${o} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.messages}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8eeeb" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="inbound" stroke="#128c41" fill="#f0faf4" />
                    <Area type="monotone" dataKey="ai" stroke="#25d366" fill="#dcf8e8" />
                  </AreaChart>
                </ResponsiveContainer>
              ${c}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-[#25d366]" /> AI Performance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              ${o}>
                ${o} className="flex justify-between text-sm mb-1"><span>AI Resolution</span><span className="font-semibold">{stats.aiResolutionRate}%</span>${c}
                ${o} className="h-2 rounded-full bg-[#f0faf4]"><${"div"} className="h-2 rounded-full bg-[#25d366]" style={{ width: \`\${stats.aiResolutionRate}%\` }} />${c}
              ${c}
            </CardContent>
          </Card>
        ${c}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Conversations</CardTitle>
            <Badge variant="whatsapp">{mockConversations.filter((x) => x.unread_count > 0).length} unread</Badge>
          </CardHeader>
          <CardContent>
            ${o} className="space-y-3">
              {mockConversations.map((conv) => (
                ${o} key={conv.id} className="flex items-center gap-4 rounded-xl p-3 hover:bg-[#f0faf4]">
                  ${o} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0faf4] text-[#128c41] font-semibold text-sm">{conv.customer_name.charAt(0)}${c}
                  ${o} className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{conv.customer_name}</p>
                    <p className="text-sm text-[#5c6b63] truncate">{conv.last_message}</p>
                  ${c}
                  <span className="text-xs text-[#5c6b63]">{formatRelativeTime(conv.last_message_at)}</span>
                ${c}
              ))}
            ${c}
          </CardContent>
        </Card>
      ${c}
    </>
  );
}
`;

fs.writeFileSync("d:/whatsapp saas ai/src/app/dashboard/page.tsx", page);
console.log("written");
