'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { Campaign } from '@/lib/marketing';

interface CampaignCalendarProps {
  campaigns: Campaign[];
  onUpdate?: () => void;
}

export default function CampaignCalendar({ campaigns, onUpdate }: CampaignCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getCampaignsForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return campaigns.filter((campaign) => {
      if (campaign.scheduledAt) {
        return new Date(campaign.scheduledAt).toDateString() === dateStr;
      }
      if (campaign.startedAt) {
        return new Date(campaign.startedAt).toDateString() === dateStr;
      }
      return false;
    });
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <Card className="p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <Icon name="chevron-left" className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <Icon name="chevron-right" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const date = new Date(year, month, day);
          const dayCampaigns = getCampaignsForDate(date);
          const hasEvents = dayCampaigns.length > 0;

          return (
            <div
              key={day}
              className={`aspect-square border rounded-lg p-2 ${
                isToday(day)
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              } ${hasEvents ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}`}
            >
              <div className="text-sm font-medium mb-1">{day}</div>
              {hasEvents && (
                <div className="space-y-1">
                  {dayCampaigns.slice(0, 2).map((campaign) => (
                    <div
                      key={campaign.id}
                      className="text-xs px-1 py-0.5 rounded bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 truncate"
                      title={campaign.name}
                    >
                      {campaign.name}
                    </div>
                  ))}
                  {dayCampaigns.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayCampaigns.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary-100 dark:bg-primary-900/40" />
            <span className="text-gray-600 dark:text-gray-400">Scheduled Campaign</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-primary-500" />
            <span className="text-gray-600 dark:text-gray-400">Today</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
