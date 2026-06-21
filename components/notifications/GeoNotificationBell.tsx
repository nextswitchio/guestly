"use client";

import React from "react";
import Link from "next/link";
import { LocationIcon } from "@/utils/icons";
import { Bell } from "lucide-react";

interface GeoNotification {
  id: string;
  eventId: string;
  title: string;
  message: string;
  distance: number;
  sent: boolean;
  createdAt: number;
}

export default function GeoNotificationBell() {
  const [notifications, setNotifications] = React.useState<GeoNotification[]>([]);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  async function fetchNotifications() {
    try {
      const response = await fetch("/api/notifications/geo?unsentOnly=true");
      const data = await response.json();

      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsSent(notificationId: string) {
    try {
      await fetch(`/api/notifications/geo/${notificationId}`, {
        method: "PATCH",
      });
      // Remove from list
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Error marking notification as sent:", error);
    }
  }

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
        aria-label="Notifications"
      >
        <svg
          className="w-6 h-6 text-[var(--foreground)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-80 bg-[var(--surface-card)] rounded-xl shadow-lg border border-[var(--surface-border)] z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-[var(--surface-border)]">
              <h3 className="font-semibold text-[var(--foreground)]">
                Nearby Events
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                Events happening near your location
              </p>
            </div>

            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-[var(--surface-hover)] rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-[var(--surface-hover)] rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mb-2"><Bell className="w-10 h-10 mx-auto text-[var(--foreground)]" /></div>
                <p className="text-sm text-[var(--foreground-muted)]">
                  No new notifications
                </p>
                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                  We'll notify you when events happen near you
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--surface-border)]">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <Link
                      href={`/events/${notification.eventId}`}
                      onClick={() => {
                        markAsSent(notification.id);
                        setShowDropdown(false);
                      }}
                      className="block"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-[var(--foreground)]">
                            {notification.title}
                          </p>
                          <p className="text-xs text-[var(--foreground-muted)] mt-1">
                            {notification.message}
                          </p>
                            <p className="text-xs text-primary-600 mt-1 flex items-center gap-1">
                              <LocationIcon className="w-3 h-3 text-primary-600" />
                              <span>{notification.distance.toFixed(1)}km away</span>
                            </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            markAsSent(notification.id);
                          }}
                          className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                          aria-label="Dismiss"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 border-t border-[var(--surface-border)]">
              <Link
                href="/attendee/notifications"
                className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                onClick={() => setShowDropdown(false)}
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
