"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

export default function SettingsPage() {
  const [orgName, setOrgName] = React.useState("My Organisation");
  const [email, setEmail] = React.useState("organiser@guestly.co");
  const [notifs, setNotifs] = React.useState({ sales: true, reviews: true, marketing: false });

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="flex flex-col gap-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage your organisation profile and preferences</p>
        </div>

        {/* Profile Section */}
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-neutral-900">Organisation Profile</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-2xl font-bold text-primary-700">
              {orgName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">{orgName}</p>
              <p className="text-xs text-neutral-500">{email}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Organisation Name"
              value={orgName}
              onChange={(e) => setOrgName(e.currentTarget.value)}
            />
            <Input
              label="Contact Email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-700">
              Save Changes
            </button>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-neutral-900">Notifications</h2>
          <div className="space-y-4">
            {[
              { key: "sales" as const, label: "Ticket Sales", desc: "Get notified about new ticket purchases" },
              { key: "reviews" as const, label: "Reviews & Feedback", desc: "Alerts when attendees leave reviews" },
              { key: "marketing" as const, label: "Marketing Updates", desc: "Tips and product updates from Guestly" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-xl border border-neutral-100 p-4">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{item.label}</p>
                  <p className="text-xs text-neutral-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifs((n) => ({ ...n, [item.key]: !n[item.key] }))}
                  className={`relative h-6 w-11 rounded-full transition ${notifs[item.key] ? "bg-primary-600" : "bg-neutral-200"
                    }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${notifs[item.key] ? "left-5.5" : "left-0.5"
                      }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <h2 className="mb-2 text-sm font-semibold text-red-600">Danger Zone</h2>
          <p className="text-xs text-neutral-500">Irreversible actions — proceed with caution</p>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-red-100 bg-red-50/50 p-4">
            <div>
              <p className="text-sm font-medium text-neutral-900">Delete Organisation</p>
              <p className="text-xs text-neutral-500">Permanently remove your org and all events</p>
            </div>
            <button className="rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
              Delete
            </button>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}

