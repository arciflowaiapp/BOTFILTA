"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  Bot,
  LayoutDashboard,
  Users,
  MessageCircle,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { mockConversations } from "@/lib/data/mock";
import { formatRelativeTime } from "@/lib/utils";

interface Stats {
  totalContacts: number;
  totalMessages: number;
  activeConversations: number;
  aiReplies: number;
}

interface RecentConv {
  id: string;
  customer_name: string;
  last_message: string;
  last_message_at: string;
  status: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentConv[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser({ email: user.email ?? "" });
        } else {
          setUser({ email: "demo@botfilta.ai" });
        }
      } catch {
        setUser({ email: "demo@botfilta.ai" });
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    async function loadStats() {
      try {
        const [analyticsRes, convsRes] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/conversations?limit=3"),
        ]);
        const analyticsData = await analyticsRes.json();
        const convsData = await convsRes.json();

        if (analyticsData.analytics) {
          setStats({
            totalContacts: analyticsData.analytics.totalCustomers,
            totalMessages: analyticsData.analytics.totalMessages,
            activeConversations: analyticsData.analytics.activeConversations,
            aiReplies: analyticsData.analytics.aiReplies,
          });
        }

        if (convsData.conversations?.length) {
          setRecent(convsData.conversations.slice(0, 3));
        } else {
          setRecent(mockConversations.map((c) => ({
            id: c.id,
            customer_name: c.customer_name,
            last_message: c.last_message,
            last_message_at: c.last_message_at,
            status: c.status,
          })));
        }
      } catch {
        setRecent(mockConversations.map((c) => ({
          id: c.id,
          customer_name: c.customer_name,
          last_message: c.last_message,
          last_message_at: c.last_message_at,
          status: c.status,
        })));
      } finally {
        setLoadingStats(false);
      }
    }
    loadStats();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const displayStats = stats ?? {
    totalContacts: 0,
    totalMessages: 0,
    activeConversations: 0,
    aiReplies: 0,
  };
  const isDemo = !stats || (stats.totalContacts === 0 && stats.totalMessages === 0);

  return (
    <div className="flex min-h-screen bg-[#f6fff9] overflow-hidden">
      <div className="hidden w-[290px] border-r border-gray-200 bg-white lg:block">
        <div className="flex items-center gap-4 border-b border-gray-100 p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-green-500 to-emerald-400 shadow-lg shadow-green-500/30">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-black">BOTFILTA</h1>
            <p className="text-sm text-gray-500">AI WhatsApp CRM</p>
          </div>
        </div>

        <div className="p-5">
          <div className="space-y-3">
            {[
              { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, active: true },
              { href: "/dashboard/customers", label: "Contacts", icon: Users },
              { href: "/dashboard/inbox", label: "WhatsApp Chats", icon: MessageCircle },
              { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
              { href: "/dashboard/ai", label: "AI Automation", icon: Sparkles },
              { href: "/dashboard/settings", label: "Settings", icon: Settings },
            ].map(({ href, label, icon: Icon, active }) => (
              <Link
                key={href}
                href={href}
                className={`flex w-full items-center gap-3 rounded-2xl px-5 py-4 font-semibold transition ${
                  active
                    ? "bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg shadow-green-500/20"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-400 p-6 text-white shadow-xl">
            <ShieldCheck className="mb-4 h-12 w-12" />
            <h2 className="text-2xl font-bold">AI Assistant</h2>
            <p className="mt-3 text-sm leading-6 text-green-50">
              Automate replies, boost sales, and manage WhatsApp customers using AI automation.
            </p>
            <Link
              href="/dashboard/ai"
              className="mt-6 block w-full rounded-2xl bg-white py-3 text-center font-semibold text-green-600 transition hover:scale-[1.02]"
            >
              Activate AI
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-6">
          <div>
            <h1 className="text-4xl font-black text-black">Dashboard</h1>
            <p className="mt-2 text-gray-500">
              Welcome back to BOTFILTA AI 👋
              {isDemo && <span className="ml-2 text-xs text-amber-600">(Demo — connect Supabase for live data)</span>}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-green-50 px-5 py-3">
              <p className="text-sm text-gray-500">Logged in as</p>
              <p className="font-semibold text-green-700 truncate max-w-[180px]">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Contacts", value: displayStats.totalContacts, suffix: "", trend: "+24% this month", href: "/dashboard/customers" },
              { label: "AI Conversations", value: displayStats.aiReplies, suffix: "", trend: "+18% this week", href: "/dashboard/ai" },
              { label: "Active Chats", value: displayStats.activeConversations, suffix: "", trend: "Open now", href: "/dashboard/inbox" },
              { label: "Total Messages", value: displayStats.totalMessages, suffix: "", trend: "All time", href: "/dashboard/analytics" },
            ].map(({ label, value, trend, href }) => (
              <Link key={label} href={href} className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow block">
                <p className="text-gray-500">{label}</p>
                {loadingStats ? (
                  <Loader2 className="mt-4 h-8 w-8 animate-spin text-gray-300" />
                ) : (
                  <h2 className="mt-4 text-5xl font-black text-black">{value.toLocaleString()}</h2>
                )}
                <div className="mt-4 flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm">{trend}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-black">Recent WhatsApp Chats</h2>
                  <p className="mt-2 text-gray-500">AI powered customer conversations</p>
                </div>
                <span className="rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-700">
                  AI Active
                </span>
              </div>

              <div className="space-y-4">
                {recent.length === 0 && !loadingStats ? (
                  <div className="flex flex-col items-center py-8 text-gray-400">
                    <MessageSquare className="h-10 w-10 mb-2 opacity-30" />
                    <p className="text-sm">No conversations yet</p>
                    <Link href="/dashboard/inbox" className="mt-2 text-sm text-green-600 hover:underline">
                      Go to Inbox
                    </Link>
                  </div>
                ) : (
                  recent.map((conv) => (
                    <Link
                      key={conv.id}
                      href="/dashboard/inbox"
                      className="flex items-center justify-between rounded-2xl border border-gray-100 p-5 transition hover:bg-gray-50 block"
                    >
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-black">{conv.customer_name}</h3>
                        <p className="mt-1 text-gray-500 truncate max-w-xs">{conv.last_message}</p>
                        <p className="text-xs text-gray-300 mt-1">{formatRelativeTime(conv.last_message_at)}</p>
                      </div>
                      <span className={`ml-4 shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                        conv.status === "open"
                          ? "bg-green-100 text-green-700"
                          : conv.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {conv.status === "open" ? "Active" : conv.status === "pending" ? "Pending" : "Resolved"}
                      </span>
                    </Link>
                  ))
                )}
              </div>

              <Link
                href="/dashboard/inbox"
                className="mt-6 block w-full text-center rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                View All Chats →
              </Link>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
              <h2 className="text-3xl font-black text-black">AI Performance</h2>
              <p className="mt-2 text-gray-500">Real-time automation stats</p>

              <div className="mt-8 space-y-8">
                {[
                  { label: "Response Rate", value: 98 },
                  { label: "Customer Satisfaction", value: 95 },
                  { label: "Automation", value: 89 },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="mb-3 flex justify-between">
                      <span className="font-medium text-gray-600">{label}</span>
                      <span className="font-bold text-black">{value}%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/dashboard/ai"
                className="mt-10 block w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-400 py-4 text-center text-lg font-bold text-white shadow-lg shadow-green-500/20 transition hover:scale-[1.02]"
              >
                Open AI Automation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
