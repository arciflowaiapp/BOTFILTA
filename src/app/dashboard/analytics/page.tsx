"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { chartData as mockChartData } from "@/lib/data/mock";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import {
  MessageCircle, Users, Bot, TrendingUp, TrendingDown, Minus, Loader2,
} from "lucide-react";

const COLORS = ["#25d366", "#128c41", "#6b7280"];

interface Analytics {
  totalMessages: number;
  messagesChange: number;
  activeConversations: number;
  newCustomers: number;
  customersChange: number;
  totalCustomers: number;
  aiReplies: number;
  aiResolutionRate: number;
  avgResponseTime: number;
}

interface Charts {
  messages: { date: string; inbound: number; outbound: number; ai: number }[];
  aiPerformance: { name: string; value: number }[];
}

function Trend({ change }: { change: number }) {
  if (change > 0) return <span className="flex items-center gap-1 text-green-600 text-sm"><TrendingUp className="h-4 w-4" />+{change}%</span>;
  if (change < 0) return <span className="flex items-center gap-1 text-red-500 text-sm"><TrendingDown className="h-4 w-4" />{change}%</span>;
  return <span className="flex items-center gap-1 text-gray-400 text-sm"><Minus className="h-4 w-4" />No change</span>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [charts, setCharts] = useState<Charts | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/analytics");
        const data = await res.json();
        setAnalytics(data.analytics);
        setCharts(data.charts ?? null);
        setIsDemo(!!data.demo);
      } catch {
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const showMockData = isDemo || !analytics || (analytics.totalMessages === 0 && analytics.totalCustomers === 0);
  const messageData = charts?.messages ?? mockChartData.messages;
  const aiData = charts?.aiPerformance ?? mockChartData.aiPerformance;

  const stats = showMockData
    ? {
        totalMessages: 12847,
        messagesChange: 12.5,
        activeConversations: 156,
        newCustomers: 89,
        customersChange: 15.2,
        totalCustomers: 1284,
        aiReplies: 9842,
        aiResolutionRate: 78.5,
        avgResponseTime: 1.2,
      }
    : analytics!;

  return (
    <>
      <DashboardHeader
        title="Analytics"
        subtitle={`Business insights${isDemo ? " (Demo data — connect Supabase for real stats)" : " — Live data"}`}
      />

      <div className="p-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-xl bg-blue-50 p-2">
                      <MessageCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-500">Total Messages</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalMessages.toLocaleString()}</p>
                  <div className="mt-2"><Trend change={stats.messagesChange} /></div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-xl bg-green-50 p-2">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-500">Total Contacts</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers.toLocaleString()}</p>
                  <div className="mt-2"><Trend change={stats.customersChange} /></div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-xl bg-purple-50 p-2">
                      <Bot className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-500">AI Replies</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.aiReplies.toLocaleString()}</p>
                  <p className="text-sm text-gray-400 mt-2">{stats.aiResolutionRate}% resolution rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-xl bg-orange-50 p-2">
                      <MessageCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    <p className="text-sm text-gray-500">Active Chats</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeConversations.toLocaleString()}</p>
                  <p className="text-sm text-gray-400 mt-2">Avg {stats.avgResponseTime}m response</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Message Activity (This Week)</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={messageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="inbound" stroke="#3b82f6" strokeWidth={2} dot={false} name="Inbound" />
                      <Line type="monotone" dataKey="outbound" stroke="#25d366" strokeWidth={2} dot={false} name="Outbound" />
                      <Line type="monotone" dataKey="ai" stroke="#8b5cf6" strokeWidth={2} dot={false} name="AI" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI vs Human Replies</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={aiData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {aiData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.aiResolutionRate}%</p>
                    <p className="text-sm text-gray-500 mt-1">AI Resolution Rate</p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-green-500" style={{ width: `${stats.aiResolutionRate}%` }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.avgResponseTime}m</p>
                    <p className="text-sm text-gray-500 mt-1">Avg Response Time</p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: "92%" }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.newCustomers}</p>
                    <p className="text-sm text-gray-500 mt-1">New Contacts (Month)</p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-purple-500" style={{ width: "75%" }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.aiReplies.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">Total AI Replies</p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-orange-500" style={{ width: "88%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
