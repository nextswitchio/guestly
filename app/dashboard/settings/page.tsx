"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Icon } from "@/components/ui/Icon";
import Switch from "@/components/ui/Switch";
import Modal from "@/components/ui/Modal";

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

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [savingPayment, setSavingPayment] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState([
    { id: "1", type: "visa" as const, last4: "4242", expiry: "12/25", default: true },
  ]);

  const handleSavePayment = async () => {
    if (!cardNumber || !cardName || !cardExpiry || !cardCvc) return;
    setSavingPayment(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const last4 = cardNumber.replace(/\s/g, "").slice(-4);
    setPaymentMethods((prev) => [
      ...prev,
      { id: Date.now().toString(), type: "visa" as const, last4, expiry: cardExpiry, default: false },
    ]);
    setCardNumber("");
    setCardName("");
    setCardExpiry("");
    setCardCvc("");
    setSavingPayment(false);
    setPaymentModalOpen(false);
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((m) => ({ ...m, default: m.id === id }))
    );
  };

  const handleRemovePayment = (id: string) => {
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: "user" as const },
    { id: "notifications" as const, label: "Notifications", icon: "bell" as const },
    { id: "security" as const, label: "Security", icon: "shield" as const },
    { id: "billing" as const, label: "Billing", icon: "credit-card" as const },
    { id: "team" as const, label: "Team", icon: "users" as const },
  ];

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Settings</h1>
          <p className="text-neutral-500 mt-1">Manage your organization profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-neutral-200 bg-white p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-lime text-dark"
                        : "text-neutral-500 hover:bg-neutral-50"
                    }`}
                  >
                    <Icon name={tab.icon} size={18} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-neutral-900">Organization Profile</h2>
                    <p className="text-sm text-neutral-500 mt-1">
                      Update your organization&apos;s public information
                    </p>
                  </div>

                  {/* Profile Picture */}
                  <div className="flex items-center gap-6 mb-8 pb-8 border-b border-neutral-100">
                    <div className="relative">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-lime to-lime-hover text-3xl font-bold text-dark">
                        {orgName.charAt(0)}
                      </div>
                      <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-neutral-200 shadow-sm">
                        <Icon name="camera" size={16} className="text-neutral-600" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">{orgName}</h3>
                      <p className="text-sm text-neutral-500">{email}</p>
                      <button className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                        <Icon name="upload" size={14} />
                        Upload Photo
                      </button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Organization Name</label>
                      <input
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.currentTarget.value)}
                        className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Contact Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.currentTarget.value)}
                        className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Website</label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.currentTarget.value)}
                        className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                      placeholder="Tell us about your organization..."
                    />
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-dark hover:bg-lime-hover disabled:opacity-50 transition-colors"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>

                {/* Social Links */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-neutral-900 mb-4">Social Links</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((platform) => (
                      <div key={platform}>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">{platform}</label>
                        <input
                          type="text"
                          placeholder={`${platform.toLowerCase()}.com/yourpage`}
                          className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-1">Notification Preferences</h2>
                <p className="text-sm text-neutral-500 mb-6">
                  Choose what notifications you want to receive
                </p>

                <div className="space-y-4">
                  {[
                    { key: "sales" as const, label: "Ticket Sales", desc: "Get notified about new ticket purchases", icon: "shopping-cart" as const },
                    { key: "reviews" as const, label: "Reviews & Feedback", desc: "Alerts when attendees leave reviews", icon: "star" as const },
                    { key: "marketing" as const, label: "Marketing Updates", desc: "Tips and product updates from Guestly", icon: "mail" as const },
                    { key: "eventReminders" as const, label: "Event Reminders", desc: "Reminders about upcoming events", icon: "calendar" as const },
                    { key: "weeklyReports" as const, label: "Weekly Reports", desc: "Weekly summary of your event performance", icon: "trending-up" as const },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between rounded-xl border border-neutral-100 p-4 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime/10">
                          <Icon name={item.icon} size={18} className="text-lime" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{item.label}</p>
                          <p className="text-sm text-neutral-500">{item.desc}</p>
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
                  <button className="rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-dark hover:bg-lime-hover transition-colors">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-neutral-900 mb-1">Security Settings</h2>
                  <p className="text-sm text-neutral-500 mb-6">
                    Manage your account security and authentication
                  </p>

                  <div className="space-y-6">
                    <div className="pb-6 border-b border-neutral-100">
                      <h3 className="font-semibold text-neutral-900 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                          <div key={label}>
                            <label className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</label>
                            <input
                              type="password"
                              placeholder={`Enter ${label.toLowerCase()}`}
                              className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                            />
                          </div>
                        ))}
                      </div>
                      <button className="mt-4 rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-dark hover:bg-lime-hover transition-colors">
                        Update Password
                      </button>
                    </div>

                    <div className="pb-6 border-b border-neutral-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-neutral-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-neutral-500 mt-1">
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

                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-neutral-900">Login Alerts</h3>
                          <p className="text-sm text-neutral-500 mt-1">
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
                </div>

                {/* Active Sessions */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-neutral-900 mb-4">Active Sessions</h2>
                  <div className="space-y-3">
                    {[
                      { device: "Chrome on Windows", location: "Lagos, Nigeria", current: true },
                      { device: "Safari on iPhone", location: "Abuja, Nigeria", current: false },
                    ].map((session, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-neutral-100 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <Icon name="monitor" size={18} className="text-neutral-500" />
                          <div>
                            <p className="font-medium text-neutral-900">{session.device}</p>
                            <p className="text-sm text-neutral-500">{session.location}</p>
                          </div>
                        </div>
                        {session.current ? (
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            Current Session
                          </span>
                        ) : (
                          <button className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-neutral-900 mb-4">Payment Methods</h2>
                  <div className="space-y-3 mb-6">
                    {paymentMethods.length === 0 ? (
                      <p className="text-sm text-neutral-500 py-4 text-center">No payment methods added yet</p>
                    ) : (
                      paymentMethods.map((method) => (
                        <div key={method.id} className={`flex items-center justify-between rounded-xl border-2 p-4 ${method.default ? "border-lime bg-lime/5" : "border-neutral-200"}`}>
                          <div className="flex items-center gap-3">
                            <Icon name="credit-card" size={24} className={method.default ? "text-lime" : "text-neutral-400"} />
                            <div>
                              <p className="font-medium text-neutral-900">•••• •••• •••• {method.last4}</p>
                              <p className="text-sm text-neutral-500">Expires {method.expiry}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {method.default ? (
                              <span className="text-xs font-semibold text-lime bg-lime/10 px-2 py-1 rounded-lg">Default</span>
                            ) : (
                              <button onClick={() => handleSetDefault(method.id)} className="text-xs font-medium text-lime hover:underline">
                                Set Default
                              </button>
                            )}
                            <button onClick={() => handleRemovePayment(method.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                              <Icon name="trash-2" size={16} className="text-neutral-400 hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <button onClick={() => setPaymentModalOpen(true)} className="rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-dark hover:bg-lime-hover transition-colors">
                    Add Payment Method
                  </button>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-neutral-900 mb-4">Billing History</h2>
                  <div className="space-y-3">
                    {[
                      { date: "Mar 1, 2024", amount: "$80", status: "Paid" },
                      { date: "Feb 1, 2024", amount: "$80", status: "Paid" },
                      { date: "Jan 1, 2024", amount: "$80", status: "Paid" },
                    ].map((invoice, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-neutral-100 p-4"
                      >
                        <div>
                          <p className="font-medium text-neutral-900">{invoice.date}</p>
                          <p className="text-sm text-neutral-500">Annual Subscription</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-neutral-900">{invoice.amount}</span>
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            {invoice.status}
                          </span>
                          <button className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
                            <Icon name="download" size={16} className="text-neutral-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Team Tab */}
            {activeTab === "team" && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">Team Members</h2>
                    <p className="text-sm text-neutral-500 mt-1">
                      Manage who has access to your organization
                    </p>
                  </div>
                  <button className="flex items-center gap-2 rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-dark hover:bg-lime-hover transition-colors">
                    <Icon name="user-plus" size={16} />
                    Invite Member
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "John Doe", email: "john@example.com", role: "Owner" },
                    { name: "Jane Smith", email: "jane@example.com", role: "Admin" },
                    { name: "Bob Johnson", email: "bob@example.com", role: "Member" },
                  ].map((member, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-neutral-100 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime/10 font-semibold text-lime">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{member.name}</p>
                          <p className="text-sm text-neutral-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-neutral-500">
                          {member.role}
                        </span>
                        {member.role !== "Owner" && (
                          <button className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
                            <Icon name="more-vertical" size={16} className="text-neutral-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-red-600 mb-1">
                Danger Zone
              </h2>
              <p className="text-sm text-neutral-500 mb-4">
                Irreversible actions — proceed with caution
              </p>
              <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4">
                <div>
                  <p className="font-medium text-neutral-900">Delete Organization</p>
                  <p className="text-sm text-neutral-500">
                    Permanently remove your organization and all events
                  </p>
                </div>
                <button className="rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Payment Method Modal */}
        <Modal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          title="Add Payment Method"
          description="Enter your card details to add a new payment method"
          size="md"
        >
          <div className="space-y-4">
            {/* Payment type toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                  paymentMethod === "card"
                    ? "bg-lime text-dark"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                }`}
              >
                Credit / Debit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("bank")}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                  paymentMethod === "bank"
                    ? "bg-lime text-dark"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                }`}
              >
                Bank Account
              </button>
            </div>

            {paymentMethod === "card" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "");
                        if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                        setCardExpiry(v);
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Bank Name</label>
                  <input
                    type="text"
                    placeholder="Enter bank name"
                    className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Account Number</label>
                  <input
                    type="text"
                    placeholder="Enter account number"
                    maxLength={10}
                    className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Account Holder Name</label>
                  <input
                    type="text"
                    placeholder="Enter account holder name"
                    className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setPaymentModalOpen(false)}
              className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePayment}
              disabled={savingPayment || (paymentMethod === "card" && (!cardNumber || !cardName || !cardExpiry || !cardCvc))}
              className="rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-dark hover:bg-lime-hover disabled:opacity-50 transition-colors"
            >
              {savingPayment ? "Adding..." : "Add Payment Method"}
            </button>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
