"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import RoleSelector from "./RoleSelector";

interface TeamMember {
  userId: string;
  eventId: string;
  role: "owner" | "editor" | "viewer";
  displayName: string;
  avatar?: string;
  joinedAt: number;
}

interface TeamInvitation {
  id: string;
  email: string;
  role: "owner" | "editor" | "viewer";
  status: "pending" | "accepted" | "declined" | "expired";
  createdAt: number;
  expiresAt: number;
}

interface TeamMemberListProps {
  eventId: string;
  showInvitations?: boolean;
}

export function TeamMemberList({ eventId, showInvitations = false }: TeamMemberListProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingMember, setUpdatingMember] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [eventId, showInvitations]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (showInvitations) {
        const res = await fetch(`/api/events/${eventId}/team/invitations?status=pending`);
        const data = await res.json();
        if (data.success) {
          setInvitations(data.data);
        }
      } else {
        const res = await fetch(`/api/events/${eventId}/team`);
        const data = await res.json();
        if (data.success) {
          setMembers(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingMember(userId);
    try {
      const res = await fetch(`/api/events/${eventId}/team/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local state
        setMembers((prev) =>
          prev.map((m) =>
            m.userId === userId ? { ...m, role: newRole as any } : m
          )
        );
      } else {
        alert(data.error || "Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role");
    } finally {
      setUpdatingMember(null);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) {
      return;
    }

    try {
      const res = await fetch(`/api/events/${eventId}/team/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setMembers((prev) => prev.filter((m) => m.userId !== userId));
      } else {
        alert(data.error || "Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      alert("Failed to remove member");
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300";
      case "editor":
        return "bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300";
      case "viewer":
        return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300";
      case "accepted":
        return "bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300";
      case "declined":
        return "bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300";
      case "expired":
        return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  if (loading) {
    return (
      <Card padding="lg">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (showInvitations) {
    return (
      <div className="space-y-3">
        {invitations.length === 0 ? (
          <Card padding="lg">
            <p className="text-center text-foreground-muted py-8">
              No pending invitations
            </p>
          </Card>
        ) : (
          invitations.map((invitation) => (
            <Card key={invitation.id} padding="md" hoverable>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 dark:text-primary-300 font-semibold">
                        {invitation.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{invitation.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleBadgeColor(
                            invitation.role
                          )}`}
                        >
                          {invitation.role}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusBadgeColor(
                            invitation.status
                          )}`}
                        >
                          {invitation.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-foreground-muted">
                  Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.length === 0 ? (
        <Card padding="lg">
          <p className="text-center text-foreground-muted py-8">
            No team members yet. Invite someone to collaborate!
          </p>
        </Card>
      ) : (
        members.map((member) => (
          <Card key={member.userId} padding="md" hoverable>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 dark:text-primary-300 font-semibold text-lg">
                      {member.displayName[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-foreground">{member.displayName}</p>
                  <p className="text-sm text-foreground-muted">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RoleSelector
                  currentRole={member.role}
                  onChange={(newRole) => handleRoleChange(member.userId, newRole)}
                  disabled={updatingMember === member.userId}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member.userId)}
                  disabled={updatingMember === member.userId}
                >
                  Remove
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}


export default TeamMemberList;
