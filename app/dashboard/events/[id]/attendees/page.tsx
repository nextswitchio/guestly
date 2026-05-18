'use client';
import { RefreshCw, Download, Mail, UserX } from 'lucide-react';

import { useState, useEffect, use } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  ticketId: string;
  purchasedAt: number;
  checkedIn: boolean;
}

export default function EventAttendeesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAttendees();
  }, [id]);

  const fetchAttendees = async () => {
    try {
      const response = await fetch(`/api/events/${id}/attendees`);
      if (response.ok) {
        const data = await response.json();
        setAttendees(data.attendees || []);
      }
    } catch (error) {
      console.error('Failed to fetch attendees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendees = attendees.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const checkedIn = attendees.filter(a => a.checkedIn).length;

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
          <h1 className="text-3xl font-bold">Attendees</h1>
          <p className="text-slate-500 mt-1">
            {attendees.length} registered &middot; {checkedIn} checked in
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-slate-500">Total Registered</p>
          <p className="text-2xl font-bold mt-1">{attendees.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Checked In</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{checkedIn}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Not Checked In</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">{attendees.length - checkedIn}</p>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Name</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Email</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Ticket</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Ticket ID</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Status</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.map((attendee) => (
                <tr key={attendee.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium">{attendee.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{attendee.email}</td>
                  <td className="px-6 py-4 text-sm">{attendee.ticketType}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">{attendee.ticketId}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      attendee.checkedIn
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {attendee.checkedIn ? 'Checked In' : 'Not Checked In'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Mail className="w-3.5 h-3.5 mr-1.5" />
                        Email
                      </Button>
                      {!attendee.checkedIn && (
                        <Button size="sm" variant="outline" className="text-danger-600">
                          <UserX className="w-3.5 h-3.5 mr-1.5" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAttendees.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No attendees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
