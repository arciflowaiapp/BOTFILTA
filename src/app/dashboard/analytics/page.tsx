"use client";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { chartData, mockAnalytics } from "@/lib/data/mock";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#25d366", "#128c41", "#5c6b63"];

export default function AnalyticsPage() {
  return (
    <>
      <DashboardHeader title="Analytics" subtitle="Business insights and performance" />
      <div className="p-6 grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Revenue</CardTitle></CardHeader><CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.revenue}><CartesianGrid strokeDasharray="3 3" stroke="#e8eeeb" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="revenue" fill="#25d366" radius={[8,8,0,0]} /></BarChart>
          </ResponsiveContainer>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>AI vs Human</CardTitle></CardHeader><CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart><Pie data={chartData.aiPerformance} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{chartData.aiPerformance.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </CardContent></Card>
        <Card className="lg:col-span-2"><CardContent className="p-6 grid grid-cols-3 gap-4 text-center">
          <div><p className="text-2xl font-bold">{mockAnalytics.aiResolutionRate}%</p><p className="text-sm text-[#5c6b63]">AI Resolution</p></div>
          <div><p className="text-2xl font-bold">{formatCurrency(mockAnalytics.revenue)}</p><p className="text-sm text-[#5c6b63]">Revenue</p></div>
          <div><p className="text-2xl font-bold">{mockAnalytics.avgResponseTime}m</p><p className="text-sm text-[#5c6b63]">Avg Response</p></div>
        </CardContent></Card>
      </div>
    </>
  );
}
