"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import Switch from "@/components/ui/Switch";

type TabType = "profile" | "notifications" | "security" | "billing" | "team";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [orgName, setOrgName] = useState("My Organisation");
  const [email, setEmail] = useState("organiser@guestly.co");
  const [phone, setPhone] = useState("+234 800 000 0000");
  const [website, setWebsite] = useState("https://myorg.com");
  const [bio, setBio] = useState("We create amazing events");
  const [saving, setSaving] = useState(false);
  
  const [notifs, setNotifs] = useState({
    sales: true,
    reviews: true,
    marketing: false,
    eventReminders: true,
    weeklyReports: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
  });

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: "user" as const },
    { id: "notifications" as const, label: "Notifications", icon: "bell" as const },
    { id: "security" as const, label: "Security", icon: "shield" as const },
    { id: "billing" as const, label: "Billing", icon: "credit-card" as const },
    { id: "team" as const, label: "Team", icon: "users" as const },
  ];

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="mt-2 text-foreground-muted">
              Manage your organization profile and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="p-2">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? "bg-primary-500 text-white shadow-md"
                          : "text-foreground-muted hover:bg-surface-hover"
                      }`}
                    >
                      <Icon name={tab.icon} className="w-5 h-5" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <>
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Organization Profile</h2>
                        <p className="text-sm text-foreground-muted mt-1">
                          Update your organization's public information
                        </p>
                      </div>
                    </div>

                    {/* Profile Picture */}
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-surface-border">
                      <div className="relative">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-purple-500 text-3xl font-bold text-white shadow-lg">
                          {orgName.charAt(0)}
                        </div>
                        <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-800 border-2 border-surface-border shadow-md hover:shadow-lg transition-all">
                          <Icon name="camera" className="w-4 h-4 text-foreground" />
                        </button>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{orgName}</h3>
                        <p className="text-sm text-foreground-muted">{email}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Icon name="upload" className="w-4 h-4 mr-2" />
                          Upload Photo
                        </Button>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Input
                        label="Organization Name"
                        value={orgName}
                        onChange={(e) => setOrgName(e.currentTarget.value)}
                        placeholder="Enter organization name"
                      />
                      <Input
                        label="Contact Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        placeholder="email@example.com"
                      />
                      <Input
                        label="Phone Number"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.currentTarget.value)}
                        placeholder="+234 800 000 0000"
                      />
                      <Input
                        label="Website"
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.currentTarget.value)}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full rounded-lg border border-surface-border bg-surface-card px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        placeholder="Tell us about your organization..."
                      />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                          <>
                            <Icon name="loader" className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Icon name="check" className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>

                  {/* Social Links */}
                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-foreground mb-4">Social Links</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Facebook"
                        placeholder="facebook.com/yourpage"
                      />
                      <Input
                        label="Twitter"
                        placeholder="twitter.com/yourhandle"
                      />
                      <Input
                        label="Instagram"
                        placeholder="instagram.com/yourprofile"
                      />
                      <Input
                        label="LinkedIn"
                        placeholder="linkedin.com/company/yourcompany"
                      />
                    </div>
                  </Card>
                </>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-2">Notification Preferences</h2>
                  <p className="text-sm text-foreground-muted mb-6">
                    Choose what notifications you want to receive
                  </p>

                  <div className="space-y-4">
                    {[
                      {
                        key: "sales" as const,
                        label: "Ticket Sales",
                        desc: "Get notified about new ticket purchases",
                        icon: "shopping-cart" as const,
                      },
                      {
                        key: "reviews" as const,
                        label: "Reviews & Feedback",
                        desc: "Alerts when attendees leave reviews",
                        icon: "star" as const,
                      },
                      {
                        key: "marketing" as const,
                        label: "Marketing Updates",
                        desc: "Tips and product updates from Guestly",
                        icon: "mail" as const,
                      },
                      {
                        key: "eventReminders" as const,
                        label: "Event Reminders",
                        desc: "Reminders about upcoming events",
                        icon: "calendar" as const,
                      },
                      {
                        key: "weeklyReports" as const,
                        label: "Weekly Reports",
                        desc: "Weekly summary of your event performance",
                        icon: "trending-up" as const,
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between rounded-xl border border-surface-border p-4 hover:bg-surface-hover transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                            <Icon name={item.icon} className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{item.label}</p>
                            <p className="text-sm text-foreground-muted">{item.desc}</p>
                          </div>
                        </div>
                        <Switch
                          checked={notifs[item.key]}
                          onChange={(checked) =>
                            setNotifs((n) => ({ ...n, [item.key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button>
                      <Icon name="check" className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </Card>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <>
                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-foreground mb-2">Security Settings</h2>
                    <p className="text-sm text-foreground-muted mb-6">
                      Manage your account security and authentication
                    </p>

                    <div className="space-y-6">
                      {/* Password Change */}
                      <div className="pb-6 border-b border-surface-border">
                        <h3 className="font-semibold text-foreground mb-4">Change Password</h3>
                        <div className="space-y-4">
                          <Input
                            label="Current Password"
                            type="password"
                            placeholder="Enter current password"
                          />
                          <Input
                            label="New Password"
                            type="password"
                            placeholder="Enter new password"
                          />
                          <Input
                            label="Confirm New Password"
                            type="password"
                            placeholder="Confirm new password"
                          />
                        </div>
                        <Button className="mt-4">Update Password</Button>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="pb-6 border-b border-surface-border">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">Two-Factor Authentication</h3>
                            <p className="text-sm text-foreground-muted mt-1">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Switch
                            checked={security.twoFactor}
                            onChange={(checked) =>
                              setSecurity((s) => ({ ...s, twoFactor: checked }))
                            }
                          />
                        </div>
                      </div>

                      {/* Login Alerts */}
                      <div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">Login Alerts</h3>
                            <p className="text-sm text-foreground-muted mt-1">
                              Get notified of new login attempts
                            </p>
                          </div>
                          <Switch
                            checked={security.loginAlerts}
                            onChange={(checked) =>
                              setSecurity((s) => ({ ...s, loginAlerts: checked }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Active Sessions */}
                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-foreground mb-4">Active Sessions</h2>
                    <div className="space-y-3">
                      {[
                        { device: "Chrome on Windows", location: "Lagos, Nigeria", current: true },
                        { device: "Safari on iPhone", location: "Abuja, Nigeria", current: false },
                      ].map((session, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg border border-surface-border p-4"
                        >
                          <div className="flex items-center gap-3">
                            <Icon name="monitor" className="w-5 h-5 text-foreground-muted" />
                            <div>
                              <p className="font-medium text-foreground">{session.device}</p>
                              <p className="text-sm text-foreground-muted">{session.location}</p>
                            </div>
                          </div>
                          {session.current ? (
                            <span className="text-xs font-semibold text-success-600 dark:text-success-400">
                              Current Session
                            </span>
                          ) : (
                            <Button variant="outline" size="sm">
                              Revoke
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {/* Billing Tab */}
              {activeTab === "billing" && (
                <>
                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-foreground mb-4">Payment Methods</h2>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between rounded-lg border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/20 p-4">
                        <div className="flex items-center gap-3">
                          <Icon name="credit-card" className="w-6 h-6 text-primary-600" />
                          <div>
                            <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                            <p className="text-sm text-foreground-muted">Expires 12/25</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-primary-600">Default</span>
                      </div>
                    </div>
                    <Button variant="outline">
                      <Icon name="plus" className="w-4 h-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-foreground mb-4">Billing History</h2>
                    <div className="space-y-3">
                      {[
                        { date: "Mar 1, 2024", amount: "$80", status: "Paid" },
                        { date: "Feb 1, 2024", amount: "$80", status: "Paid" },
                        { date: "Jan 1, 2024", amount: "$80", status: "Paid" },
                      ].map((invoice, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg border border-surface-border p-4"
                        >
                          <div>
                            <p className="font-medium text-foreground">{invoice.date}</p>
                            <p className="text-sm text-foreground-muted">Annual Subscription</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-foreground">{invoice.amount}</span>
                            <span className="text-xs font-semibold text-success-600">
                              {invoice.status}
                            </span>
                            <Button variant="ghost" size="sm">
                              <Icon name="download" className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {/* Team Tab */}
              {activeTab === "team" && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Team Members</h2>
                      <p className="text-sm text-foreground-muted mt-1">
                        Manage who has access to your organization
                      </p>
                    </div>
                    <Button>
                      <Icon name="user-plus" className="w-4 h-4 mr-2" />
                      Invite Member
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: "John Doe", email: "john@example.com", role: "Owner" },
                      { name: "Jane Smith", email: "jane@example.com", role: "Admin" },
                      { name: "Bob Johnson", email: "bob@example.com", role: "Member" },
                    ].map((member, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-surface-border p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 font-semibold text-primary-600">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{member.name}</p>
                            <p className="text-sm text-foreground-muted">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-foreground-muted">
                            {member.role}
                          </span>
                          {member.role !== "Owner" && (
                            <Button variant="ghost" size="sm">
                              <Icon name="more-vertical" className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Danger Zone */}
              <Card className="border-danger-200 dark:border-danger-800 p-6">
                <h2 className="text-xl font-bold text-danger-600 dark:text-danger-400 mb-2">
                  Danger Zone
                </h2>
                <p className="text-sm text-foreground-muted mb-6">
                  Irreversible actions — proceed with caution
                </p>
                <div className="flex items-center justify-between rounded-xl border border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-900/20 p-4">
                  <div>
                    <p className="font-medium text-foreground">Delete Organization</p>
                    <p className="text-sm text-foreground-muted">
                      Permanently remove your organization and all events
                    </p>
                  </div>
                  <Button variant="outline" className="border-danger-300 text-danger-600 hover:bg-danger-50">
                    Delete
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
