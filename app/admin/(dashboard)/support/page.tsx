'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, RefreshCw, CheckCircle, Archive } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';

interface Ticket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: number;
  updatedAt: number;
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/admin/support/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error('Failed to fetch support tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  const statusColors: Record<string, string> = {
    open: 'bg-red-100 text-red-700',
    in_progress: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-slate-100 text-slate-600',
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  };

  const tabs = [
    {
      id: 'open',
      label: `Open (${stats.open})`,
      content: (
        <div className="space-y-4">
          {tickets.filter(t => t.status === 'open' || t.status === 'in_progress').map((ticket) => (
            <Card key={ticket.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{ticket.subject}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                    {ticket.status === 'in_progress' ? 'In Progress' : 'Open'}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </div>
                <span className="text-sm text-slate-500">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-1">{ticket.userName} ({ticket.userEmail})</p>
              <p className="text-slate-600">{ticket.message}</p>
              <div className="flex gap-2 mt-4">
                <Button size="sm">
                  <MessageCircle className="w-4 h-4 mr-1.5" />
                  Reply
                </Button>
                <Button size="sm" variant="outline" className="text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Resolve
                </Button>
              </div>
            </Card>
          ))}
          {tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length === 0 && (
            <Card className="p-12 text-center">
              <MessageCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All clear!</h3>
              <p className="text-slate-500">No open support tickets.</p>
            </Card>
          )}
        </div>
      ),
    },
    {
      id: 'resolved',
      label: `Resolved (${stats.resolved})`,
      content: (
        <div className="space-y-4">
          {tickets.filter(t => t.status === 'resolved').map((ticket) => (
            <Card key={ticket.id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{ticket.subject}</h3>
                  <p className="text-sm text-slate-500">{ticket.userName}</p>
                </div>
                <span className="text-sm text-slate-500">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support</h1>
          <p className="text-slate-500 mt-1">Manage customer support tickets</p>
        </div>
        <Button variant="outline" onClick={fetchTickets}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-slate-500">Open</p>
          <p className="text-2xl font-bold mt-1 text-red-600">{stats.open}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">In Progress</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">{stats.inProgress}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Resolved</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{stats.resolved}</p>
        </Card>
      </div>

      <Tabs tabs={tabs} defaultTabId="open" />
    </div>
  );
}
