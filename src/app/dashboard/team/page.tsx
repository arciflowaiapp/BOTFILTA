"use client";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockTeam } from "@/lib/data/mock";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function Page() {
  const rows = mockTeam.map((t) => [t.name, t.email, t.role, t.messages_handled, t.avg_response_time + " min", t.is_online ? "Online" : "Offline"]);
  return (
    <>
      <DashboardHeader title="Team Management" subtitle="Manage team members and performance" />
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <Button><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </div>
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8eeeb] bg-[#f0faf4]/50">
                  <th className="text-left p-4 font-medium text-[#5c6b63]">Name</th><th className="text-left p-4 font-medium text-[#5c6b63]">Email</th><th className="text-left p-4 font-medium text-[#5c6b63]">Role</th><th className="text-left p-4 font-medium text-[#5c6b63]">Messages</th><th className="text-left p-4 font-medium text-[#5c6b63]">Avg Response</th><th className="text-left p-4 font-medium text-[#5c6b63]">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-[#e8eeeb]/50 hover:bg-[#f0faf4]/30">
                    {row.map((cell, j) => (
                      <td key={j} className="p-4">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
