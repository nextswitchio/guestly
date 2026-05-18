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
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: `+${stats.newUsersThisMonth} this month`,
      icon: "users",
      variant: "blue" as const,
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      change: `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total`,
      icon: "user-check",
      variant: "green" as const,
    },
    {
      title: "Organizers",
      value: (stats.usersByRole.organizer || 0).toLocaleString(),
      change: `${Math.round(((stats.usersByRole.organizer || 0) / stats.totalUsers) * 100)}% of users`,
      icon: "calendar",
      variant: "purple" as const,
    },
    {
      title: "Profile Completion",
      value: `${stats.averageProfileCompleteness}%`,
      change: "Average across all users",
      icon: "user",
      variant: "orange" as const,
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
          <Icon name={icon as any} size={24} />
        </div>
        <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider">
          Live
        </span>
      </div>
      <div>
        <h3 className="text-sm font-medium text-[var(--foreground-muted)]">
          {title}
        </h3>
        <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
          {value}
        </p>
        <p className="text-xs font-medium text-[var(--foreground-muted)] mt-2">
          {change}
        </p>
      </div>
    </Card>
  );
}