"use client";
import { ArrowLeft, Banknote, Building2, Check, Heart, PartyPopper, Users, X, XCircle } from 'lucide-react';
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import GroupNotificationBell from "@/components/wallet/GroupNotificationBell";
import type { GroupWallet, GroupContribution } from "@/lib/store";

type ContributionStats = {
  memberStats: Array<{
    userId: string;
    userName: string;
    totalContributed: number;
    targetAmount: number;
    contributionCount: number;
    averageContribution: number;
    progressPercentage: number;
  }>;
  mostActiveContributor: {
    userId: string;
    userName: string;
    contributionCount: number;
  };
  totalContributions: number;
  averageContributionAmount: number;
};

export default function GroupWalletDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  const { addToast } = useToast();

  const [groupWallet, setGroupWallet] = useState<GroupWallet | null>(null);
  const [contributions, setContributions] = useState<GroupContribution[]>([]);
  const [stats, setStats] = useState<ContributionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    fetchGroupWallet();
    fetchContributions();
    fetchCurrentUser();
  }, [groupId]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.userId) {
        setUserId(data.userId);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchGroupWallet = async () => {
    try {
      const res = await fetch(`/api/wallet/groups/${groupId}`);
      const data = await res.json();
      if (data.success) {
        setGroupWallet(data.data);
      } else {
        console.error("Failed to fetch group wallet:", data.error);
      }
    } catch (error) {
      console.error("Error fetching group wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContributions = async () => {
    try {
      const res = await fetch(`/api/wallet/groups/${groupId}/contributions`);
      const data = await res.json();
      if (data.success) {
        setContributions(data.data.contributions);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error("Error fetching contributions:", error);
    }
  };

  const handleSendReminders = async () => {
    try {
      const res = await fetch(`/api/wallet/groups/${groupId}/send-reminders`, {
        method: "POST",
      });
      const data = await res.json();
      
      if (data.success) {
        addToast(
          `Sent ${data.data.remindersSent} reminder${data.data.remindersSent !== 1 ? 's' : ''} to members`,
          { type: "success", duration: 5000 }
        );
      } else {
        addToast(data.error || "Failed to send reminders", { type: "error" });
      }
    } catch (error) {
      console.error("Error sending reminders:", error);
      addToast("An error occurred while sending reminders", { type: "error" });
    }
  };

  const getRelativeTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const calculateProgress = (current: number, goal: number) => {
    return goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-neutral-200 rounded w-1/3" />
        <div className="h-64 bg-neutral-100 rounded-xl" />
        <div className="h-96 bg-neutral-100 rounded-xl" />
      </div>
    );
  }

  if (!groupWallet) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-neutral-200">
        <div className="text-6xl mb-4"><XCircle className="h-4 w-4 inline-block" /></div>
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
          Group wallet not found
        </h3>
        <Link
          href="/wallet/groups"
          className="inline-block mt-4 px-6 py-3 bg-lime text-dark rounded-lg hover:bg-lime-hover transition-colors font-medium"
        >
          Back to Group Wallets
        </Link>
      </div>
    );
  }

  const progress = calculateProgress(groupWallet.currentTotal, groupWallet.totalGoal);
  const isCompleted = groupWallet.status === "completed";
  const isCancelled = groupWallet.status === "cancelled";
  const isCreator = groupWallet.createdBy === userId;
  const currentMember = groupWallet.members.find((m) => m.userId === userId);

  return (
    <div>
      {/* Back Button */}
      <Link
        href="/wallet/groups"
        className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-6 transition-colors"
      >
        <span><ArrowLeft className="h-4 w-4 inline-block" /></span> Back to Group Wallets
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-xl p-8 mb-6 border border-neutral-200">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-neutral-900">{groupWallet.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1.5 ${
                groupWallet.groupType === 'friends'
                  ? 'bg-primary-100 text-primary-700'
                  : groupWallet.groupType === 'family'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {groupWallet.groupType === 'friends' && <><Users className="h-3.5 w-3.5" /> Friends</>}
                {groupWallet.groupType === 'family' && <><Heart className="h-3.5 w-3.5" /> Family</>}
                {groupWallet.groupType === 'corporate' && <><Building2 className="h-3.5 w-3.5" /> Corporate</>}
              </span>
            </div>
            <p className="text-neutral-500">
              {groupWallet.members.length} member{groupWallet.members.length !== 1 ? "s" : ""}
              {isCreator && " • You are the creator"}
              {groupWallet.adminUserIds.includes(userId) && !isCreator && " • You are an admin"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <GroupNotificationBell groupWalletId={groupId} />
            {isCompleted && (
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">✓ Goal Reached</span>
            )}
            {isCancelled && (
              <span className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-full text-sm font-medium">Cancelled</span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-4xl font-bold text-neutral-900">${groupWallet.currentTotal.toFixed(2)}</span>
            <span className="text-lg text-neutral-500">of ${groupWallet.totalGoal.toFixed(2)}</span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-neutral-500 mt-2">{progress.toFixed(1)}% of goal reached</p>
        </div>

        {currentMember && !isCancelled && (
          <button onClick={() => setShowContributeModal(true)} className="w-full px-6 py-4 bg-lime text-dark rounded-lg hover:bg-lime-hover transition-colors font-medium text-lg">
            Contribute to Group
          </button>
        )}
        {isCreator && !isCancelled && (
          <button onClick={handleSendReminders} className="w-full mt-3 px-6 py-3 bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors font-medium">
            Send Reminders to Members
          </button>
        )}
      </div>

      {/* Admin Controls */}
      {groupWallet.adminUserIds.includes(userId) && !isCancelled && (
        <div className="bg-white rounded-xl p-8 border border-neutral-200 mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Admin Controls</h2>
          <p className="text-sm text-neutral-500 mb-6">As an admin, you can manage members and group settings</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {groupWallet.permissions.requireApproval && (
              <button className="px-4 py-3 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-medium text-sm">Review Pending Members</button>
            )}
            {groupWallet.permissions.allowMemberRemoval && (
              <button className="px-4 py-3 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors font-medium text-sm">Remove Member</button>
            )}
            {!groupWallet.permissions.allowTargetChanges && (
              <button className="px-4 py-3 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-medium text-sm">Set Member Targets</button>
            )}
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to mark this group as completed?')) {
                  try {
                    const res = await fetch(`/api/wallet/groups/${groupId}/admin`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ action: 'complete_early' }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      addToast('Group marked as completed', { type: 'success' });
                      fetchGroupWallet();
                    } else {
                      addToast(data.error || 'Failed to complete group', { type: 'error' });
                    }
                  } catch { addToast('An error occurred', { type: 'error' }); }
                }
              }}
              className="px-4 py-3 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors font-medium text-sm"
            >
              Complete Group Early
            </button>
          </div>

          <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
            <h3 className="font-semibold text-neutral-900 mb-3 text-sm">Group Permissions</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { key: 'allowMemberInvites' as const, label: 'Member invites' },
                { key: 'requireApproval' as const, label: 'Require approval' },
                { key: 'allowTargetChanges' as const, label: 'Self-set targets' },
                { key: 'allowMemberRemoval' as const, label: 'Member removal' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={groupWallet.permissions[key] ? 'text-emerald-600' : 'text-neutral-500'}>
                    {groupWallet.permissions[key] ? <Check className="h-4 w-4 inline-block" /> : <X className="h-4 w-4 inline-block" />}
                  </span>
                  <span className="text-neutral-500">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {groupWallet.adminUserIds.length > 1 && (
            <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
              <h3 className="font-semibold text-neutral-900 mb-2 text-sm">Group Admins</h3>
              <div className="flex flex-wrap gap-2">
                {groupWallet.adminUserIds.map((adminId) => {
                  const adminMember = groupWallet.members.find(m => m.userId === adminId);
                  return (
                    <span key={adminId} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                      {adminMember?.name || adminId}
                      {adminId === groupWallet.createdBy && ' (Creator)'}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Members List */}
      <div className="bg-white rounded-xl p-8 border border-neutral-200 mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Members</h2>
        <div className="space-y-4">
          {groupWallet.members.map((member, index) => {
            const memberProgress = calculateProgress(member.currentAmount, member.targetAmount);
            const isCurrentUser = member.userId === userId;
            const percentOfTotal = groupWallet.totalGoal > 0
              ? (member.targetAmount / groupWallet.totalGoal) * 100
              : 0;

            return (
              <div key={index} className={`p-4 rounded-lg border ${
                member.status === 'pending' ? 'bg-amber-50 border-amber-200' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-lg font-bold text-primary-700">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-neutral-900">
                          {member.name}
                          {isCurrentUser && <span className="ml-2 text-sm text-primary-600">(You)</span>}
                        </h3>
                        {member.status === 'pending' && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">Pending Approval</span>
                        )}
                        {groupWallet.adminUserIds.includes(member.userId) && (
                          <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-medium">Admin</span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500">
                        Target: ${member.targetAmount.toFixed(2)} ({percentOfTotal.toFixed(1)}% of total)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-neutral-900">${member.currentAmount.toFixed(2)}</p>
                    <p className="text-sm text-neutral-500">{memberProgress.toFixed(0)}% of personal target</p>
                  </div>
                </div>

                <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-primary-500 transition-all duration-500 rounded-full" style={{ width: `${memberProgress}%` }} />
                </div>

                {groupWallet.adminUserIds.includes(userId) && member.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/wallet/groups/${groupId}/admin`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'approve_member', targetUserId: member.userId }),
                          });
                          const data = await res.json();
                          if (data.success) {
                            addToast(`${member.name} approved`, { type: 'success' });
                            fetchGroupWallet();
                          } else addToast(data.error || 'Failed to approve member', { type: 'error' });
                        } catch { addToast('An error occurred', { type: 'error' }); }
                      }}
                      className="flex-1 px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
                    >
                      Approve
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Reject ${member.name}'s membership?`)) {
                          try {
                            const res = await fetch(`/api/wallet/groups/${groupId}/admin`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ action: 'reject_member', targetUserId: member.userId }),
                            });
                            const data = await res.json();
                            if (data.success) {
                              addToast(`${member.name} rejected`, { type: 'success' });
                              fetchGroupWallet();
                            } else addToast(data.error || 'Failed to reject member', { type: 'error' });
                          } catch { addToast('An error occurred', { type: 'error' }); }
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors text-sm font-medium"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contribution Analytics */}
      {stats && (
        <div className="bg-white rounded-xl p-8 border border-neutral-200 mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Contribution Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-500 mb-1">Total Contributions</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.totalContributions}</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-500 mb-1">Average Amount</p>
              <p className="text-2xl font-bold text-neutral-900">${stats.averageContributionAmount.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-500 mb-1">Most Active</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.mostActiveContributor.userName}</p>
              <p className="text-xs text-neutral-500">{stats.mostActiveContributor.contributionCount} contribution{stats.mostActiveContributor.contributionCount !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-neutral-900 mb-3">Member Breakdown</h3>
            {stats.memberStats.map((memberStat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700">
                    {memberStat.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{memberStat.userName}</p>
                    <p className="text-xs text-neutral-500">
                      {memberStat.contributionCount} contribution{memberStat.contributionCount !== 1 ? 's' : ''} • Avg: ${memberStat.averageContribution.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neutral-900">${memberStat.totalContributed.toFixed(2)}</p>
                  <p className="text-xs text-neutral-500">{memberStat.progressPercentage.toFixed(0)}% of target</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Feed */}
      <div className="bg-white rounded-xl p-8 border border-neutral-200 mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Activity Feed</h2>
        {contributions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4"><Banknote className="h-4 w-4 inline-block" /></div>
            <p className="text-neutral-500">No contributions yet</p>
            <p className="text-sm text-neutral-500 mt-2">Be the first to contribute to this group wallet!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contributions.slice(0, 10).map((contribution) => {
              const isMilestone =
                (groupWallet.currentTotal >= groupWallet.totalGoal * 0.25 &&
                 groupWallet.currentTotal - contribution.amount < groupWallet.totalGoal * 0.25) ||
                (groupWallet.currentTotal >= groupWallet.totalGoal * 0.5 &&
                 groupWallet.currentTotal - contribution.amount < groupWallet.totalGoal * 0.5) ||
                (groupWallet.currentTotal >= groupWallet.totalGoal * 0.75 &&
                 groupWallet.currentTotal - contribution.amount < groupWallet.totalGoal * 0.75) ||
                (groupWallet.currentTotal >= groupWallet.totalGoal &&
                 groupWallet.currentTotal - contribution.amount < groupWallet.totalGoal);

              return (
                <div key={contribution.id} className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                  isMilestone ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-neutral-50 border border-neutral-200'
                }`}>
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-lg font-bold text-primary-700 flex-shrink-0">
                    {contribution.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-neutral-900">
                          <span className="font-semibold">{contribution.userName}</span> contributed{" "}
                          <span className="font-bold text-emerald-600">${contribution.amount.toFixed(2)}</span>
                        </p>
                        {isMilestone && (
                          <p className="text-sm text-emerald-700 mt-1 flex items-center gap-1"><PartyPopper className="h-4 w-4" /> Milestone reached!</p>
                        )}
                      </div>
                      <span className="text-sm text-neutral-500 whitespace-nowrap">{getRelativeTime(contribution.timestamp)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {contributions.length > 10 && (
              <p className="text-center text-sm text-neutral-500 pt-4">Showing 10 most recent contributions of {contributions.length} total</p>
            )}
          </div>
        )}
      </div>

      {/* Group Info */}
      <div className="bg-white rounded-xl p-6 border border-neutral-200">
        <h3 className="font-semibold text-neutral-900 mb-4">Group Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Created:</span>
            <span className="text-neutral-900">{new Date(groupWallet.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Last Updated:</span>
            <span className="text-neutral-900">{new Date(groupWallet.updatedAt).toLocaleDateString()}</span>
          </div>
          {groupWallet.eventId && (
            <div className="flex justify-between">
              <span className="text-neutral-500">Event ID:</span>
              <span className="text-neutral-900 font-mono text-xs">{groupWallet.eventId}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-neutral-500">Status:</span>
            <span className="text-neutral-900 capitalize">{groupWallet.status}</span>
          </div>
        </div>
      </div>

      {/* Contribute Modal */}
      {showContributeModal && currentMember && (
        <ContributeModal
          groupId={groupId}
          memberName={currentMember.name}
          currentAmount={currentMember.currentAmount}
          targetAmount={currentMember.targetAmount}
          onClose={() => setShowContributeModal(false)}
          onSuccess={(amount: number) => {
            setShowContributeModal(false);
            fetchGroupWallet();
            fetchContributions();
            addToast(`Successfully contributed $${amount.toFixed(2)} to ${groupWallet.name}`, { type: "success", duration: 5000 });
          }}
        />
      )}
    </div>
  );
}

function ContributeModal({
  groupId,
  memberName,
  currentAmount,
  targetAmount,
  onClose,
  onSuccess,
}: {
  groupId: string;
  memberName: string;
  currentAmount: number;
  targetAmount: number;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}) {
  const { addToast } = useToast();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const remaining = Math.max(0, targetAmount - currentAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const contributionAmount = parseFloat(amount);

    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      const msg = "Please enter a valid amount";
      setError(msg);
      addToast(msg, { type: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/wallet/groups/${groupId}/contribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: contributionAmount }),
      });

      const data = await res.json();

      if (data.success) {
        addToast(`Contributed $${contributionAmount.toFixed(2)} successfully!`, { type: "success" });
        onSuccess(contributionAmount);
      } else {
        const msg = data.error || "Failed to contribute";
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900">Contribute</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-rose-100 text-rose-700 rounded-lg text-sm">{error}</div>
          )}

          <div className="bg-neutral-50 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-neutral-500">Your Progress</span>
              <span className="text-sm font-medium text-neutral-900">
                ${currentAmount.toFixed(2)} / ${targetAmount.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-2 overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.min((currentAmount / targetAmount) * 100, 100)}%` }} />
            </div>
            {remaining > 0 && (
              <p className="text-sm text-neutral-500 mt-2">${remaining.toFixed(2)} remaining to reach your target</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">Contribution Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 text-lg"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
            {remaining > 0 && (
              <button type="button" onClick={() => setAmount(remaining.toFixed(2))} className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
                Contribute remaining ${remaining.toFixed(2)}
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 bg-neutral-50 text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors font-medium">
              Cancel
            </button>
            <Button type="submit" loading={loading} fullWidth>
              Contribute
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
