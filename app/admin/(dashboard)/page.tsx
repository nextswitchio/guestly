"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { BarChart, LineChart } from "@/components/charts";

export default function AdminDashboard() {
  const [stats, setStats] = React.useState({
    totalUsers: 12500,
    activeEvents: 450,
    totalRevenue: 2500000,
    commissionEarned: 125000,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Global Overview</h1>
        <p className="text-sm text-[var(--foreground-muted)]">Real-time platform performance and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers.toLocaleString()} 
          change="+12% from last month" 
          icon="users" 
          variant="blue"
        />
        <StatCard 
          title="Active Events" 
          value={stats.activeEvents.toLocaleString()} 
          change="+5% this week" 
          icon="calendar" 
          variant="green"
        />
        <StatCard 
          title="Total GMV" 
          value={`$${(stats.totalRevenue / 100).toLocaleString()}`} 
          change="+18% growth" 
          icon="wallet" 
          variant="purple"
        />
        <StatCard 
          title="Commission" 
          value={`$${(stats.commissionEarned / 100).toLocaleString()}`} 
          change="5% platform fee" 
          icon="trending-up" 
          variant="orange"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-[var(--foreground)]">Platform Growth</h3>
            <span className="text-xs font-medium text-success-600 bg-success-50 px-2 py-1 rounded-full">+24% YoY</span>
          </div>
          <div className="h-64">
             <LineChart 
              data={[
                { label: "Jan", value: 4500 },
                { label: "Feb", value: 5200 },
                { label: "Mar", value: 6100 },
                { label: "Apr", value: 5900 },
                { label: "May", value: 7200 },
                { label: "Jun", value: 8500 },
              ]}
              color="#4392F1"
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-[var(--foreground)]">Revenue by Category</h3>
            <span className="text-xs text-[var(--foreground-muted)]">Top: Music & Entertainment</span>
          </div>
          <div className="h-64">
            <BarChart 
              data={[
                { label: "Music", value: 850000 },
                { label: "Tech", value: 420000 },
                { label: "Art", value: 150000 },
                { label: "Food", value: 280000 },
              ]}
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-semibold text-[var(--foreground)]">Pending Approvals</h3>
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { name: "Lagos Jazz Festival", type: "Event", user: "Jazz Vibes Ltd", date: "2 mins ago" },
              { name: "Tech Solutions Pro", type: "Vendor", user: "John Doe", date: "15 mins ago" },
              { name: "Summit 2026", type: "Event", user: "Innovate Africa", date: "1 hour ago" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)]">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.type === 'Event' ? 'bg-primary-50 text-primary-600' : 'bg-success-50 text-success-600'}`}>
                    <Icon name={item.type === 'Event' ? 'calendar' : 'user'} size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">{item.name}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{item.type} • by {item.user}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg px-3 py-1.5 text-xs font-bold text-success-700 bg-success-50 hover:bg-success-100 transition-colors">Approve</button>
                  <button className="rounded-lg px-3 py-1.5 text-xs font-bold text-danger-700 bg-danger-50 hover:bg-danger-100 transition-colors">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-6 font-semibold text-[var(--foreground)]">Recent Activities</h3>
          <div className="space-y-6">
            {[
              { action: "Refund Processed", detail: "$50.00 to user_123", time: "5 mins ago", icon: "refresh-cw" },
              { action: "Payout Released", detail: "$1,200.00 to MusicHub", time: "12 mins ago", icon: "check" },
              { action: "New Support Ticket", detail: "Ticket #8942 - Payment failed", time: "25 mins ago", icon: "information-circle" },
              { action: "Security Alert", detail: "Multiple login failures", time: "1 hour ago", icon: "alert-circle" },
            ].map((activity, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-bg)] text-[var(--foreground-muted)]">
                  <Icon name={activity.icon as any} size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)]">{activity.action}</p>
                  <p className="text-xs text-[var(--foreground-muted)] truncate">{activity.detail}</p>
                  <p className="mt-1 text-[10px] text-navy-400 uppercase font-bold tracking-wider">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon, variant }: { 
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
        <h3 className="text-sm font-medium text-[var(--foreground-muted)]">{title}</h3>
        <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{value}</p>
        <p className="text-xs font-medium text-success-600 mt-2 flex items-center gap-1">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          {change}
        </p>
      </div>
    </Card>
  );
}
