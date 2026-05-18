import { Banknote, Bell, Clock, Target } from 'lucide-react';
"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";

interface Reminder {
  id: string;
  type: 'task_deadline' | 'milestone_alert' | 'budget_review';
  title: string;
  message: string;
  eventId?: string;
  read: boolean;
  createdAt: number;
}

interface DeadlineRemindersProps {
  eventId: string;
}

export default function DeadlineReminders({ eventId }: DeadlineRemindersProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchReminders = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/reminders/check`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.notifications) {
          setReminders(data.data.notifications);
          setLastChecked(new Date());
        }
      }
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  const checkReminders = async () => {
    setLoading(true);
    try {
      await fetchReminders();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchReminders();
    
    // Auto-check every 5 minutes
    const interval = setInterval(fetchReminders, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [eventId]);

  const getTypeIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'task_deadline':
        return <Clock className="h-4 w-4 inline-block" />;
      case 'milestone_alert':
        return <Target className="h-4 w-4 inline-block" />;
      case 'budget_review':
        return <Banknote className="h-4 w-4 inline-block" />;
      default:
        return <Bell className="h-4 w-4 inline-block" />;
    }
  };

  const getTypeColor = (type: Reminder['type']) => {
    switch (type) {
      case 'task_deadline':
        return 'bg-warning-50 text-warning-700 border-warning-200';
      case 'milestone_alert':
        return 'bg-primary-50 text-primary-700 border-primary-200';
      case 'budget_review':
        return 'bg-success-50 text-success-700 border-success-200';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  const getTypeLabel = (type: Reminder['type']) => {
    switch (type) {
      case 'task_deadline':
        return 'Task Deadline';
      case 'milestone_alert':
        return 'Milestone';
      case 'budget_review':
        return 'Budget Review';
      default:
        return 'Reminder';
    }
  };

  if (reminders.length === 0) {
    return null; // Don't show anything if no reminders
  }

  return (
    <Card className="mb-6">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl"><Bell className="h-4 w-4 inline-block" /></span>
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              Upcoming Deadlines
            </h3>
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-danger-500 rounded-full">
              {reminders.length}
            </span>
          </div>
          <button
            onClick={checkReminders}
            disabled={loading}
            className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Now'}
          </button>
        </div>

        <div className="space-y-2">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${getTypeColor(reminder.type)}`}
            >
              <span className="text-xl flex-shrink-0">{getTypeIcon(reminder.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    {getTypeLabel(reminder.type)}
                  </span>
                </div>
                <p className="text-sm font-medium text-[var(--foreground)] mb-0.5">
                  {reminder.title}
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {reminder.message}
                </p>
              </div>
            </div>
          ))}
        </div>

        {lastChecked && (
          <p className="text-xs text-[var(--foreground-muted)] mt-3 text-center">
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        )}
      </div>
    </Card>
  );
}
