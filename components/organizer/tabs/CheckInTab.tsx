"use client";
import React from "react";
import Card from "@/components/ui/Card";

const recentCheckIns = [
  { name: "Ada Okafor", ticket: "VIP", time: "2 mins ago", avatar: "A" },
  { name: "Bayo Adeniyi", ticket: "General", time: "5 mins ago", avatar: "B" },
  { name: "Chinwe Eze", ticket: "General", time: "8 mins ago", avatar: "C" },
  { name: "David Mensah", ticket: "VIP", time: "12 mins ago", avatar: "D" },
  { name: "Ejiro Obi", ticket: "General", time: "15 mins ago", avatar: "E" },
];

export default function CheckInTab() {
  const [count, setCount] = React.useState(45);
  const [scanning, setScanning] = React.useState(false);
  const total = 203;
  const pct = Math.round((count / total) * 100);
  const checkInRate = 12; // per hour

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setCount((c) => Math.min(c + 1, total));
      setScanning(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Progress Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-success-500 to-success-700 border-0 p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Check-in Progress</h2>
              <p className="text-sm text-white/80">Real-time attendance tracking</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
              <p className="text-xs font-medium text-white/70 uppercase tracking-wide mb-2">Checked In</p>
              <p className="text-4xl font-bold text-white tabular-nums">{count}</p>
              <p className="text-xs text-white/60 mt-1">of {total} attendees</p>
            </div>

            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
              <p className="text-xs font-medium text-white/70 uppercase tracking-wide mb-2">Progress</p>
              <p className="text-4xl font-bold text-white tabular-nums">{pct}%</p>
              <p className="text-xs text-white/60 mt-1">completion rate</p>
            </div>

            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
              <p className="text-xs font-medium text-white/70 uppercase tracking-wide mb-2">Check-in Rate</p>
              <p className="text-4xl font-bold text-white tabular-nums">{checkInRate}</p>
              <p className="text-xs text-white/60 mt-1">per hour</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-white/90">
              <span>Overall Progress</span>
              <span className="font-semibold tabular-nums">{pct}%</span>
            </div>
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-500 shadow-lg"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Scanner */}
        <Card className="flex flex-col items-center justify-center py-12">
          <div className={`relative flex h-48 w-48 items-center justify-center rounded-3xl border-4 ${
            scanning ? "border-success-500 bg-success-50" : "border-dashed border-neutral-300 bg-neutral-50"
          } transition-all duration-300`}>
            {scanning ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-success-200 border-t-success-600" />
                <p className="text-sm font-medium text-success-700">Scanning...</p>
              </div>
            ) : (
              <svg className="h-24 w-24 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            )}
            
            {/* Scanning animation overlay */}
            {scanning && (
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute inset-x-0 top-0 h-1 bg-success-500 animate-scan" />
              </div>
            )}
          </div>
          
          <h3 className="mt-6 text-lg font-semibold text-[var(--foreground)]">QR Code Scanner</h3>
          <p className="mt-2 text-center text-sm text-[var(--foreground-subtle)] max-w-xs">
            Point your device camera at an attendee&apos;s ticket QR code to check them in instantly
          </p>
          
          <div className="mt-6 flex gap-3">
            <button
              onClick={simulateScan}
              disabled={scanning || count >= total}
              className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              {scanning ? "Scanning..." : "Start Scanner"}
            </button>
            
            <button className="flex items-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-card)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-hover)]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Manual Entry
            </button>
          </div>
        </Card>

        {/* Recent Check-ins */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Recent Check-ins</h3>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success-100 text-xs font-bold text-success-700">
              {recentCheckIns.length}
            </span>
          </div>

          {count === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
                <svg className="h-10 w-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="mt-4 text-sm font-medium text-[var(--foreground)]">No check-ins yet</p>
              <p className="mt-1 text-xs text-[var(--foreground-subtle)] text-center max-w-xs">
                Start scanning QR codes to check in attendees as they arrive
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentCheckIns.map((checkIn, i) => (
                <div key={i} className="group flex items-center gap-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-3 transition hover:shadow-md hover:border-success-300">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-success-400 to-success-600 text-white font-bold shadow-sm">
                    {checkIn.avatar}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[var(--foreground)] truncate">{checkIn.name}</p>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        checkIn.ticket === "VIP" 
                          ? "bg-warning-100 text-warning-700 border border-warning-200" 
                          : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                      }`}>
                        {checkIn.ticket === "VIP" && "⭐"}
                        {checkIn.ticket}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--foreground-subtle)] mt-0.5">{checkIn.time}</p>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-100">
                    <svg className="h-5 w-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
              <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-subtle)]">Avg Check-in Time</p>
              <p className="text-xl font-bold text-[var(--foreground)] tabular-nums">45s</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning-100">
              <svg className="h-6 w-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-subtle)]">Pending</p>
              <p className="text-xl font-bold text-[var(--foreground)] tabular-nums">{total - count}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-100">
              <svg className="h-6 w-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-subtle)]">Success Rate</p>
              <p className="text-xl font-bold text-[var(--foreground)] tabular-nums">98%</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

