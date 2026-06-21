import { Banknote, BarChart3, CheckCircle, Clipboard, File, FileEdit, Hand, Handshake, MapPin, RefreshCw, Ticket, Users } from 'lucide-react';
"use client";

import { useState, useEffect } from "react";

interface ActivityLog {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: number;
}

interface ActivityFeedProps {
  eventId: string;
  limit?: number;
}

export function ActivityFeed({ eventId, limit = 50 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [eventId, limit]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/activity?limit=${limit}`);
      const data = await res.json();
      if (data.success) {
        setActivities(data.data);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "event_created":
      case "event_updated":
        return <FileEdit className="h-4 w-4" />;
      case "ticket_created":
      case "ticket_updated":
        return <Ticket className="h-4 w-4" />;
      case "budget_item_added":
      case "budget_item_updated":
        return <Banknote className="h-4 w-4" />;
      case "task_created":
        return <Clipboard className="h-4 w-4" />;
      case "task_completed":
        return <CheckCircle className="h-4 w-4" />;
      case "document_uploaded":
        return <File className="h-4 w-4" />;
      case "vendor_invited":
        return <Handshake className="h-4 w-4" />;
      case "team_member_added":
        return <Users className="h-4 w-4" />;
      case "team_member_removed":
        return <Hand className="h-4 w-4" />;
      case "team_member_role_changed":
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getActivityColor = (action: string) => {
    if (action.includes("team_member")) {
      return "text-primary-600 dark:text-primary-400";
    }
    if (action.includes("budget")) {
      return "text-success-600 dark:text-success-400";
    }
    if (action.includes("task")) {
      return "text-warning-600 dark:text-warning-400";
    }
    return "text-foreground";
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse flex gap-3">
            <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4"><BarChart3 className="h-8 w-8 mx-auto" /></div>
        <p className="text-foreground-muted">No activity yet</p>
        <p className="text-sm text-foreground-subtle mt-1">
          Team actions will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex gap-3 p-3 rounded-lg hover:bg-surface-hover transition-colors"
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-surface-card border border-surface-border rounded-full flex items-center justify-center text-xl">
              {getActivityIcon(activity.action)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground">
              <span className="font-medium">{activity.userName}</span>{" "}
              <span className={getActivityColor(activity.action)}>
                {activity.details}
              </span>
            </p>
            <p className="text-xs text-foreground-muted mt-1">
              {formatTimestamp(activity.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}


export default ActivityFeed;
