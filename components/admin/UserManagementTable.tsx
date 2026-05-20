"use client";
import React from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { UserRoleSelector } from "./UserRoleSelector";
import { UserStatusBadge } from "./UserStatusBadge";

interface AdminUser {
  id: string;
  email: string;
  displayName?: string;
  role: 'attendee' | 'organizer' | 'vendor' | 'admin';
  status: 'active' | 'suspended' | 'pending' | 'banned';
  createdAt: number;
  lastActivityAt?: number;
  eventsCreated?: number;
  eventsAttended?: number;
  totalSpent?: number;
  walletBalance?: number;
  profileCompleteness?: number;
  location?: {
    city: string;
    country: string;
  };
}

interface UserManagementTableProps {
  users: AdminUser[];
  loading: boolean;
  onUserUpdate: (userId: string, updates: { role?: string; status?: string }) => void;
}

export function UserManagementTable({ users, loading, onUserUpdate }: UserManagementTableProps) {
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(null);
  const [showUserDetails, setShowUserDetails] = React.useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewDetails = (user: AdminUser) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--surface-bg)] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-8 text-center">
        <Icon name="users" size={48} className="mx-auto text-[var(--foreground-muted)] mb-4" />
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
          No users found
        </h3>
        <p className="text-[var(--foreground-muted)]">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--surface-border)]">
              <th className="text-left py-4 px-6 text-sm font-semibold text-[var(--foreground)]">
                User
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-[var(--foreground)]">
                Role
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-[var(--foreground)]">
                Status
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-[var(--foreground)]">
                Activity
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-[var(--foreground)]">
                Stats
              </th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-[var(--foreground)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[var(--surface-border)] hover:bg-[var(--surface-hover)] transition-colors"
              >
                {/* User Info */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary-600">
                        {(user.displayName || user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--foreground)]">
                        {user.displayName || 'No name'}
                      </div>
                      <div className="text-sm text-[var(--foreground-muted)]">
                        {user.email}
                      </div>
                      {user.location && (
                        <div className="text-xs text-[var(--foreground-muted)]">
                          {user.location.city}, {user.location.country}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="py-4 px-6">
                  <UserRoleSelector
                    currentRole={user.role}
                    userId={user.id}
                    onRoleChange={(role) => onUserUpdate(user.id, { role })}
                  />
                </td>

                {/* Status */}
                <td className="py-4 px-6">
                  <UserStatusBadge
                    status={user.status}
                    userId={user.id}
                    onStatusChange={(status) => onUserUpdate(user.id, { status })}
                  />
                </td>

                {/* Activity */}
                <td className="py-4 px-6">
                  <div className="text-sm">
                    <div className="text-[var(--foreground)]">
                      Joined {formatDate(user.createdAt)}
                    </div>
                    {user.lastActivityAt && (
                      <div className="text-[var(--foreground-muted)]">
                        Last active {formatDate(user.lastActivityAt)}
                      </div>
                    )}
                  </div>
                </td>

                {/* Stats */}
                <td className="py-4 px-6">
                  <div className="text-sm space-y-1">
                    {user.role === 'organizer' && (
                      <div className="text-[var(--foreground)]">
                        {user.eventsCreated || 0} events created
                      </div>
                    )}
                    {user.role === 'attendee' && (
                      <div className="text-[var(--foreground)]">
                        {user.eventsAttended || 0} events attended
                      </div>
                    )}
                    {user.totalSpent && user.totalSpent > 0 && (
                      <div className="text-[var(--foreground-muted)]">
                        {formatCurrency(user.totalSpent)} spent
                      </div>
                    )}
                    {user.profileCompleteness && (
                      <div className="text-[var(--foreground-muted)]">
                        {user.profileCompleteness}% profile complete
                      </div>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(user)}
                  >
                    <Icon name="eye" size={16} />
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => {
            setShowUserDetails(false);
            setSelectedUser(null);
          }}
        />
      )}
    </>
  );
}

// User Details Modal Component
function UserDetailsModal({ 
  user, 
  onClose 
}: { 
  user: AdminUser; 
  onClose: () => void; 
}) {
  const [activityStats, setActivityStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/admin/users/${user.id}`);
        const data = await response.json();
        if (data.success) {
          setActivityStats(data.data.activityStats);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--surface-card)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--surface-border)]">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            User Details
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="x" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[var(--foreground-muted)]">
                  Display Name
                </label>
                <p className="text-[var(--foreground)]">
                  {user.displayName || 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--foreground-muted)]">
                  Email
                </label>
                <p className="text-[var(--foreground)]">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--foreground-muted)]">
                  Role
                </label>
                <p className="text-[var(--foreground)] capitalize">{user.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--foreground-muted)]">
                  Status
                </label>
                <p className="text-[var(--foreground)] capitalize">{user.status}</p>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          {loading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-[var(--surface-bg)] rounded mb-2" />
              <div className="h-20 bg-[var(--surface-bg)] rounded" />
            </div>
          ) : activityStats ? (
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Activity Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[var(--foreground-muted)]">
                    Total Orders
                  </label>
                  <p className="text-[var(--foreground)]">
                    {activityStats.totalOrders}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--foreground-muted)]">
                    Total Spent
                  </label>
                  <p className="text-[var(--foreground)]">
                    {formatCurrency(activityStats.totalSpent)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--foreground-muted)]">
                    Events Created
                  </label>
                  <p className="text-[var(--foreground)]">
                    {activityStats.eventsCreated}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--foreground-muted)]">
                    Events Attended
                  </label>
                  <p className="text-[var(--foreground)]">
                    {activityStats.eventsAttended}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--foreground-muted)]">
                    Wallet Transactions
                  </label>
                  <p className="text-[var(--foreground)]">
                    {activityStats.walletTransactions}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--foreground-muted)]">
                    Last Activity
                  </label>
                  <p className="text-[var(--foreground)]">
                    {activityStats.lastActivity 
                      ? new Date(activityStats.lastActivity).toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}