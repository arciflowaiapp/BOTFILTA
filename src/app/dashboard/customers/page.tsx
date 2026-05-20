"use client";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockCustomers } from "@/lib/data/mock";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function Page() {
  const rows = mockCustomers.map((c) => [c.name, c.phone, c.tags.join(", "), c.total_orders, formatCurrency(c.total_spent), c.sentiment || "neutral"]);
  return (
    <>
      <DashboardHeader title="Customers" subtitle="Manage your customer relationships" />
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <Button><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </div>
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8eeeb] bg-[#f0faf4]/50">
                  <th className="text-left p-4 font-medium text-[#5c6b63]">Name</th><th className="text-left p-4 font-medium text-[#5c6b63]">Phone</th><th className="text-left p-4 font-medium text-[#5c6b63]">Tags</th><th className="text-left p-4 font-medium text-[#5c6b63]">Orders</th><th className="text-left p-4 font-medium text-[#5c6b63]">Spent</th><th className="text-left p-4 font-medium text-[#5c6b63]">Sentiment</th>
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
