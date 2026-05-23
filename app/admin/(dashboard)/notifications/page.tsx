"use client";
import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/Input";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  sentAt: string;
  recipients: number;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newNotification, setNewNotification] = useState({ title: "", message: "", type: "info" as const });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/announcements");
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
        setNotifications(items.map((a: any) => ({ id: a.id, title: a.title, message: a.content, type: "info", sentAt: a.created_at, recipients: 0 })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sendNotification = async () => {
    if (!newNotification.title || !newNotification.message) return;
    try {
      await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newNotification.title, content: newNotification.message, status: "published" }),
      });
      setNewNotification({ title: "", message: "", type: "info" });
      setShowForm(false);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notification Management</h1>
          <p className="text-sm text-slate-500">Send platform notifications and manage notification history</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Icon name="bell" size={16} />
          Send Notification
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <div className="space-y-4">
            <Input placeholder="Title" value={newNotification.title} onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })} />
            <textarea
              placeholder="Message"
              value={newNotification.message}
              onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
              className="w-full p-3 border border-neutral-200 rounded-lg bg-white text-slate-900 resize-none"
              rows={4}
            />
            <Button onClick={sendNotification}>Send</Button>
          </div>
        </Card>
      )}

      <Card className="p-6">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="bell" size={48} className="mx-auto text-slate-500 mb-4" />
            <p className="text-slate-500">No notifications sent</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{n.title}</p>
                    <p className="text-sm text-slate-500 mt-1">{n.message}</p>
                    <p className="text-xs text-slate-500 mt-2">{new Date(n.sentAt).toLocaleString()}</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-lime-100 text-lime-800">{n.recipients} recipients</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
