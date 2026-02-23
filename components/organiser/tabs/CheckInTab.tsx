"use client";
import React from "react";
import Card from "@/components/ui/Card";

export default function CheckInTab() {
  const [count, setCount] = React.useState(0);
  const total = 203;
  const pct = Math.round((count / total) * 100);

  return (
    <div className="flex flex-col gap-4">
      {/* Progress Header */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Check-in Progress</h3>
            <p className="text-xs text-neutral-500">{count} of {total} attendees checked in</p>
          </div>
          <span className="text-2xl font-bold text-primary-600 tabular-nums">{pct}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-primary-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </Card>

      {/* Scanner */}
      <Card className="flex flex-col items-center py-8">
        <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50">
          <svg className="h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-medium text-neutral-900">Scan QR Code</p>
        <p className="mt-1 text-xs text-neutral-500">Point the camera at an attendee&apos;s ticket QR code</p>
        <button
          onClick={() => setCount((c) => Math.min(c + 1, total))}
          className="mt-5 flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Simulate Scan
        </button>
      </Card>

      {/* Recent Check-ins */}
      <Card>
        <h3 className="mb-3 text-sm font-semibold text-neutral-900">Recent Check-ins</h3>
        {count === 0 ? (
          <p className="text-center text-xs text-neutral-400 py-4">No check-ins yet — scan a QR code above</p>
        ) : (
          <div className="space-y-2">
            {Array.from({ length: Math.min(count, 5) }, (_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-success-50/50 p-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success-100 text-xs text-success-700">✓</span>
                <p className="text-sm text-neutral-700">Attendee #{count - i} checked in</p>
                <span className="ml-auto text-xs text-neutral-400">Just now</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

