"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Bot,
  Sparkles,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  // EMAIL LOGIN
  // =========================

  const handleLogin = async () => {

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      window.location.href = "/dashboard";
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================

  const handleGoogleLogin = async () => {

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#f6fff9]">

      {/* BACKGROUND */}

      <div className="pointer-events-none absolute left-[20%] top-[-120px] h-[350px] w-[350px] rounded-full bg-green-300/30 blur-3xl"></div>

      <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[300px] w-[300px] rounded-full bg-emerald-300/30 blur-3xl"></div>

      <div className="pointer-events-none absolute bottom-[-100px] left-[45%] h-[250px] w-[250px] rounded-full bg-lime-300/20 blur-3xl"></div>

      {/* FLOATING ICONS */}

      <Bot className="pointer-events-none absolute left-16 top-16 h-16 w-16 animate-bounce text-green-300/30" />

      <Sparkles className="pointer-events-none absolute right-24 top-24 h-14 w-14 animate-spin text-green-300/30" />

      <MessageCircle className="pointer-events-none absolute bottom-20 left-24 h-14 w-14 animate-pulse text-green-300/30" />

      {/* MAIN */}

      <div className="relative z-50 grid w-full lg:grid-cols-2">

        {/* LEFT */}

        <div className="hidden items-center justify-center lg:flex">

          <div className="max-w-xl px-12">

            <div className="mb-6 flex items-center gap-3">

              <ShieldCheck className="h-12 w-12 text-green-500" />

              <span className="rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-700">

                AI Powered CRM

              </span>

            </div>

            <h1 className="text-7xl font-black leading-[1.05] text-black">

              Automate
              <br />

              WhatsApp
              <br />

              Marketing
              <br />

              with
              <span className="text-green-600"> AI</span>

            </h1>

            <p className="mt-8 text-xl leading-relaxed text-gray-600">

              BOTFILTA AI helps businesses automate chats,
              campaigns, customer support, and sales
              directly from WhatsApp using AI.

            </p>

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex items-center justify-center p-6">

          <div className="w-full max-w-md">

            {/* LOGO */}

            <div className="mb-10 flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-green-500 to-emerald-400 shadow-lg shadow-green-500/30">

                <Bot className="h-8 w-8 text-white" />

              </div>

              <div>

                <h1 className="text-4xl font-black text-black">
                  BOTFILTA
                  <span className="text-green-600"> AI</span>
                </h1>

                <p className="text-sm text-gray-500">
                  AI WhatsApp CRM Platform
                </p>

              </div>

            </div>

            {/* CARD */}

            <div className="rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-[0_10px_60px_rgba(34,197,94,0.12)] backdrop-blur-xl">

              <h2 className="mb-2 text-4xl font-bold text-black">
                Welcome Back
              </h2>

              <p className="mb-8 text-gray-500">
                Login to continue using BOTFILTA AI
              </p>

              {/* GOOGLE */}

              <button
                onClick={handleGoogleLogin}
                className="mb-5 flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white py-4 font-semibold text-black shadow-sm transition-all duration-300 hover:bg-gray-100 hover:scale-[1.01]"
              >

                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="h-5 w-5"
                />

                Continue with Google

              </button>

              {/* DIVIDER */}

              <div className="relative my-6">

                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>

                <div className="relative flex justify-center text-sm">

                  <span className="bg-white px-4 text-gray-400">
                    OR
                  </span>

                </div>

              </div>

              {/* EMAIL */}

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-5 w-full rounded-2xl border border-gray-200 bg-[#f7f7f7] px-5 py-4 text-black outline-none transition-all duration-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
              />

              {/* PASSWORD */}

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-6 w-full rounded-2xl border border-gray-200 bg-[#f7f7f7] px-5 py-4 text-black outline-none transition-all duration-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
              />

              {/* LOGIN */}

              <button
                onClick={handleLogin}
                className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-400 py-4 text-lg font-bold text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-[1.02]"
              >

                Sign In

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}