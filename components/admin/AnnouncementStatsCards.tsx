"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";

type AnnouncementStats = {
  totalAnnouncements: number;
  activeAnnouncements: number;
  scheduledAnnouncements: number;
  expiredAnnouncements: number;
  totalViews: number;
  totalDismissals: number;
};

interface AnnouncementStatsCardsProps {
  stats: AnnouncementStats;
}

export function AnnouncementStatsCards({ stats }: AnnouncementStatsCardsProps) {
  const dismissalRate = (stats?.totalViews ?? 0) > 0 ? ((stats.totalDismissals ?? 0) / stats.totalViews * 100) : 0;
  const engagementRate = (stats?.totalViews ?? 0) > 0 ? (((stats.totalViews ?? 0) - (stats.totalDismissals ?? 0)) / stats.totalViews * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Announcements"
        value={(stats?.totalAnnouncements ?? 0).toLocaleString()}
        change={`${stats?.activeAnnouncements ?? 0} active`}
        icon="megaphone"
        variant="blue"
      />
      <StatCard
        title="Active Announcements"
        value={(stats?.activeAnnouncements ?? 0).toLocaleString()}
        change={`${stats?.scheduledAnnouncements ?? 0} scheduled`}
        icon="calendar"
        variant="green"
      />
      <StatCard
        title="Total Views"
        value={(stats?.totalViews ?? 0).toLocaleString()}
        change={`${engagementRate.toFixed(1)}% engagement`}
        icon="eye"
        variant="purple"
      />
      <StatCard
        title="Dismissal Rate"
        value={`${dismissalRate.toFixed(1)}%`}
        change={`${stats?.totalDismissals ?? 0} dismissed`}
        icon="x-circle"
        variant="orange"
      />
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  change, 
  icon, 
  variant 
}: { 
  title: string; 
  value: string; 
  change: string; 
  icon: any;
  variant: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colors = {
    blue: 'bg-primary-50 text-primary-600',
    green: 'bg-success-50 text-success-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <Card className="p-6 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-xl ${colors[variant]}`}>
          <Icon name={icon} size={24} />
        </div>
        <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider">Live</span>
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        <p className="text-xs font-medium text-slate-500 mt-2">
          {change}
        </p>
      </div>
    </Card>
  );
}