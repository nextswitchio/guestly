import { CheckCircle, MapPin, Star, Timer } from 'lucide-react';
import React from "react";
import Card from "@/components/ui/Card";

const attendees = [
  { name: "Ada Okafor", email: "ada@mail.com", ticket: "VIP", status: "Confirmed", avatar: "A", checkedIn: true, purchaseDate: "2024-03-15" },
  { name: "Bayo Adeniyi", email: "bayo@mail.com", ticket: "General", status: "Pending", avatar: "B", checkedIn: false, purchaseDate: "2024-03-18" },
  { name: "Chinwe Eze", email: "chinwe@mail.com", ticket: "General", status: "Confirmed", avatar: "C", checkedIn: true, purchaseDate: "2024-03-10" },
  { name: "David Mensah", email: "david@mail.com", ticket: "VIP", status: "Confirmed", avatar: "D", checkedIn: false, purchaseDate: "2024-03-12" },
  { name: "Ejiro Obi", email: "ejiro@mail.com", ticket: "General", status: "Cancelled", avatar: "E", checkedIn: false, purchaseDate: "2024-03-08" },
  { name: "Fatima Hassan", email: "fatima@mail.com", ticket: "VIP", status: "Confirmed", avatar: "F", checkedIn: true, purchaseDate: "2024-03-14" },
  { name: "Grace Nkrumah", email: "grace@mail.com", ticket: "General", status: "Confirmed", avatar: "G", checkedIn: false, purchaseDate: "2024-03-16" },
];

const statusColors: Record<string, string> = {
  Confirmed: "bg-success-50 text-success-700 border-success-200",
  Pending: "bg-warning-50 text-warning-700 border-warning-200",
  Cancelled: "bg-danger-50 text-danger-700 border-danger-200",
};

export default function AttendeesTab() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterTicket, setFilterTicket] = React.useState<string>("all");

  const filteredAttendees = attendees.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         a.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || a.status === filterStatus;
    const matchesTicket = filterTicket === "all" || a.ticket === filterTicket;
    return matchesSearch && matchesStatus && matchesTicket;
  });

  const totalAttendees = attendees.length;
  const confirmedCount = attendees.filter(a => a.status === "Confirmed").length;
  const pendingCount = attendees.filter(a => a.status === "Pending").length;
  const checkedInCount = attendees.filter(a => a.checkedIn).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 border-0 p-6">
          <div className="absolute top-0 right-0 opacity-10">
            <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div className="relative">
            <p className="text-sm font-medium text-white/80 mb-1">Total Attendees</p>
            <p className="text-4xl font-bold text-white tabular-nums">{totalAttendees}</p>
            <p className="text-xs text-white/70 mt-2">All registrations</p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-100">
              <span className="text-xl"><CheckCircle className="h-4 w-4 inline-block" /></span>
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-subtle)]">Confirmed</p>
              <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums">{confirmedCount}</p>
            </div>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-border)]">
            <div 
              className="h-full rounded-full bg-success-500 transition-all"
              style={{ width: `${(confirmedCount / totalAttendees) * 100}%` }}
            />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-100">
              <span className="text-xl"><Timer className="h-4 w-4 inline-block" /></span>
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-subtle)]">Pending</p>
              <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums">{pendingCount}</p>
            </div>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-border)]">
            <div 
              className="h-full rounded-full bg-warning-500 transition-all"
              style={{ width: `${(pendingCount / totalAttendees) * 100}%` }}
            />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100">
              <span className="text-xl"><MapPin className="h-4 w-4 inline-block" /></span>
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-subtle)]">Checked In</p>
              <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums">{checkedInCount}</p>
            </div>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-border)]">
            <div 
              className="h-full rounded-full bg-primary-500 transition-all"
              style={{ width: `${(checkedInCount / totalAttendees) * 100}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--foreground-subtle)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface-card)] pl-10 pr-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-card)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="all">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={filterTicket}
            onChange={(e) => setFilterTicket(e.target.value)}
            className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-card)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="all">All Tickets</option>
            <option value="VIP">VIP</option>
            <option value="General">General</option>
          </select>

          <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700 hover:shadow-lg whitespace-nowrap">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
        </div>
      </Card>

      {/* Attendee List */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-bg)]">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider">Attendee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider">Ticket Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider">Check-in</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider">Purchase Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-border)]">
              {filteredAttendees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                        <svg className="h-8 w-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">No attendees found</p>
                        <p className="text-xs text-[var(--foreground-subtle)] mt-1">Try adjusting your search or filters</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAttendees.map((a) => (
                  <tr key={a.email} className="hover:bg-[var(--surface-hover)] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white shadow-sm">
                          {a.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">{a.name}</p>
                          <p className="text-xs text-[var(--foreground-subtle)]">{a.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        a.ticket === "VIP" 
                          ? "bg-gradient-to-r from-warning-400 to-warning-600 text-white shadow-sm" 
                          : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                      }`}>
                        {a.ticket === "VIP" && "⭐"}
                        {a.ticket}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusColors[a.status] || "bg-neutral-100 text-neutral-700 border-neutral-200"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {a.checkedIn ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success-700">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Checked In
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--foreground-subtle)]">Not yet</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-[var(--foreground-subtle)]">{a.purchaseDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="flex items-center gap-1 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-card)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-hover)]">
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                        <button className="flex items-center gap-1 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-card)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-hover)]">
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {filteredAttendees.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--foreground-subtle)]">
            Showing <span className="font-medium text-[var(--foreground)]">{filteredAttendees.length}</span> of <span className="font-medium text-[var(--foreground)]">{totalAttendees}</span> attendees
          </p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-hover)] disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-hover)]">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

