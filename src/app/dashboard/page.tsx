"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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
} from "lucide-react";

export default function DashboardPage() {

  const [user, setUser] = useState<any>(null);

  // =========================
  // GET USER
  // =========================

  useEffect(() => {

    const getUser = async () => {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
      } else {
        setUser(user);
      }
    };

    getUser();

  }, []);

  // =========================
  // LOGOUT
  // =========================

  const logout = async () => {

    await supabase.auth.signOut();

    window.location.href = "/login";
  };

  return (

    <div className="flex min-h-screen bg-[#f6fff9] overflow-hidden">

      {/* ========================= */}
      {/* SIDEBAR */}
      {/* ========================= */}

      <div className="hidden w-[290px] border-r border-gray-200 bg-white lg:block">

        {/* LOGO */}

        <div className="flex items-center gap-4 border-b border-gray-100 p-8">

          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-green-500 to-emerald-400 shadow-lg shadow-green-500/30">

            <Bot className="h-8 w-8 text-white" />

          </div>

          <div>

            <h1 className="text-3xl font-black text-black">
              BOTFILTA
            </h1>

            <p className="text-sm text-gray-500">
              AI WhatsApp CRM
            </p>

          </div>

        </div>

        {/* MENU */}

        <div className="p-5">

          <div className="space-y-3">

            <button className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-400 px-5 py-4 font-semibold text-white shadow-lg shadow-green-500/20">

              <LayoutDashboard className="h-5 w-5" />

              Dashboard

            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 font-semibold text-gray-700 transition hover:bg-gray-100">

              <Users className="h-5 w-5" />

              Contacts

            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 font-semibold text-gray-700 transition hover:bg-gray-100">

              <MessageCircle className="h-5 w-5" />

              WhatsApp Chats

            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 font-semibold text-gray-700 transition hover:bg-gray-100">

              <BarChart3 className="h-5 w-5" />

              Analytics

            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 font-semibold text-gray-700 transition hover:bg-gray-100">

              <Sparkles className="h-5 w-5" />

              AI Automation

            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 font-semibold text-gray-700 transition hover:bg-gray-100">

              <Settings className="h-5 w-5" />

              Settings

            </button>

          </div>

          {/* AI CARD */}

          <div className="mt-10 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-400 p-6 text-white shadow-xl">

            <ShieldCheck className="mb-4 h-12 w-12" />

            <h2 className="text-2xl font-bold">
              AI Assistant
            </h2>

            <p className="mt-3 text-sm leading-6 text-green-50">

              Automate replies, boost sales,
              and manage WhatsApp customers
              using AI automation.

            </p>

            <button className="mt-6 w-full rounded-2xl bg-white py-3 font-semibold text-green-600 transition hover:scale-[1.02]">

              Activate AI

            </button>

          </div>

        </div>

      </div>

      {/* ========================= */}
      {/* MAIN */}
      {/* ========================= */}

      <div className="flex-1 overflow-y-auto">

        {/* TOPBAR */}

        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-6">

          <div>

            <h1 className="text-4xl font-black text-black">
              Dashboard
            </h1>

            <p className="mt-2 text-gray-500">
              Welcome back to BOTFILTA AI 👋
            </p>

          </div>

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-green-50 px-5 py-3">

              <p className="text-sm text-gray-500">
                Logged in as
              </p>

              <p className="font-semibold text-green-700">
                {user?.email}
              </p>

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

        {/* CONTENT */}

        <div className="p-8">

          {/* STATS */}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">

              <p className="text-gray-500">
                Total Customers
              </p>

              <h2 className="mt-4 text-5xl font-black text-black">
                1,284
              </h2>

              <div className="mt-4 flex items-center gap-2 text-green-600">

                <TrendingUp className="h-5 w-5" />

                +24% this month

              </div>

            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">

              <p className="text-gray-500">
                AI Conversations
              </p>

              <h2 className="mt-4 text-5xl font-black text-black">
                8,421
              </h2>

              <div className="mt-4 flex items-center gap-2 text-green-600">

                <TrendingUp className="h-5 w-5" />

                +18% this week

              </div>

            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">

              <p className="text-gray-500">
                Orders
              </p>

              <h2 className="mt-4 text-5xl font-black text-black">
                329
              </h2>

              <div className="mt-4 flex items-center gap-2 text-green-600">

                <TrendingUp className="h-5 w-5" />

                +12% today

              </div>

            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">

              <p className="text-gray-500">
                Revenue
              </p>

              <h2 className="mt-4 text-5xl font-black text-black">
                PKR 245k
              </h2>

              <div className="mt-4 flex items-center gap-2 text-green-600">

                <TrendingUp className="h-5 w-5" />

                +31% growth

              </div>

            </div>

          </div>

          {/* CHATS + PERFORMANCE */}

          <div className="mt-8 grid gap-6 lg:grid-cols-3">

            {/* CHATS */}

            <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-sm border border-gray-100">

              <div className="mb-8 flex items-center justify-between">

                <div>

                  <h2 className="text-3xl font-black text-black">
                    Recent WhatsApp Chats
                  </h2>

                  <p className="mt-2 text-gray-500">
                    AI powered customer conversations
                  </p>

                </div>

                <span className="rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-700">

                  AI Active

                </span>

              </div>

              <div className="space-y-6">

                <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-5 transition hover:bg-gray-50">

                  <div>

                    <h3 className="text-xl font-bold text-black">
                      Ahmed Khan
                    </h3>

                    <p className="mt-1 text-gray-500">
                      Asked about hoodie price
                    </p>

                  </div>

                  <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

                    Replied

                  </span>

                </div>

                <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-5 transition hover:bg-gray-50">

                  <div>

                    <h3 className="text-xl font-bold text-black">
                      Ali Raza
                    </h3>

                    <p className="mt-1 text-gray-500">
                      Delivery tracking request
                    </p>

                  </div>

                  <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

                    Replied

                  </span>

                </div>

                <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-5 transition hover:bg-gray-50">

                  <div>

                    <h3 className="text-xl font-bold text-black">
                      Sara Ahmed
                    </h3>

                    <p className="mt-1 text-gray-500">
                      Product stock inquiry
                    </p>

                  </div>

                  <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">

                    Pending

                  </span>

                </div>

              </div>

            </div>

            {/* AI PERFORMANCE */}

            <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">

              <h2 className="text-3xl font-black text-black">
                AI Performance
              </h2>

              <p className="mt-2 text-gray-500">
                Real-time automation stats
              </p>

              <div className="mt-8 space-y-8">

                <div>

                  <div className="mb-3 flex justify-between">

                    <span className="font-medium text-gray-600">
                      Response Rate
                    </span>

                    <span className="font-bold text-black">
                      98%
                    </span>

                  </div>

                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">

                    <div className="h-full w-[98%] rounded-full bg-green-500"></div>

                  </div>

                </div>

                <div>

                  <div className="mb-3 flex justify-between">

                    <span className="font-medium text-gray-600">
                      Customer Satisfaction
                    </span>

                    <span className="font-bold text-black">
                      95%
                    </span>

                  </div>

                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">

                    <div className="h-full w-[95%] rounded-full bg-green-500"></div>

                  </div>

                </div>

                <div>

                  <div className="mb-3 flex justify-between">

                    <span className="font-medium text-gray-600">
                      Automation
                    </span>

                    <span className="font-bold text-black">
                      89%
                    </span>

                  </div>

                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">

                    <div className="h-full w-[89%] rounded-full bg-green-500"></div>

                  </div>

                </div>

              </div>

              <button className="mt-10 w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-400 py-4 text-lg font-bold text-white shadow-lg shadow-green-500/20 transition hover:scale-[1.02]">

                Open AI Automation

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}