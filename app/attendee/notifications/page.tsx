"use client";

import React from "react";
import Link from "next/link";
import NotificationPreferences from "@/components/notifications/NotificationPreferences";
import Icon from "@/components/ui/Icon";

interface GeoNotification {
  id: string;
  eventId: string;
  title: string;
  message: string;
  distance: number;
  sent: boolean;
  sentAt?: number;
  createdAt: number;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<GeoNotification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"notifications" | "settings">("notifications");

  React.useEffect(() => {
    if (activeTab === "notifications") {
      fetchNotifications();
    }
  }, [activeTab]);

  async function fetchNotifications() {
    try {
      const response = await fetch("/api/notifications/geo");
      const data = await response.json();

      if (data.success) {
        setNotifications(data.data?.notifications ?? []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
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

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Notifications</h1>
        <p className="text-neutral-500 mt-2">
          Stay updated on events happening near you
        </p>
      </div>

      <div className="flex gap-4 border-b border-neutral-200 mb-6">
        <button
          onClick={() => setActiveTab("notifications")}
          className={`pb-3 px-1 font-medium transition-colors relative ${
            activeTab === "notifications"
              ? "text-primary-600"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Notifications
          {activeTab === "notifications" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`pb-3 px-1 font-medium transition-colors relative ${
            activeTab === "settings"
              ? "text-primary-600"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Settings
          {activeTab === "settings" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
          )}
        </button>
      </div>

      {activeTab === "notifications" ? (
        <div>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white rounded-xl p-6 border border-neutral-200"
                >
                  <div className="h-5 bg-neutral-100 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-neutral-100 rounded w-full mb-2" />
                  <div className="h-4 bg-neutral-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-neutral-200">
              <div className="mb-4">
                <Icon name="bell" className="w-14 h-14 mx-auto text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                No notifications yet
              </h3>
              <p className="text-neutral-500 mb-6">
                We'll notify you when events happen near your location
              </p>
              <Link
                href="/explore"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Explore Events
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={`/events/${notification.eventId}`}
                  className="block bg-white rounded-xl p-6 border border-neutral-200 hover:border-primary-600 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="map-pin" className="w-5 h-5 text-primary-600" />
                        <h3 className="font-semibold text-neutral-900">
                          {notification.title}
                        </h3>
                      </div>
                      <p className="text-neutral-500 mb-3">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-primary-600 font-medium">
                          {notification.distance.toFixed(1)}km away
                        </span>
                        <span className="text-neutral-500">
                          {formatDate(notification.createdAt)}
                        </span>
                        {notification.sent && (
                          <span className="text-emerald-600 flex items-center gap-1"><Icon name="check" className="w-4 h-4" />Viewed</span>
                        )}
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-neutral-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <NotificationPreferences userId="current-user" />
      )}
    </>
  );
}
