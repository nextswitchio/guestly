import React from "react";
import Card from "@/components/ui/Card";

const attendees = [
  { name: "Ada Okafor", email: "ada@mail.com", ticket: "VIP", status: "Confirmed", avatar: "A" },
  { name: "Bayo Adeniyi", email: "bayo@mail.com", ticket: "General", status: "Pending", avatar: "B" },
  { name: "Chinwe Eze", email: "chinwe@mail.com", ticket: "General", status: "Confirmed", avatar: "C" },
  { name: "David Mensah", email: "david@mail.com", ticket: "VIP", status: "Confirmed", avatar: "D" },
  { name: "Ejiro Obi", email: "ejiro@mail.com", ticket: "General", status: "Cancelled", avatar: "E" },
];

const statusColors: Record<string, string> = {
  Confirmed: "bg-success-50 text-success-700",
  Pending: "bg-warning-50 text-warning-700",
  Cancelled: "bg-red-50 text-red-600",
};

export default function AttendeesTab() {
  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: "203", icon: "👥" },
          { label: "Confirmed", value: "185", icon: "✅" },
          { label: "Pending", value: "18", icon: "⏳" },
        ].map((s) => (
          <Card key={s.label} className="flex items-center gap-2 p-3">
            <span className="text-lg">{s.icon}</span>
            <div>
              <p className="text-sm font-bold text-neutral-900 tabular-nums">{s.value}</p>
              <p className="text-xs text-neutral-500">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Attendee List */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Attendee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Ticket</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((a) => (
                <tr key={a.email} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                        {a.avatar}
                      </span>
                      <div>
                        <p className="font-medium text-neutral-900">{a.name}</p>
                        <p className="text-xs text-neutral-500">{a.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.ticket === "VIP" ? "bg-warning-50 text-warning-700" : "bg-neutral-100 text-neutral-700"
                      }`}>
                      {a.ticket}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[a.status] || "bg-neutral-100 text-neutral-700"}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

