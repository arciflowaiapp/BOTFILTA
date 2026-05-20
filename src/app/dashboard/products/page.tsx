"use client";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/lib/data/mock";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function Page() {
  const rows = mockProducts.map((p) => [p.name, p.category, formatCurrency(p.price), p.stock, p.is_active ? "Active" : "Inactive"]);
  return (
    <>
      <DashboardHeader title="Products" subtitle="Product catalog for AI-powered replies" />
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <Button><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </div>
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8eeeb] bg-[#f0faf4]/50">
                  <th className="text-left p-4 font-medium text-[#5c6b63]">Product</th><th className="text-left p-4 font-medium text-[#5c6b63]">Category</th><th className="text-left p-4 font-medium text-[#5c6b63]">Price</th><th className="text-left p-4 font-medium text-[#5c6b63]">Stock</th><th className="text-left p-4 font-medium text-[#5c6b63]">Status</th>
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
