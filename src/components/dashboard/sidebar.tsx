"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Inbox, Users, Package, ShoppingCart,
  Bot, BarChart3, UserCog, Settings, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { useState } from "react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/inbox", label: "Shared Inbox", icon: Inbox },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/ai", label: "AI Assistant", icon: Bot },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/team", label: "Team", icon: UserCog },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[#e8eeeb] bg-white/90 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className={cn("flex h-16 items-center border-b border-[#e8eeeb] px-4", collapsed && "justify-center")}>
        {!collapsed ? <Logo href="/dashboard" size="sm" /> : (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#128c41] to-[#25d366] text-white text-xs font-bold">B</div>
        )}
      </div>
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active ? "bg-[#f0faf4] text-[#128c41]" : "text-[#5c6b63] hover:bg-[#f0faf4]/60"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", active && "text-[#25d366]")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="m-3 flex items-center justify-center rounded-xl border border-[#e8eeeb] p-2 text-[#5c6b63] hover:bg-[#f0faf4]"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
