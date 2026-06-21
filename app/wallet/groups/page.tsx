"use client";
import { Building2, Check, Heart, Loader, Search, Users, X } from 'lucide-react';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import GroupNotificationBell from "@/components/wallet/GroupNotificationBell";
import type { GroupWallet } from "@/lib/store";

export default function GroupWalletsPage() {
  const router = useRouter();
  const [groupWallets, setGroupWallets] = useState<GroupWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchGroupWallets();
  }, []);

  const fetchGroupWallets = async () => {
    try {
      const res = await fetch("/api/wallet/groups");
      const data = await res.json();
      if (data.success) {
        setGroupWallets(data.data);
      }
    } catch (error) {
      console.error("Error fetching group wallets:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (current: number, goal: number) => {
    return goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-neutral-200 rounded w-1/3 mb-6" />
        <div className="h-32 bg-neutral-100 rounded-xl" />
        <div className="h-32 bg-neutral-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Group Wallets
          </h1>
          <p className="text-neutral-500">
            Save together with friends and family for events
          </p>
        </div>
        <div className="flex items-center gap-3">
          <GroupNotificationBell />
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-lime text-dark rounded-lg hover:bg-lime-hover transition-colors font-medium"
          >
            Create Group
          </button>
        </div>
      </div>

      {groupWallets.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-neutral-200">
          <div className="flex justify-center mb-4"><Users className="h-12 w-12 text-neutral-300" /></div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            No group wallets yet
          </h3>
          <p className="text-neutral-500 mb-6">
            Create a group wallet to save together with friends and family
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-lime text-dark rounded-lg hover:bg-lime-hover transition-colors font-medium"
  >
    Create Your First Group
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {groupWallets.map((group) => {
            const progress = calculateProgress(group.currentTotal, group.totalGoal);
            const isCompleted = group.status === "completed";
            const isCancelled = group.status === "cancelled";

            return (
              <Link
                key={group.id}
                href={`/wallet/groups/${group.id}`}
                className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow border border-neutral-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold text-neutral-900">
                        {group.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                        group.groupType === 'friends'
                          ? 'bg-primary-100 text-primary-700'
                          : group.groupType === 'family'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {group.groupType === 'friends' && <><Users className="h-3 w-3" /> Friends</>}
                        {group.groupType === 'family' && <><Heart className="h-3 w-3" /> Family</>}
                        {group.groupType === 'corporate' && <><Building2 className="h-3 w-3" /> Corporate</>}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500">
                      {group.members.length} member{group.members.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                       <Check className="h-4 w-4 inline" /> Completed
                      </span>
                    )}
                    {isCancelled && (
                      <span className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded-full text-sm font-medium">
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-neutral-900">
                      ${group.currentTotal.toFixed(2)}
                    </span>
                    <span className="text-sm text-neutral-500">
                      of ${group.totalGoal.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-neutral-500 mt-2">
                    {progress.toFixed(0)}% funded
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500">Members:</span>
                  <div className="flex -space-x-2">
                    {group.members.slice(0, 5).map((member, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full bg-primary-100 border-2 border-white flex items-center justify-center text-xs font-medium text-primary-700"
                        title={member.name}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {group.members.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-xs font-medium text-neutral-700">
                        +{group.members.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchGroupWallets();
          }}
        />
      )}
    </div>
  );
}

type EventOption = { id: string; title: string };

type MemberEntry = {
  userId: string;
  name: string;
  email: string;
  targetAmount: number;
  lookupStatus: "idle" | "looking_up" | "found" | "not_found";
};

function CreateGroupModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [eventId, setEventId] = useState("");
  const [events, setEvents] = useState<EventOption[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [groupType, setGroupType] = useState<'friends' | 'family' | 'corporate'>('friends');
  const [adminEmails, setAdminEmails] = useState<Array<{ email: string; userId: string; name: string }>>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminLookupStatus, setNewAdminLookupStatus] = useState<"idle" | "looking_up" | "found" | "not_found">("idle");
  const [permissions, setPermissions] = useState({
    allowMemberInvites: true,
    requireApproval: false,
    allowTargetChanges: true,
    allowMemberRemoval: false,
  });
  const [members, setMembers] = useState<MemberEntry[]>([
    { userId: "", name: "", email: "", targetAmount: 0, lookupStatus: "idle" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const lookupTimers = useRef<Record<number, NodeJS.Timeout>>({});
  const adminLookupTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setEventsLoading(true);
    try {
      const res = await fetch("/api/events?page_size=100&sort=-date");
      const data = await res.json();
      setEvents(data.events || []);
    } catch {
      /* ignore */
    } finally {
      setEventsLoading(false);
    }
  }

  async function lookupUserByEmail(email: string): Promise<{ id: string; display_name: string } | null> {
    try {
      const res = await fetch(`/api/users/lookup?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (data.success) {
        return { id: data.data.id, display_name: data.data.display_name };
      }
      return null;
    } catch {
      return null;
    }
  }

  const handleEmailChange = (index: number, email: string) => {
    const updated = [...members];
    updated[index] = { userId: "", name: "", email, targetAmount: updated[index].targetAmount, lookupStatus: "idle" };
    setMembers(updated);

    if (lookupTimers.current[index]) {
      clearTimeout(lookupTimers.current[index]);
    }

    if (!email.includes("@") || email.trim().length < 3) return;

    lookupTimers.current[index] = setTimeout(async () => {
      const m = [...members];
      m[index] = { ...m[index], lookupStatus: "looking_up" };
      setMembers([...m]);

      const user = await lookupUserByEmail(email);
      const m2 = [...members];
      m2[index] = {
        ...m2[index],
        email,
        userId: user?.id || "",
        name: user?.display_name || "",
        lookupStatus: user ? "found" : "not_found",
      };
      setMembers(m2);
    }, 600);
  };

  const addMember = () => {
    setMembers([...members, { userId: "", name: "", email: "", targetAmount: 0, lookupStatus: "idle" }]);
  };

  const removeMember = (index: number) => {
    if (lookupTimers.current[index]) {
      clearTimeout(lookupTimers.current[index]);
    }
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleAdminEmailChange = (email: string) => {
    setNewAdminEmail(email);
    setNewAdminLookupStatus("idle");

    if (adminLookupTimer.current) {
      clearTimeout(adminLookupTimer.current);
    }

    if (!email.includes("@") || email.trim().length < 3) return;

    adminLookupTimer.current = setTimeout(async () => {
      setNewAdminLookupStatus("looking_up");
      const user = await lookupUserByEmail(email);
      if (user) {
        setNewAdminLookupStatus("found");
      } else {
        setNewAdminLookupStatus("not_found");
      }
    }, 600);
  };

  const addAdmin = () => {
    if (newAdminEmail.trim() && !adminEmails.some((a) => a.email === newAdminEmail.trim())) {
      setAdminEmails([...adminEmails, { email: newAdminEmail.trim(), userId: "", name: "" }]);
      setNewAdminEmail("");
      setNewAdminLookupStatus("idle");
    }
  };

  const removeAdmin = (email: string) => {
    setAdminEmails(adminEmails.filter((a) => a.email !== email));
  };

  const handleGroupTypeChange = (type: 'friends' | 'family' | 'corporate') => {
    setGroupType(type);
    switch (type) {
      case 'friends':
        setPermissions({ allowMemberInvites: true, requireApproval: false, allowTargetChanges: true, allowMemberRemoval: false });
        break;
      case 'family':
        setPermissions({ allowMemberInvites: true, requireApproval: false, allowTargetChanges: true, allowMemberRemoval: true });
        break;
      case 'corporate':
        setPermissions({ allowMemberInvites: false, requireApproval: true, allowTargetChanges: false, allowMemberRemoval: true });
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Group name is required");
      return;
    }

    const validMembers = members.filter(
      (m) => m.userId && m.name && m.targetAmount > 0
    );

    if (validMembers.length === 0) {
      setError("At least one valid member with a resolved email is required");
      return;
    }

    const hasUnresolved = members.some((m) => m.email && m.lookupStatus === "not_found");
    if (hasUnresolved) {
      setError("One or more email addresses could not be found. Please check and try again.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/wallet/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          eventId: eventId || undefined,
          groupType,
          adminUserIds: adminEmails.length > 0 ? adminEmails.map((a) => a.userId).filter(Boolean) : undefined,
          permissions,
          members: validMembers.map((m) => ({ userId: m.userId, name: m.name, targetAmount: m.targetAmount })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        addToast("Group wallet created successfully!", { type: "success" });
        onSuccess();
      } else {
        const msg = data.error || "Failed to create group wallet";
        setError(msg);
        addToast(msg, { type: "error" });
      }
    } catch {
      const msg = "An error occurred. Please try again.";
      setError(msg);
      addToast(msg, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const lookupStatusIcon = (status: MemberEntry["lookupStatus"]) => {
    switch (status) {
      case "looking_up":
        return <Loader className="h-4 w-4 animate-spin text-neutral-400" />;
      case "found":
        return <Check className="h-4 w-4 text-emerald-500" />;
      case "not_found":
        return <X className="h-4 w-4 text-rose-500" />;
      default:
        return <Search className="h-4 w-4 text-neutral-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900">Create Group Wallet</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-rose-100 text-rose-700 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">Group Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900"
              placeholder="e.g., Tech Summit Group"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">Group Type *</label>
            <div className="grid grid-cols-3 gap-3">
              {(['friends', 'family', 'corporate'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleGroupTypeChange(type)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    groupType === type
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 bg-neutral-50'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    {type === 'friends' && <Users className="h-6 w-6 text-primary-600" />}
                    {type === 'family' && <Heart className="h-6 w-6 text-emerald-600" />}
                    {type === 'corporate' && <Building2 className="h-6 w-6 text-amber-600" />}
                  </div>
                  <div className="font-medium text-neutral-900 capitalize">{type}</div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {type === 'friends' && 'Equal targets, anyone can invite'}
                    {type === 'family' && 'Flexible targets, creator is admin'}
                    {type === 'corporate' && 'Multiple admins, approval workflow'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {groupType === 'corporate' && (
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Additional Admins (Optional)
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={newAdminEmail}
                      onChange={(e) => handleAdminEmailChange(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 text-sm pr-8"
                      placeholder="admin@email.com"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
                      {newAdminLookupStatus === "looking_up" ? (
                        <Loader className="h-4 w-4 animate-spin text-neutral-400" />
                      ) : newAdminLookupStatus === "found" ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : newAdminLookupStatus === "not_found" ? (
                        <X className="h-4 w-4 text-rose-500" />
) : null}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addAdmin}
                    className="px-4 py-2 bg-lime text-dark rounded-lg hover:bg-lime-hover transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
                {adminEmails.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {adminEmails.map((admin) => (
                      <div
                        key={admin.email}
                        className="flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                      >
                        <span>{admin.email}</span>
                        <button type="button" onClick={() => removeAdmin(admin.email)} className="hover:text-rose-500">
                          <X className="h-4 w-4 inline-block" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-3">Permissions</label>
            <div className="space-y-2 bg-neutral-50 p-4 rounded-lg">
              {([
                { key: 'allowMemberInvites' as const, label: 'Allow members to invite others' },
                { key: 'requireApproval' as const, label: 'Require admin approval for new members' },
                { key: 'allowTargetChanges' as const, label: 'Allow members to change their own targets' },
                { key: 'allowMemberRemoval' as const, label: 'Allow admins to remove members' },
              ]).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions[key]}
                    onChange={(e) => setPermissions({ ...permissions, [key]: e.target.checked })}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-900">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">Event (Optional)</label>
            <div className="relative">
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 appearance-none"
                disabled={eventsLoading}
              >
                <option value="">Select an event...</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
              {eventsLoading && (
                <div className="absolute inset-y-0 right-8 flex items-center">
                  <Loader className="h-4 w-4 animate-spin text-neutral-400" />
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-neutral-900">
                Members * {!permissions.allowTargetChanges && <span className="text-xs text-neutral-500">(Targets can be set by admins later)</span>}
              </label>
              <button type="button" onClick={addMember} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                + Add Member
              </button>
            </div>

            <div className="space-y-4">
              {members.map((member, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleEmailChange(index, e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 text-sm pr-8"
                        placeholder="member@email.com"
                        required
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
                        {lookupStatusIcon(member.lookupStatus)}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={member.targetAmount || ""}
                        onChange={(e) => {
                          const updated = [...members];
                          updated[index] = { ...updated[index], targetAmount: parseFloat(e.target.value) || 0 };
                          setMembers(updated);
                        }}
                        className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 text-sm"
                        placeholder="Target $"
                        min="0"
                        step="0.01"
                        required
                      />
                      {member.lookupStatus === "found" && member.name && (
                        <span className="text-xs text-emerald-600 font-medium whitespace-nowrap truncate max-w-[100px]">
                          {member.name}
                        </span>
                      )}
                    </div>
                  </div>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-neutral-50 text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <Button type="submit" loading={loading} fullWidth>
              Create Group
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
