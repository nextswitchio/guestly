'use client';
import { RefreshCw, Download, Mail, UserX } from 'lucide-react';

import { useState, useEffect, use } from 'react';

interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  ticketId: string;
  purchasedAt: number;
  checkedIn: boolean;
  checkedInAt?: string | null;
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
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Attendees</h1>
          <p className="text-neutral-500 mt-1">
            {attendees.length} registered &middot; {checkedIn} checked in
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Total Registered</p>
          <p className="text-2xl font-bold mt-1 text-neutral-900">{attendees.length}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Checked In</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{checkedIn}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Not Checked In</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">{attendees.length - checkedIn}</p>
        </div>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20 max-w-sm w-full"
        />
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Name</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Email</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Ticket</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Ticket ID</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Purchased</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Status</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.map((attendee, index) => (
                <tr key={`${attendee.id}-${attendee.ticketType}-${index}`} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-6 py-4 text-sm font-medium text-neutral-900">{attendee.name}</td>
                  <td className="px-6 py-4 text-sm text-neutral-500">{attendee.email}</td>
                  <td className="px-6 py-4 text-sm text-neutral-900">{attendee.ticketType}</td>
                  <td className="px-6 py-4 text-sm text-neutral-500 font-mono">{attendee.ticketId}</td>
                  <td className="px-6 py-4 text-sm text-neutral-500">
                    {attendee.purchasedAt
                      ? new Date(attendee.purchasedAt * 1000).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
                      : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      attendee.checkedIn
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {attendee.checkedIn ? 'Checked In' : 'Not Checked In'}
                    </span>
                    {attendee.checkedIn && attendee.checkedInAt && (
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {new Date(attendee.checkedInAt).toLocaleString()}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                        Email
                      </button>
                      {!attendee.checkedIn && (
                        <button className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                          <UserX className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAttendees.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                    No attendees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
