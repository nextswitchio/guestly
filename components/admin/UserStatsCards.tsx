"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  usersByRole: Record<string, number>;
  usersByStatus: Record<string, number>;
  newUsersThisMonth: number;
  averageProfileCompleteness: number;
}

interface UserStatsCardsProps {
  stats: UserStats;
}

export function UserStatsCards({ stats }: UserStatsCardsProps) {
  const total = stats?.totalUsers || 1; // avoid division by zero
  const statCards = [
    {
      title: "Total Users",
      value: (stats?.totalUsers ?? 0).toLocaleString(),
      change: `+${stats?.newUsersThisMonth ?? 0} this month`,
      icon: "users",
      variant: "blue" as const,
    },
    {
      title: "Active Users",
      value: (stats?.activeUsers ?? 0).toLocaleString(),
      change: `${Math.round(((stats?.activeUsers ?? 0) / total) * 100)}% of total`,
      icon: "user-check",
      variant: "green" as const,
    },
    {
      title: "Organizers",
      value: ((stats?.usersByRole?.organizer || 0) + (stats?.usersByRole?.organiser || 0)).toLocaleString(),
      change: `${Math.round(((stats?.usersByRole?.organizer || 0) + (stats?.usersByRole?.organiser || 0)) / total * 100)}% of users`,
      icon: "calendar",
      variant: "purple" as const,
    },
    {
      title: "Affiliates",
      value: (stats?.usersByRole?.affiliate || 0).toLocaleString(),
      change: `${Math.round(((stats?.usersByRole?.affiliate || 0) / total) * 100)}% of users`,
      icon: "megaphone",
      variant: "orange" as const,
    },
    {
      title: "Influencers",
      value: (stats?.usersByRole?.influencer || 0).toLocaleString(),
      change: `${Math.round(((stats?.usersByRole?.influencer || 0) / total) * 100)}% of users`,
      icon: "star",
      variant: "pink" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
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
  icon: string;
  variant: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
}) {
  const colors: Record<string, string> = {
    blue: 'bg-primary-50 text-primary-600',
    green: 'bg-success-50 text-success-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    pink: 'bg-pink-50 text-pink-600',
  };

  return (
    <Card className="p-6 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-xl ${colors[variant]}`}>
          <Icon name={icon as any} size={24} />
        </div>
        <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider">
          Live
        </span>
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-500">
          {title}
        </h3>
        <p className="text-2xl font-bold text-slate-900 mt-1">
          {value}
        </p>
        <p className="text-xs font-medium text-slate-500 mt-2">
          {change}
        </p>
      </div>
    </Card>
  );
}