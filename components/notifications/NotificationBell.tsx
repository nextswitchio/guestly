"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Notification {
  id: string;
  userId: string;
  type: 'follow_event' | 'event_update' | 'event_reminder' | 'follow_user';
  title: string;
  message: string;
  eventId?: string;
  fromUserId?: string;
  read: boolean;
  createdAt: number;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(data.data);
          setUnreadCount(data.data.filter((n: Notification) => !n.read).length);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PUT",
      });
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.eventId) {
      return `/events/${notification.eventId}`;
    }
    if (notification.fromUserId) {
      return `/attendee/profile?userId=${notification.fromUserId}`;
    }
    return "#";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative h-11 w-11 flex items-center justify-center rounded-lg hover:bg-surface-hover transition-colors"
        aria-label="Notifications"
      >
        <svg
          className="w-6 h-6 text-foreground"
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
          <span className="absolute top-1 right-1 bg-danger-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-surface-card border border-surface-border rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-surface-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="p-8 text-center text-foreground-muted">
                <svg
                  className="w-12 h-12 mx-auto mb-2 opacity-50"
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
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-surface-border">
                {notifications.slice(0, 10).map((notification) => (
                  <Link
                    key={notification.id}
                    href={getNotificationLink(notification)}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id);
                      }
                      setShowDropdown(false);
                    }}
                    className={`block p-4 hover:bg-surface-hover transition-colors ${
                      !notification.read ? "bg-primary-50 dark:bg-primary-900/10" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {notification.type === 'follow_event' && (
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                          </div>
                        )}
                        {notification.type === 'follow_user' && (
                          <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                            <svg className="w-4 h-4 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {notification.title}
                        </p>
                        <p className="text-sm text-foreground-muted mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-foreground-subtle mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-500" />
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {notifications.length > 10 && (
              <div className="p-3 border-t border-surface-border text-center">
                <Link
                  href="/attendee/notifications"
                  className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
