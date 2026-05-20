import fs from "fs";
const o = "<div";
const c = "</div>";
const content = `"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ title, value, change, icon: Icon, iconColor = "text-[#128c41]" }: StatCardProps) {
  const positive = change !== undefined && change >= 0;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="hover:shadow-premium transition-shadow">
        <CardContent className="p-6">
          ${o} className="flex items-start justify-between">
            ${o}>
              <p className="text-sm text-[#5c6b63]">{title}</p>
              <p className="text-2xl font-bold mt-1">{value}</p>
              {change !== undefined && (
                <p className={cn("text-xs mt-2 flex items-center gap-1", positive ? "text-emerald-600" : "text-red-500")}>
                  {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(change)}% vs last week
                </p>
              )}
            ${c}
            ${o} className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0faf4]", iconColor)}>
              <Icon className="h-5 w-5" />
            ${c}
          ${c}
        </CardContent>
      </Card>
    </motion.div>
  );
}
`;
fs.writeFileSync("d:/whatsapp saas ai/src/components/dashboard/stat-card.tsx", content);
