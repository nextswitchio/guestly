"use client";

import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/Icon";
import type { GroupNotification } from "@/lib/store";

interface GroupNotificationBellProps {
  groupWalletId?: string; // Optional: filter by specific group wallet
}

export default function GroupNotificationBell({ groupWalletId }: GroupNotificationBellProps) {
  const [notifications, setNotifications] = useState<GroupNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [groupWalletId]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/wallet/groups/notifications");
      const data = await res.json();
      
      if (data.success) {
        let notifs = data.data.notifications;
        
        // Filter by group wallet if specified
        if (groupWalletId) {
          notifs = notifs.filter((n: GroupNotification) => n.groupWalletId === groupWalletId);
        }
        
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n: GroupNotification) => !n.read).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/wallet/groups/notifications/${notificationId}`, {
        method: "PATCH",
      });
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await fetch("/api/wallet/groups/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupWalletId }),
      });
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: GroupNotification["type"]) => {
    switch (type) {
      case "contribution":
        return "money";
      case "reminder":
        return "clock";
      case "milestone":
        return "target";
      case "goal_reached":
        return "party";
      default:
        return "megaphone";
    }
  };

  const getRelativeTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg hover:bg-neutral-50 transition-colors"
        aria-label="Notifications"
      >
        <svg
          className="w-6 h-6 text-neutral-900"
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
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-neutral-200 z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <h3 className="font-semibold text-neutral-900">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-sm text-neutral-500">
                  ({unreadCount} unread)
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={loading}
                className="text-sm text-lime hover:text-lime-hover font-medium disabled:opacity-50"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Icon name="bell" size={48} className="text-neutral-400 mx-auto mb-2" />
                <p className="text-neutral-500 text-sm">
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-neutral-50 transition-colors cursor-pointer ${
                      !notification.read ? "bg-lime/5" : ""
                    }`}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <Icon name={getNotificationIcon(notification.type) as any} size={24} className="text-lime" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-neutral-900 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        {/* Metadata */}
                        {notification.metadata && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {notification.metadata.progress !== undefined && (
                                <span className="text-xs px-2 py-1 bg-neutral-50 rounded-full text-neutral-500">
                                {notification.metadata.progress}% complete
                              </span>
                            )}
                            {notification.metadata.amount !== undefined && (
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                ${notification.metadata.amount.toFixed(2)}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Timestamp */}
                        <p className="text-xs text-neutral-500 mt-2">
                          {getRelativeTime(notification.createdAt)}
                        </p>
                      </div>

                      {/* Unread Indicator */}
                      {!notification.read && (
                        <div className="w-2 h-2 bg-lime rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
