"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Trash2, Users, Phone, Mail, X, Loader2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tags: string[];
  total_orders: number;
  total_spent: number;
  sentiment?: string;
  last_message_at?: string;
  created_at: string;
}

const SENTIMENT_COLORS: Record<string, string> = {
  positive: "bg-green-100 text-green-700",
  neutral: "bg-gray-100 text-gray-600",
  negative: "bg-red-100 text-red-700",
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isDemo, setIsDemo] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    tags: "",
    notes: "",
  });

  const fetchContacts = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contacts?search=${encodeURIComponent(q)}`);
      const data = await res.json();
      setContacts(data.contacts ?? []);
      setIsDemo(!!data.demo);
    } catch {
      setError("Failed to load contacts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    const timer = setTimeout(() => fetchContacts(search), 350);
    return () => clearTimeout(timer);
  }, [search, fetchContacts]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || undefined,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
          notes: form.notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to add contact");
      } else {
        setContacts((prev) => [data.contact, ...prev]);
        setShowAdd(false);
        setForm({ name: "", phone: "", email: "", tags: "", notes: "" });
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete contact "${name}"? This cannot be undone.`)) return;
    try {
      await fetch("/api/contacts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Failed to delete contact.");
    }
  }

  return (
    <>
      <DashboardHeader
        title="Contacts"
        subtitle={`${contacts.length} customer${contacts.length !== 1 ? "s" : ""}${isDemo ? " (Demo — connect Supabase to persist data)" : ""}`}
      />

      <div className="p-6 space-y-4">
        {isDemo && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Running in demo mode. Configure <strong>NEXT_PUBLIC_SUPABASE_URL</strong> and <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> to enable persistent storage.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or phone..."
              className="pl-9"
            />
          </div>
          <Button onClick={() => setShowAdd(true)} className="shrink-0">
            <Plus className="h-4 w-4 mr-1" /> Add Contact
          </Button>
        </div>

        {showAdd && (
          <Card className="border-green-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Add New Contact
                </h3>
                <button onClick={() => setShowAdd(false)}>
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              {error && (
                <div className="mb-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Full Name *
                  </label>
                  <Input
                    required
                    placeholder="Ahmed Khan"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      required
                      placeholder="+923001234567"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="ahmed@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Tags (comma separated)
                  </label>
                  <Input
                    placeholder="VIP, Wholesale, Lead"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Notes
                  </label>
                  <Input
                    placeholder="Any notes about this customer..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2 flex gap-3 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {saving ? "Adding..." : "Add Contact"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0 overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-gray-400">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading contacts...
              </div>
            ) : contacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Users className="h-12 w-12 mb-3 opacity-30" />
                <p className="font-medium">{search ? "No contacts found" : "No contacts yet"}</p>
                <p className="text-sm mt-1">{search ? "Try a different search term" : "Add your first contact to get started"}</p>
                {!search && (
                  <Button className="mt-4" onClick={() => setShowAdd(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Add Contact
                  </Button>
                )}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left p-4 font-medium text-gray-500">Name</th>
                    <th className="text-left p-4 font-medium text-gray-500">Phone</th>
                    <th className="text-left p-4 font-medium text-gray-500">Tags</th>
                    <th className="text-left p-4 font-medium text-gray-500">Orders</th>
                    <th className="text-left p-4 font-medium text-gray-500">Sentiment</th>
                    <th className="text-left p-4 font-medium text-gray-500">Last Active</th>
                    <th className="text-left p-4 font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{c.name}</td>
                      <td className="p-4 text-gray-600 font-mono text-xs">{c.phone}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {c.tags?.length > 0
                            ? c.tags.map((tag) => (
                                <span key={tag} className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 font-medium">
                                  {tag}
                                </span>
                              ))
                            : <span className="text-gray-300">—</span>}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{c.total_orders ?? 0}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${SENTIMENT_COLORS[c.sentiment ?? "neutral"] ?? SENTIMENT_COLORS.neutral}`}>
                          {c.sentiment ?? "neutral"}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 text-xs">
                        {c.last_message_at ? formatRelativeTime(c.last_message_at) : "Never"}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                          title="Delete contact"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
