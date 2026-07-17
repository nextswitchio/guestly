"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bell, RefreshCw, Send, Users, AlertCircle } from "lucide-react";

interface SentNotification {
  id: string;
  title: string;
  message: string;
  targetType: string;
  createdAt: string;
}

const AUDIENCE_OPTIONS = [
  { value: "all", label: "All Users" },
  { value: "attendees", label: "Attendees" },
  { value: "organizers", label: "Organizers" },
  { value: "vendors", label: "Vendors" },
  { value: "influencers", label: "Influencers" },
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<SentNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", targetType: "all" });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/announcements", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        const items = data?.data?.announcements ?? (Array.isArray(data) ? data : []);
        setNotifications(
          items.map((a: any) => ({
            id: a.id,
            title: a.title,
            message: a.content || a.message || "",
            targetType: a.target_type || a.targetType || "all",
            createdAt: a.created_at || a.createdAt || a.sentAt || new Date().toISOString(),
          }))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async () => {
    if (!form.title || !form.message) return;
    setSending(true);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          content: form.message,
          targetType: form.targetType,
          priority: "medium",
        }),
        credentials: "include",
      });
      if (res.ok) {
        setForm({ title: "", message: "", targetType: "all" });
        setShowForm(false);
        fetchNotifications();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const targetLabel = (t: string) => AUDIENCE_OPTIONS.find((o) => o.value === t)?.label || "All Users";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Notifications</h1>
          <p className="text-gray-500 mt-1">Send and manage platform notifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchNotifications}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            <Bell className="w-4 h-4 mr-2" />
            Send Notification
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="font-semibold text-dark mb-4">Compose Notification</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Title</label>
              <input
                type="text"
                placeholder="Notification title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-lime/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Message</label>
              <textarea
                placeholder="Notification message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-lime/40 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Target Audience</label>
              <select
                value={form.targetType}
                onChange={(e) => setForm({ ...form, targetType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-lime/40"
              >
                {AUDIENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={sendNotification} disabled={sending}>
                <Send className="w-4 h-4 mr-2" />
                {sending ? "Sending..." : "Send"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="font-semibold text-dark mb-4">Sent Notifications ({notifications.length})</h3>
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-dark mb-1">No notifications sent</h4>
            <p className="text-sm text-gray-500">Notifications you send will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-start justify-between p-4 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime/10">
                    <Bell className="h-5 w-5 text-lime" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-dark">{n.title}</h4>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                        {targetLabel(n.targetType)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
