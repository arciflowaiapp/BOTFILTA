"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative min-h-screen gradient-mesh overflow-hidden pt-28 pb-20 px-4">
      <motion.div
        className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-[#25d366]/10 blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-[#128c41]/8 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative mx-auto max-w-6xl text-center">
        <motion.div {...fadeUp}>
          <Badge variant="whatsapp" className="mb-6 px-4 py-1.5">
            <Sparkles className="mr-1.5 h-3.5 w-3.5 inline" />
            Powered by Gemini 2.5 Flash · Urdu + English
          </Badge>
        </motion.div>

        <motion.h1 {...fadeUp} transition={{ delay: 0.1 }} className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          WhatsApp CRM meets<br />
          <span className="gradient-text">AI intelligence</span>
        </motion.h1>

        <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="mx-auto mt-6 max-w-2xl text-lg text-[#5c6b63] sm:text-xl">
          BOTFILTA AI helps businesses manage WhatsApp chats, customers, orders, and products with AI that speaks Urdu and English.
        </motion.p>

        <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="xl" asChild><Link href="/dashboard">Start free trial <ArrowRight /></Link></Button>
          <Button size="xl" variant="outline" asChild><Link href="#ai-demo">Watch AI demo</Link></Button>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.5 }} className="mt-16 mx-auto max-w-4xl">
          <ChatPreview />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-[#5c6b63]">
          {["500+ businesses", "2M+ messages", "78% AI resolution", "4.9★ rating"].map((s) => (
            <span key={s} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#25d366]" />{s}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ChatPreview() {
  return (
    <div className="glass-card rounded-3xl p-1 shadow-premium-lg text-left">
      <div className="rounded-[22px] bg-white p-6">
        <div className="flex items-center gap-3 border-b border-[#e8eeeb] pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25d366]">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Ahmed Khan</p>
            <p className="text-xs text-[#5c6b63]">Online · WhatsApp</p>
          </div>
          <Badge variant="whatsapp"><Zap className="mr-1 h-3 w-3 inline" /> AI Active</Badge>
        </div>
        <div className="mt-4 space-y-3">
          <div className="chat-bubble-in max-w-[80%] p-3 text-sm">Blue hoodie price?</div>
          <div className="chat-bubble-out max-w-[85%] ml-auto p-3 text-sm">
            Our Blue Hoodie is available for <strong>PKR 2,500</strong>. Sizes S-XL in stock. Delivery in 2-3 days.
          </div>
        </div>
      </div>
    </div>
  );
}
