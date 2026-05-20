import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafcfb]">
      <Sidebar />
      <main className="pl-64 min-h-screen transition-all">{children}</main>
    </div>
  );
}
