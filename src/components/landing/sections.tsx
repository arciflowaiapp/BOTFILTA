"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BarChart3, Bot, Globe, Inbox, Package, ShoppingCart, Sparkles,
  Tag, Users, Zap, Shield, Clock, TrendingUp, MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { chartData } from "@/lib/data/mock";

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const features = [
  { icon: Inbox, title: "Shared WhatsApp Inbox", desc: "One inbox for your entire team." },
  { icon: Bot, title: "AI Auto Replies", desc: "Gemini 2.5 Flash — Urdu + English." },
  { icon: Package, title: "Product Management", desc: "AI answers using your product database." },
  { icon: ShoppingCart, title: "Order Management", desc: "Track orders with AI status updates." },
  { icon: Users, title: "Customer CRM", desc: "Tags, notes, sentiment, full history." },
  { icon: BarChart3, title: "Analytics", desc: "Messages, revenue, team & AI metrics." },
  { icon: Tag, title: "Smart Labels", desc: "Custom tags and lead detection." },
  { icon: Globe, title: "Bilingual AI", desc: "Urdu and English conversations." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 bg-white">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fade} className="text-center mb-16">
          <Badge variant="whatsapp" className="mb-4">Features</Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Everything to <span className="gradient-text">scale on WhatsApp</span>
          </h2>
        </motion.div>
        <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div key={f.title} {...fade} transition={{ delay: i * 0.05 }}>
              <Card className="h-full hover:shadow-premium transition-shadow">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0faf4] text-[#128c41] mb-2">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </CardHeader>
                <CardContent><CardDescription>{f.desc}</CardDescription></CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function AIDemoSection() {
  const demos = [
    { q: "Blue hoodie price?", a: "Blue Hoodie — PKR 2,500. Delivery in 2–3 days.", lang: "EN" },
    { q: "میرا آرڈر کہاں ہے؟", a: "آپ کا آرڈر شپ ہو چکا ہے۔ 1-2 دن میں ڈیلیور ہو گا۔", lang: "UR" },
    { q: "White sneakers?", a: "Running Sneakers White/Red — PKR 4,500. Sizes 40–44.", lang: "EN" },
  ];
  return (
    <section id="ai-demo" className="py-24 px-4 gradient-hero">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fade} className="text-center mb-16">
          <Badge variant="whatsapp" className="mb-4"><Sparkles className="mr-1 h-3 w-3 inline" /> AI Demo</Badge>
          <h2 className="text-3xl font-bold">AI that <span className="gradient-text">knows your catalog</span></h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {demos.map((d, i) => (
            <motion.div key={i} {...fade} transition={{ delay: i * 0.1 }}>
              <Card className="shadow-premium">
                <CardContent className="p-6 space-y-4">
                  <Badge variant="secondary">{d.lang}</Badge>
                  <div className="chat-bubble-in p-3 text-sm">{d.q}</div>
                  <div className="chat-bubble-out p-3 text-sm">{d.a}</div>
                  <p className="text-xs text-[#5c6b63] flex items-center gap-1">
                    <Zap className="h-3 w-3 text-[#25d366]" /> Gemini 2.5 Flash
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AnalyticsPreview() {
  return (
    <section id="analytics" className="py-24 px-4 bg-white">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fade} className="text-center mb-12">
          <Badge variant="whatsapp" className="mb-4">Analytics</Badge>
          <h2 className="text-3xl font-bold">Insights that <span className="gradient-text">drive growth</span></h2>
        </motion.div>
        <motion.div {...fade}>
          <Card className="shadow-premium-lg p-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.messages}>
                  <defs>
                    <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#25d366" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#25d366" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8eeeb" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="ai" stroke="#25d366" fill="url(#aiGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const items = [
    { name: "Hassan Raza", role: "CEO, StyleHub PK", text: "Urdu support is a game-changer. Response time down 80%." },
    { name: "Fatima Ali", role: "Bloom Boutique", text: "AI handles 70% of product inquiries automatically." },
    { name: "Ahmed Khan", role: "TechMart", text: "Best WhatsApp CRM we have used." },
  ];
  return (
    <section className="py-24 px-4 bg-[#f0faf4]/50">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fade} className="text-center mb-12">
          <h2 className="text-3xl font-bold">Loved by <span className="gradient-text">500+ businesses</span></h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <motion.div key={t.name} {...fade} transition={{ delay: i * 0.1 }}>
              <Card><CardContent className="p-6">
                <p className="text-[#5c6b63] italic">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold mt-4">{t.name}</p>
                <p className="text-sm text-[#5c6b63]">{t.role}</p>
              </CardContent></Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const plans = [
  { name: "Starter", price: "2,999", features: ["1 number", "2 members", "500 AI replies"], popular: false },
  { name: "Growth", price: "7,999", features: ["3 numbers", "10 members", "5K AI replies", "Broadcasts"], popular: true },
  { name: "Enterprise", price: "Custom", features: ["Unlimited", "Custom integrations", "Dedicated support"], popular: false },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-4 bg-white">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fade} className="text-center mb-12">
          <Badge variant="whatsapp" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl font-bold">Simple <span className="gradient-text">PKR pricing</span></h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} {...fade} transition={{ delay: i * 0.1 }}>
              <Card className={plan.popular ? "border-[#25d366] shadow-glow-green" : ""}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <p className="text-3xl font-bold mt-2">
                    {plan.price === "Custom" ? "Custom" : `PKR ${plan.price}`}
                    {plan.price !== "Custom" && <span className="text-sm font-normal text-[#5c6b63]">/mo</span>}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6 text-sm text-[#5c6b63]">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2"><Shield className="h-4 w-4 text-[#25d366] shrink-0" />{f}</li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                    <Link href="/dashboard">Start free trial</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const faqs = [
    { q: "Does it support Urdu?", a: "Yes — full Urdu and English AI support including mixed conversations." },
    { q: "Which WhatsApp API?", a: "Meta WhatsApp Cloud API — official and scalable." },
    { q: "How does AI know prices?", a: "From your product database in the dashboard." },
    { q: "Free trial?", a: "14-day free trial on all plans, no credit card required." },
  ];
  return (
    <section id="faq" className="py-24 px-4 bg-[#f0faf4]/30">
      <div className="mx-auto max-w-3xl">
        <motion.div {...fade} className="text-center mb-12">
          <h2 className="text-3xl font-bold">FAQ</h2>
        </motion.div>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <motion.div key={i} {...fade}>
              <Card><CardContent className="p-6">
                <h3 className="font-semibold mb-2">{f.q}</h3>
                <p className="text-sm text-[#5c6b63]">{f.a}</p>
              </CardContent></Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-24 px-4">
      <motion.div {...fade} className="mx-auto max-w-4xl text-center glass-card rounded-3xl p-12 shadow-premium-lg">
        <h2 className="text-3xl font-bold mb-4">Transform your <span className="gradient-text">WhatsApp business</span></h2>
        <p className="text-[#5c6b63] mb-8">Join 500+ businesses automating support with BOTFILTA AI.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="xl" asChild><Link href="/dashboard">Start free trial</Link></Button>
          <Button size="xl" variant="outline" asChild><Link href="#pricing">View pricing</Link></Button>
        </div>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#e8eeeb] bg-white py-16 px-4">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p className="font-bold text-xl">BOTFILTA <span className="gradient-text">AI</span></p>
          <p className="text-sm text-[#5c6b63] mt-2">Premium WhatsApp CRM + AI Assistant</p>
        </div>
        <p className="text-sm text-[#5c6b63]">© {new Date().getFullYear()} BOTFILTA AI</p>
      </div>
    </footer>
  );
}
