import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BOTFILTA AI — Premium WhatsApp CRM + AI Assistant",
  description:
    "AI-powered WhatsApp CRM for businesses. Manage chats, customers, orders, and automate replies with Gemini AI. Urdu + English support.",
  keywords: ["WhatsApp CRM", "AI assistant", "business automation", "Pakistan", "Urdu"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${geist.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
