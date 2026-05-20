"use client";

import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e8eeeb] bg-white/80 backdrop-blur-xl px-6">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        {subtitle && <p className="text-xs text-[#5c6b63]">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5c6b63]" />
          <Input placeholder="Search..." className="w-64 pl-9" />
        </div>
        <Button size="sm" variant="outline" className="hidden sm:flex">
          <Plus className="h-4 w-4 mr-1" /> New
        </Button>
        <button className="relative rounded-xl p-2 hover:bg-[#f0faf4]">
          <Bell className="h-5 w-5 text-[#5c6b63]" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#25d366]" />
        </button>
        <Avatar>
          <AvatarFallback className="bg-[#f0faf4] text-[#128c41]">AH</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
