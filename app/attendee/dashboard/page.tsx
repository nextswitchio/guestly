'use client';

import { useState, useEffect } from 'react';
import { Calendar, Ticket, Wallet, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AttendeeStats {
  upcomingEvents: number;
  pastEvents: number;
  totalSpent: number;
  ticketsPurchased: number;
}

export default function AttendeeDashboardPage() {
  const [stats, setStats] = useState<AttendeeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/attendee/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            My Dashboard
          </h1>
          <p className="text-lg text-slate-500 mt-1">Track your events and activity</p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-5 rounded-2xl border border-slate-100 shadow-sm">
              <Calendar className="w-5 h-5 text-primary-600 mb-2" />
              <p className="text-sm text-slate-500">Upcoming Events</p>
              <p className="text-2xl font-bold text-slate-900">{stats.upcomingEvents}</p>
            </Card>
            <Card className="p-5 rounded-2xl border border-slate-100 shadow-sm">
              <Calendar className="w-5 h-5 text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">Past Events</p>
              <p className="text-2xl font-bold text-slate-900">{stats.pastEvents}</p>
            </Card>
            <Card className="p-5 rounded-2xl border border-slate-100 shadow-sm">
              <Ticket className="w-5 h-5 text-amber-600 mb-2" />
              <p className="text-sm text-slate-500">Tickets Purchased</p>
              <p className="text-2xl font-bold text-slate-900">{stats.ticketsPurchased}</p>
            </Card>
            <Card className="p-5 rounded-2xl border border-slate-100 shadow-sm">
              <Wallet className="w-5 h-5 text-green-600 mb-2" />
              <p className="text-sm text-slate-500">Total Spent</p>
              <p className="text-2xl font-bold text-slate-900">₦{stats.totalSpent.toLocaleString()}</p>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/attendee/orders" className="group">
            <Card className="p-6 rounded-2xl border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
              <Ticket className="w-8 h-8 text-primary-600 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">My Tickets</h3>
              <p className="text-sm text-slate-500">View all your purchased tickets</p>
              <ArrowRight className="w-4 h-4 text-primary-600 mt-3 group-hover:translate-x-1 transition-transform" />
            </Card>
          </Link>
          <Link href="/wallet" className="group">
            <Card className="p-6 rounded-2xl border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
              <Wallet className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">Wallet</h3>
              <p className="text-sm text-slate-500">Manage funds and view transactions</p>
              <ArrowRight className="w-4 h-4 text-green-600 mt-3 group-hover:translate-x-1 transition-transform" />
            </Card>
          </Link>
          <Link href="/explore" className="group">
            <Card className="p-6 rounded-2xl border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
              <Calendar className="w-8 h-8 text-amber-600 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">Discover Events</h3>
              <p className="text-sm text-slate-500">Find your next experience</p>
              <ArrowRight className="w-4 h-4 text-amber-600 mt-3 group-hover:translate-x-1 transition-transform" />
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
