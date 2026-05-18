"use client";
import { Check, Users, X } from 'lucide-react';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GroupNotificationBell from "@/components/wallet/GroupNotificationBell";
import type { GroupWallet } from "@/lib/store";

export default function GroupWalletsPage() {
  const router = useRouter();
  const [groupWallets, setGroupWallets] = useState<GroupWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Create Group
          </button>
        </div>
      </div>

      {groupWallets.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-neutral-200">
          <div className="text-6xl mb-4"><Users className="h-4 w-4 inline-block" /></div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            No group wallets yet
          </h3>
          <p className="text-neutral-500 mb-6">
            Create a group wallet to save together with friends and family
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
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
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        group.groupType === 'friends'
                          ? 'bg-primary-100 text-primary-700'
                          : group.groupType === 'family'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {group.groupType === 'friends' && '<Users className="h-4 w-4 inline-block" />'}
                        {group.groupType === 'family' && '👨‍👩‍👧‍👦'}
                        {group.groupType === 'corporate' && '🏢'}
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

function CreateGroupModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [eventId, setEventId] = useState("");
  const [groupType, setGroupType] = useState<'friends' | 'family' | 'corporate'>('friends');
  const [adminUserIds, setAdminUserIds] = useState<string[]>([]);
  const [newAdminId, setNewAdminId] = useState("");
  const [permissions, setPermissions] = useState({
    allowMemberInvites: true,
    requireApproval: false,
    allowTargetChanges: true,
    allowMemberRemoval: false,
  });
  const [members, setMembers] = useState<Array<{ userId: string; name: string; targetAmount: number }>>([
    { userId: "", name: "", targetAmount: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update permissions when group type changes
  const handleGroupTypeChange = (type: 'friends' | 'family' | 'corporate') => {
    setGroupType(type);
    
    // Set default permissions based on group type
    switch (type) {
      case 'friends':
        setPermissions({
          allowMemberInvites: true,
          requireApproval: false,
          allowTargetChanges: true,
          allowMemberRemoval: false,
        });
        break;
      case 'family':
        setPermissions({
          allowMemberInvites: true,
          requireApproval: false,
          allowTargetChanges: true,
          allowMemberRemoval: true,
        });
        break;
      case 'corporate':
        setPermissions({
          allowMemberInvites: false,
          requireApproval: true,
          allowTargetChanges: false,
          allowMemberRemoval: true,
        });
        break;
    }
  };

  const addMember = () => {
    setMembers([...members, { userId: "", name: "", targetAmount: 0 }]);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: string, value: string | number) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const addAdmin = () => {
    if (newAdminId.trim() && !adminUserIds.includes(newAdminId.trim())) {
      setAdminUserIds([...adminUserIds, newAdminId.trim()]);
      setNewAdminId("");
    }
  };

  const removeAdmin = (adminId: string) => {
    setAdminUserIds(adminUserIds.filter(id => id !== adminId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Group name is required");
      return;
    }

    const validMembers = members.filter(
      (m) => m.userId.trim() && m.name.trim() && m.targetAmount > 0
    );

    if (validMembers.length === 0) {
      setError("At least one valid member is required");
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
          adminUserIds: adminUserIds.length > 0 ? adminUserIds : undefined,
          permissions,
          members: validMembers,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.error || "Failed to create group wallet");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
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
            <div className="p-4 bg-rose-100 text-rose-700 rounded-lg text-sm">
              {error}
            </div>
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
                  <div className="text-2xl mb-2">
                    {type === 'friends' && '<Users className="h-4 w-4 inline-block" />'}
                    {type === 'family' && '👨‍👩‍👧‍👦'}
                    {type === 'corporate' && '🏢'}
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
                  <input
                    type="text"
                    value={newAdminId}
                    onChange={(e) => setNewAdminId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 text-sm"
                    placeholder="User ID"
                  />
                  <button
                    type="button"
                    onClick={addAdmin}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
                {adminUserIds.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {adminUserIds.map((adminId) => (
                      <div
                        key={adminId}
                        className="flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                      >
                        <span>{adminId}</span>
                        <button type="button" onClick={() => removeAdmin(adminId)} className="hover:text-rose-500">
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
                { key: 'allowMemberInvites', label: 'Allow members to invite others' },
                { key: 'requireApproval', label: 'Require admin approval for new members' },
                { key: 'allowTargetChanges', label: 'Allow members to change their own targets' },
                { key: 'allowMemberRemoval', label: 'Allow admins to remove members' },
              ] as const).map(({ key, label }) => (
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
            <label className="block text-sm font-medium text-neutral-900 mb-2">Event ID (Optional)</label>
            <input
              type="text"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900"
              placeholder="evt-xxx"
            />
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
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={member.userId}
                      onChange={(e) => updateMember(index, "userId", e.target.value)}
                      className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 text-sm"
                      placeholder="User ID"
                    />
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateMember(index, "name", e.target.value)}
                      className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 text-sm"
                      placeholder="Name"
                    />
                    <input
                      type="number"
                      value={member.targetAmount || ""}
                      onChange={(e) => updateMember(index, "targetAmount", parseFloat(e.target.value) || 0)}
                      className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 text-sm"
                      placeholder="Target $"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4 inline-block" />
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
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
