"use client";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <>
      <DashboardHeader title="Settings" subtitle="Workspace and integrations" />
      <div className="p-6 max-w-2xl space-y-6">
        <Card><CardHeader><CardTitle>Business Profile</CardTitle></CardHeader><CardContent className="space-y-4">
          <Input placeholder="Business name" defaultValue="BOTFILTA Store" />
          <Input placeholder="Business description" defaultValue="Premium fashion and lifestyle products" />
          <Button>Save</Button>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>WhatsApp Cloud API</CardTitle></CardHeader><CardContent className="space-y-4">
          <Input placeholder="Phone Number ID" />
          <Input placeholder="Access Token" type="password" />
          <Input placeholder="Webhook Verify Token" />
          <Button>Connect WhatsApp</Button>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Google Gemini AI</CardTitle></CardHeader><CardContent className="space-y-4">
          <Input placeholder="GEMINI_API_KEY" type="password" />
          <p className="text-xs text-[#5c6b63]">Model: gemini-2.5-flash</p>
          <Button>Save AI Config</Button>
        </CardContent></Card>
      </div>
    </>
  );
}
