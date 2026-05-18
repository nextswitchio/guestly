"use client";
import { ArrowRight, Banknote, Bell, CalendarDays, Mail, Star } from 'lucide-react';
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

type Notification = {
  id: string;
  userId: string;
  type: "invitation" | "payment" | "event_update" | "review" | "system";
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: number;
};

export default function VendorNotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");

  React.useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(notificationId: string) {
    try {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  async function markAllAsRead() {
    try {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
      await Promise.all(
        unreadIds.map((id) =>
          fetch(`/api/notifications/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ read: true }),
          })
        )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }

  async function deleteNotification(notificationId: string) {
    try {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  function getNotificationIcon(type: Notification["type"]) {
    switch (type) {
      case "invitation":
        return <Mail className="h-4 w-4" />;
      case "payment":
        return <Banknote className="h-4 w-4" />;
      case "event_update":
        return <CalendarDays className="h-4 w-4" />;
      case "review":
        return <Star className="h-4 w-4" />;
      case "system":
        return <Bell className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  }

  function getNotificationColor(type: Notification["type"]) {
    switch (type) {
      case "invitation":
        return "primary";
      case "payment":
        return "success";
      case "event_update":
        return "navy";
      case "review":
        return "warning";
      case "system":
        return "neutral";
      default:
        return "neutral";
    }
  }

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Notifications</h1>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            Stay updated on invitations, payments, and event updates
          </p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-6"
            >
              <div className="mb-3 h-5 w-3/4 rounded bg-[var(--surface-hover)]"></div>
              <div className="mb-2 h-4 w-full rounded bg-[var(--surface-hover)]"></div>
              <div className="h-4 w-1/2 rounded bg-[var(--surface-hover)]"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">Notifications</h1>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Stay updated on invitations, payments, and event updates
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-4 border-b border-[var(--surface-border)]">
        <button
          onClick={() => setFilter("all")}
          className={`relative pb-3 px-1 font-medium transition-colors ${
            filter === "all"
              ? "text-primary-600"
              : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          }`}
        >
          All
          {filter === "all" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
          )}
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`relative pb-3 px-1 font-medium transition-colors ${
            filter === "unread"
              ? "text-primary-600"
              : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
              {unreadCount}
            </span>
          )}
          {filter === "unread" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
          )}
        </button>
      </div>

      {/* Notifications list */}
      {filteredNotifications.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mb-4 text-6xl">
            {filter === "unread" ? "✅" : "📬"}
          </div>
          <h3 className="mb-2 text-xl font-semibold text-[var(--foreground)]">
            {filter === "unread" ? "All caught up!" : "No notifications yet"}
          </h3>
          <p className="text-sm text-[var(--foreground-muted)]">
            {filter === "unread"
              ? "You've read all your notifications"
              : "We'll notify you about invitations, payments, and updates"}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const color = getNotificationColor(notification.type);
            const icon = getNotificationIcon(notification.type);

            return (
              <Card
                key={notification.id}
                className={`p-5 transition-all hover:shadow-md ${
                  !notification.read
                    ? "border-l-4 border-l-primary-500 bg-primary-50/30"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-${color}-100 text-xl`}
                  >
                    {icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-1 flex items-start justify-between gap-4">
                      <h3
                        className={`font-semibold ${
                          !notification.read
                            ? "text-[var(--foreground)]"
                            : "text-[var(--foreground-muted)]"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary-600"></span>
                      )}
                    </div>
                    <p className="mb-3 text-sm text-[var(--foreground-muted)]">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[var(--foreground-subtle)]">
                        {formatDate(notification.createdAt)}
                      </span>
                      {notification.actionUrl && (
                        <Link
                          href={notification.actionUrl}
                          className="text-xs font-medium text-primary-600 hover:text-primary-700"
                          onClick={() => markAsRead(notification.id)}
                        >
                          View details<ArrowRight className="h-4 w-4 inline" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-primary-600"
                        title="Mark as read"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-danger-50 hover:text-danger-600"
                      title="Delete"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
