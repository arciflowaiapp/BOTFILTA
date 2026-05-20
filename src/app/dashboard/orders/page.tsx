"use client";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockOrders } from "@/lib/data/mock";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function Page() {
  const rows = mockOrders.map((o) => [o.id.slice(0,8), o.customer_name, o.status, formatCurrency(o.total), new Date(o.created_at).toLocaleDateString()]);
  return (
    <>
      <DashboardHeader title="Orders" subtitle="Track and manage customer orders" />
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <Button><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </div>
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8eeeb] bg-[#f0faf4]/50">
                  <th className="text-left p-4 font-medium text-[#5c6b63]">Order</th><th className="text-left p-4 font-medium text-[#5c6b63]">Customer</th><th className="text-left p-4 font-medium text-[#5c6b63]">Status</th><th className="text-left p-4 font-medium text-[#5c6b63]">Total</th><th className="text-left p-4 font-medium text-[#5c6b63]">Date</th>
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
