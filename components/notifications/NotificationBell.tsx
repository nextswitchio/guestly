"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, MessageCircle, Handshake, CreditCard, UserPlus, Calendar, Megaphone, CheckCheck } from "lucide-react";

interface NotificationItem {
  id: string;
  user_id: string;
  notification_type: string;
  title: string;
  message: string;
  event_id: string | null;
  from_user_id: string | null;
  collaboration_id: string | null;
  is_read: boolean;
  created_at: string;
}

interface Props {
  className?: string;
}

export default function NotificationBell({ className = "" }: Props) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?page=1&page_size=10");
      if (res.ok) {
        const data = await res.json();
        const items = data.notifications || data.data || [];
        setNotifications(items);
        setUnreadCount(items.filter((n: NotificationItem) => !n.is_read).length);
      }
    } catch {
      // silent
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/community/notifications/${id}/read`, { method: "POST" });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // silent
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await fetch("/api/notifications?action=read-all", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const getNotificationLink = (n: NotificationItem) => {
    if (n.collaboration_id) return `/influencer/dashboard/collaborations?id=${n.collaboration_id}`;
    if (n.event_id) return `/events/${n.event_id}`;
    if (n.from_user_id) return `/organizers/${n.from_user_id}`;
    return "#";
  };

  const getIcon = (type: string) => {
    if (type.includes("marketplace")) return <MessageCircle className="w-4 h-4 text-violet-500" />;
    if (type.includes("collaboration")) return <Handshake className="w-4 h-4 text-blue-500" />;
    if (type.includes("deal")) return <CreditCard className="w-4 h-4 text-emerald-500" />;
    if (type.includes("follow")) return <UserPlus className="w-4 h-4 text-pink-500" />;
    if (type.includes("event")) return <Calendar className="w-4 h-4 text-amber-500" />;
    return <Megaphone className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => { setShowDropdown(!showDropdown); if (!showDropdown) fetchNotifications(); }}
        className="relative h-10 w-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-[420px] overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={loading}
                className="text-xs font-medium text-lime hover:text-lime/80 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                <p className="text-sm text-gray-400">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.slice(0, 10).map((n) => (
                  <Link
                    key={n.id}
                    href={getNotificationLink(n)}
                    onClick={() => {
                      if (!n.is_read) markAsRead(n.id);
                      setShowDropdown(false);
                    }}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      !n.is_read ? "bg-lime/5" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      {getIcon(n.notification_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(n.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {!n.is_read && (
                      <div className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-lime" />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/attendee/notifications"
            onClick={() => setShowDropdown(false)}
            className="block px-4 py-2.5 text-center text-sm font-medium text-gray-500 hover:text-gray-700 border-t border-gray-100 hover:bg-gray-50 transition-colors"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
