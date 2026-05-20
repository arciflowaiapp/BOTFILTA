"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle, Eye, EyeOff, Bot, MessageCircle, Settings } from "lucide-react";

interface WorkspaceSettings {
  whatsapp_access_token: string;
  whatsapp_phone_number_id: string;
  whatsapp_verify_token: string;
  gemini_api_key: string;
  bot_enabled: boolean;
  business_name: string;
  business_description: string;
  ai_tone: "professional" | "friendly" | "casual";
  ai_language: "en" | "ur" | "both";
}

const DEFAULT: WorkspaceSettings = {
  whatsapp_access_token: "",
  whatsapp_phone_number_id: "",
  whatsapp_verify_token: "botfilta_verify_2024",
  gemini_api_key: "",
  bot_enabled: true,
  business_name: "BOTFILTA Store",
  business_description: "Premium fashion and lifestyle products with fast delivery across Pakistan.",
  ai_tone: "friendly",
  ai_language: "both",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<WorkspaceSettings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [showGemini, setShowGemini] = useState(false);
  const [activeSection, setActiveSection] = useState<"business" | "whatsapp" | "ai">("business");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.settings) {
          setSettings({
            ...DEFAULT,
            ...data.settings,
            whatsapp_access_token: data.settings.whatsapp_access_token ?? "",
            whatsapp_phone_number_id: data.settings.whatsapp_phone_number_id ?? "",
            whatsapp_verify_token: data.settings.whatsapp_verify_token ?? "botfilta_verify_2024",
            gemini_api_key: data.settings.gemini_api_key ?? "",
          });
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save settings");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function update(key: keyof WorkspaceSettings, value: string | boolean) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) {
    return (
      <>
        <DashboardHeader title="Settings" subtitle="Workspace and integrations" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title="Settings" subtitle="Manage your workspace, API keys, and AI configuration" />

      <div className="p-6 max-w-3xl space-y-6">
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle className="h-4 w-4 shrink-0" />
            Settings saved successfully!
          </div>
        )}

        <div className="flex gap-2 border-b border-gray-100 pb-1">
          {(["business", "whatsapp", "ai"] as const).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors capitalize ${
                activeSection === section
                  ? "bg-white border border-b-white border-gray-100 text-green-700 -mb-px"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {section === "business" && <Settings className="h-4 w-4 inline mr-1.5" />}
              {section === "whatsapp" && <MessageCircle className="h-4 w-4 inline mr-1.5" />}
              {section === "ai" && <Bot className="h-4 w-4 inline mr-1.5" />}
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {activeSection === "business" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-500" />
                Business Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Business Name</label>
                <Input
                  value={settings.business_name}
                  onChange={(e) => update("business_name", e.target.value)}
                  placeholder="Your Business Name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Business Description</label>
                <textarea
                  value={settings.business_description}
                  onChange={(e) => update("business_description", e.target.value)}
                  placeholder="Describe your business for the AI..."
                  className="w-full min-h-[80px] rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
                />
                <p className="text-xs text-gray-400 mt-1">This description helps the AI give better responses about your business.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === "whatsapp" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-500" />
                WhatsApp Cloud API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                <strong>Setup Instructions:</strong> Get these credentials from your{" "}
                <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer" className="underline">
                  Meta Developer App
                </a>{" "}
                → WhatsApp → API Setup.
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone Number ID</label>
                <Input
                  value={settings.whatsapp_phone_number_id}
                  onChange={(e) => update("whatsapp_phone_number_id", e.target.value)}
                  placeholder="1234567890123456"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Access Token</label>
                <div className="relative">
                  <Input
                    type={showToken ? "text" : "password"}
                    value={settings.whatsapp_access_token}
                    onChange={(e) => update("whatsapp_access_token", e.target.value)}
                    placeholder="EAAxxxxx..."
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Webhook Verify Token</label>
                <Input
                  value={settings.whatsapp_verify_token}
                  onChange={(e) => update("whatsapp_verify_token", e.target.value)}
                  placeholder="botfilta_verify_2024"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Set this same token in your Meta App webhook configuration. Webhook URL:{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    {typeof window !== "undefined" ? window.location.origin : "https://your-app.com"}/api/whatsapp/webhook
                  </code>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === "ai" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-500" />
                AI Configuration
                <Badge variant="outline" className="ml-auto text-xs">Gemini 2.5 Flash</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                <div>
                  <p className="font-medium text-gray-900">Auto-Reply Bot</p>
                  <p className="text-sm text-gray-500">Automatically reply to incoming WhatsApp messages using AI</p>
                </div>
                <Switch
                  checked={settings.bot_enabled}
                  onCheckedChange={(checked) => update("bot_enabled", checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Gemini API Key</label>
                <div className="relative">
                  <Input
                    type={showGemini ? "text" : "password"}
                    value={settings.gemini_api_key}
                    onChange={(e) => update("gemini_api_key", e.target.value)}
                    placeholder="AIzaSy..."
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGemini(!showGemini)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showGemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Get your key from{" "}
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">
                    Google AI Studio
                  </a>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">AI Tone</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["professional", "friendly", "casual"] as const).map((tone) => (
                    <button
                      key={tone}
                      onClick={() => update("ai_tone", tone)}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                        settings.ai_tone === tone
                          ? "border-green-400 bg-green-50 text-green-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Language</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["en", "ur", "both"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => update("ai_language", lang)}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                        settings.ai_language === lang
                          ? "border-green-400 bg-green-50 text-green-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {lang === "en" ? "English" : lang === "ur" ? "اردو" : "Both"}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="min-w-[120px]">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </>
  );
}
