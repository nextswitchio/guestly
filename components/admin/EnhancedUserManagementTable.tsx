"use client";
import React, { useState, useMemo } from "react";
import DataTable, { DataTableColumn, DataTableAction, DataTableBulkAction } from "@/components/ui/DataTable";
import { UserRoleSelector } from "./UserRoleSelector";
import { UserStatusBadge } from "./UserStatusBadge";
import { DataTableFormatters, DataTableExporter } from "@/lib/utils/dataTableUtils";
import { useDataTable } from "@/lib/hooks/useDataTable";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Icon from "@/components/ui/Icon";

interface AdminUser {
  id: string;
  email: string;
  displayName?: string;
  role: 'attendee' | 'organizer' | 'organiser' | 'vendor' | 'admin' | 'affiliate' | 'influencer';
  status: 'active' | 'suspended' | 'pending' | 'banned';
  createdAt: number;
  lastActivityAt?: number;
  eventsCreated?: number;
  eventsAttended?: number;
  totalSpent?: number;
  walletBalance?: number;
  profileCompleteness?: number;
  hasVirtualAccount?: boolean;
  virtualAccountNumber?: string;
  isVerified?: boolean;
  location?: {
    city: string;
    country: string;
  };
}

interface EnhancedUserManagementTableProps {
  users: AdminUser[];
  loading: boolean;
  onUserUpdate: (userId: string, updates: { role?: string; status?: string }) => void;
  onBulkUpdate?: (userIds: string[], updates: { role?: string; status?: string }) => void;
  onUserDelete?: (userId: string) => void;
  onBulkDelete?: (userIds: string[]) => void;
  onGenerateVirtualAccount?: (userId: string) => void;
}

export function EnhancedUserManagementTable({ 
  users, 
  loading, 
  onUserUpdate,
  onBulkUpdate,
  onUserDelete,
  onBulkDelete,
  onGenerateVirtualAccount
}: EnhancedUserManagementTableProps) {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showBulkRoleModal, setShowBulkRoleModal] = useState(false);
  const [showBulkStatusModal, setShowBulkStatusModal] = useState(false);
  const [bulkRole, setBulkRole] = useState<string>('');
  const [bulkStatus, setBulkStatus] = useState<string>('');

  // Use the DataTable hook for state management
  const {
    page,
    pageSize,
    totalPages,
    setPage,
    setPageSize,
    sortKey,
    sortDirection,
    handleSort,
    searchValue,
    setSearchValue,
    selectedRows,
    setSelectedRows,
    selectAll,
    clearSelection,
    isAllSelected,
    isPartiallySelected,
    filteredData,
    paginatedData,
    selectedData,
    totalItems,
    startIndex,
    endIndex,
  } = useDataTable({
    data: users,
    defaultPageSize: 20,
    defaultSort: { key: 'createdAt', direction: 'desc' },
    searchFields: ['email', 'displayName'],
  });

  // Define table columns
  const columns: DataTableColumn<AdminUser>[] = useMemo(() => [
    {
      key: 'displayName',
      header: 'User',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-600">
              {(row.displayName || row.email).charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-slate-900">
              {row.displayName || 'No name'}
            </div>
            <div className="text-sm text-slate-500">
              {row.email}
            </div>
            {row.location && (
              <div className="text-xs text-slate-500">
                {row.location.city}, {row.location.country}
              </div>
            )}
          </div>
        </div>
      ),
      exportRender: (value, row) => `${row.displayName || 'No name'} (${row.email})`,
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (value, row) => (
        <UserRoleSelector
          currentRole={row.role}
          userId={row.id}
          onRoleChange={(role) => onUserUpdate(row.id, { role })}
        />
      ),
      exportRender: (value) => String(value),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value, row) => (
        <UserStatusBadge
          status={row.status}
          userId={row.id}
          onStatusChange={(status) => onUserUpdate(row.id, { status })}
        />
      ),
      exportRender: (value) => String(value),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      sortable: true,
      render: (value) => (
        <div className="text-sm">
          <div className="text-slate-900">
            {value && typeof value === 'number' ? DataTableFormatters.date(value) : '-'}
          </div>
        </div>
      ),
      exportRender: (value) => value && typeof value === 'number' ? DataTableFormatters.date(value) : '-',
    },
    {
      key: 'lastActivityAt',
      header: 'Last Activity',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-slate-500">
          {value && typeof value === 'number' ? DataTableFormatters.date(value) : 'Never'}
        </div>
      ),
      exportRender: (value) => value && typeof value === 'number' ? DataTableFormatters.date(value) : 'Never',
    },
    {
      key: 'eventsCreated',
      header: 'Events',
      sortable: true,
      align: 'center',
      render: (value, row) => (
        <div className="text-sm text-center">
          {row.role === 'organizer' && (
            <div className="text-slate-900">
              {row.eventsCreated || 0} created
            </div>
          )}
          {row.role === 'attendee' && (
            <div className="text-slate-900">
              {row.eventsAttended || 0} attended
            </div>
          )}
          {(row.role === 'vendor' || row.role === 'admin') && (
            <div className="text-slate-500">—</div>
          )}
        </div>
      ),
      exportRender: (value, row) => {
        if (row.role === 'organizer') return String(row.eventsCreated || 0);
        if (row.role === 'attendee') return String(row.eventsAttended || 0);
        return '—';
      },
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      sortable: true,
      align: 'right',
      render: (value) => (
        <div className="text-sm text-right">
          {value && typeof value === 'number' && value > 0 ? (
            <span className="text-slate-900">
              {formatCurrency(value)}
            </span>
          ) : (
            <span className="text-slate-500">{formatCurrency(0)}</span>
          )}
        </div>
      ),
      exportRender: (value) => value && typeof value === 'number' ? formatCurrency(value) : formatCurrency(0),
    },
    {
      key: 'profileCompleteness',
      header: 'Profile',
      sortable: true,
      align: 'center',
      render: (value) => (
        <div className="text-sm text-center">
          {value && typeof value === 'number' ? (
            <div className="flex items-center gap-2">
              <div className="w-12 bg-neutral-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all"
                  style={{ width: `${value}%` }}
                />
              </div>
              <span className="text-xs text-slate-500">
                {value}%
              </span>
            </div>
          ) : (
            <span className="text-slate-500">—</span>
          )}
        </div>
      ),
      exportRender: (value) => value && typeof value === 'number' ? `${value}%` : '—',
    },
    {
      key: 'hasVirtualAccount',
      header: 'Virtual Account',
      sortable: false,
      align: 'center',
      render: (value, row) => (
        <div className="text-sm text-center">
          {row.hasVirtualAccount ? (
            <span className="text-lime-600 font-medium">✓ Yes</span>
          ) : row.isVerified ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Generate virtual bank account for ${row.displayName || row.email}?`)) {
                  onGenerateVirtualAccount?.(row.id);
                }
              }}
              className="text-sm bg-lime/10 text-lime-700 px-2 py-1 rounded-md hover:bg-lime/20 transition-colors"
            >
              Generate
            </button>
          ) : (
            <span className="text-neutral-400 text-xs">Requires Verification</span>
          )}
        </div>
      ),
      exportRender: (value, row) => row.hasVirtualAccount ? 'Yes' : 'No',
    },
  ], [onUserUpdate, onGenerateVirtualAccount]);

  // Define row actions
  const actions: DataTableAction<AdminUser>[] = useMemo(() => [
    {
      label: 'View Details',
      icon: 'eye',
      variant: 'ghost',
      onClick: (user) => {
        setSelectedUser(user);
        setShowUserDetails(true);
      },
    },
    {
      label: 'Delete',
      icon: 'trash-2',
      variant: 'danger',
      onClick: (user) => {
        if (window.confirm(`Are you sure you want to delete ${user.displayName || user.email}?`)) {
          onUserDelete?.(user.id);
        }
      },
      hidden: (user) => user.role === 'admin', // Don't allow deleting admins
      disabled: (user) => user.status === 'banned', // Already handled
    },
  ], [onUserDelete]);

  // Define bulk actions
  const bulkActions: DataTableBulkAction<AdminUser>[] = useMemo(() => [
    {
      label: 'Change Role',
      icon: 'user-check',
      variant: 'secondary',
      onClick: () => setShowBulkRoleModal(true),
      disabled: (selectedUsers) => selectedUsers.some(user => user.role === 'admin'),
    },
    {
      label: 'Change Status',
      icon: 'toggle-left',
      variant: 'secondary',
      onClick: () => setShowBulkStatusModal(true),
    },
    {
      label: 'Export Selected',
      icon: 'download',
      variant: 'secondary',
      onClick: (selectedUsers) => {
        DataTableExporter.toCSV(
          selectedUsers, 
          columns, 
          `selected-users-${new Date().toISOString().split('T')[0]}`
        );
      },
    },
    {
      label: 'Delete Selected',
      icon: 'trash-2',
      variant: 'danger',
      onClick: (selectedUsers) => {
        const userNames = selectedUsers.map(u => u.displayName || u.email).join(', ');
        if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?\n\n${userNames}`)) {
          onBulkDelete?.(selectedUsers.map(u => u.id));
          clearSelection();
        }
      },
      disabled: (selectedUsers) => selectedUsers.some(user => user.role === 'admin'),
    },
  ], [columns, onBulkDelete, clearSelection]);

  // Handle bulk role change
  const handleBulkRoleChange = () => {
    if (bulkRole && onBulkUpdate) {
      onBulkUpdate(selectedData.map(u => u.id), { role: bulkRole });
      clearSelection();
      setShowBulkRoleModal(false);
      setBulkRole('');
    }
  };

  // Handle bulk status change
  const handleBulkStatusChange = () => {
    if (bulkStatus && onBulkUpdate) {
      onBulkUpdate(selectedData.map(u => u.id), { status: bulkStatus });
      clearSelection();
      setShowBulkStatusModal(false);
      setBulkStatus('');
    }
  };

  // Custom export handler
  const handleExport = (data: AdminUser[], cols: DataTableColumn<AdminUser>[]) => {
    DataTableExporter.toCSV(data, cols, `users-export-${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <>
      <DataTable
        data={filteredData}
        columns={columns}
        loading={loading}
        
        // Pagination
        pagination={{
          page,
          pageSize,
          total: totalItems,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [10, 20, 50, 100],
        }}
        
        // Sorting
        sortable={true}
        defaultSort={{ key: 'createdAt', direction: 'desc' }}
        onSort={handleSort}
        
        // Selection
        selectable={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        
        // Actions
        actions={actions}
        bulkActions={bulkActions}
        
        // Search
        searchable={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search users by name or email..."
        
        // Export
        exportable={true}
        exportFilename="users"
        onExport={handleExport}
        
        // Empty state
        emptyState={{
          icon: 'users',
          title: 'No users found',
          description: searchValue 
            ? 'No users match your search criteria. Try adjusting your search terms.'
            : 'No users have been registered yet.',
        }}
        
        className="shadow-sm"
      />

      {/* Bulk Role Change Modal */}
      <Modal
        open={showBulkRoleModal}
        onClose={() => {
          setShowBulkRoleModal(false);
          setBulkRole('');
        }}
        title="Change Role for Selected Users"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Change the role for {selectedData.length} selected user(s).
          </p>
          
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              New Role
            </label>
            <select
              value={bulkRole}
              onChange={(e) => setBulkRole(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white text-slate-900"
            >
              <option value="">Select a role...</option>
              <option value="attendee">Attendee</option>
              <option value="organizer">Organizer</option>
              <option value="vendor">Vendor</option>
              <option value="affiliate">Affiliate</option>
              <option value="influencer">Influencer</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setShowBulkRoleModal(false);
                setBulkRole('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkRoleChange}
              disabled={!bulkRole}
            >
              Update Role
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Status Change Modal */}
      <Modal
        open={showBulkStatusModal}
        onClose={() => {
          setShowBulkStatusModal(false);
          setBulkStatus('');
        }}
        title="Change Status for Selected Users"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Change the status for {selectedData.length} selected user(s).
          </p>
          
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              New Status
            </label>
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white text-slate-900"
            >
              <option value="">Select a status...</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setShowBulkStatusModal(false);
                setBulkStatus('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkStatusChange}
              disabled={!bulkStatus}
            >
              Update Status
            </Button>
          </div>
        </div>
      </Modal>

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

// User Details Modal Component (reused from original)
function UserDetailsModal({ 
  user, 
  onClose 
}: { 
  user: AdminUser; 
  onClose: () => void; 
}) {
  const [activityStats, setActivityStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/admin/users/${user.id}`, { credentials: 'include' });
        const data = await response.json();
        if (data.success) {
          setActivityStats(data.data.activityStats || data.data);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user.id]);

  const formatDate = (ts?: number) =>
    ts ? new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A";

  const s = activityStats || {};
  const roleLabels: Record<string, string> = {
    attendee: "Attendee",
    organizer: "Organizer",
    organiser: "Organizer",
    vendor: "Vendor",
    affiliate: "Affiliate",
    admin: "Administrator",
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    suspended: "bg-yellow-100 text-yellow-700",
    pending: "bg-blue-100 text-blue-700",
    banned: "bg-red-100 text-red-700",
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="User Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* User Avatar & Summary */}
        <div className="flex items-center gap-4 pb-4 border-b border-neutral-200">
          <div className="w-14 h-14 rounded-full bg-lime/10 flex items-center justify-center text-xl font-bold text-dark">
            {(user.displayName || user.email).charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">
              {user.displayName || "No name"}
            </h3>
            <p className="text-sm text-slate-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium text-slate-400">{roleLabels[user.role] || user.role}</span>
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[user.status] || "bg-slate-100 text-slate-600"}`}>
                {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
              </span>
            </div>
          </div>
          {user.location && (
            <div className="text-right text-xs text-slate-400">
              <Icon name="map-pin" size={14} className="inline mr-1" />
              {user.location.city}, {user.location.country}
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">
            Basic Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase">User ID</label>
              <p className="text-sm text-slate-900 mt-1 font-mono">{user.id}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase">Display Name</label>
              <p className="text-sm text-slate-900 mt-1">{user.displayName || 'Not set'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase">Email</label>
              <p className="text-sm text-slate-900 mt-1">{user.email}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase">Role</label>
              <p className="text-sm text-slate-900 mt-1 capitalize">{roleLabels[user.role] || user.role}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase">Status</label>
              <p className="text-sm text-slate-900 mt-1 capitalize">{user.status}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase">Joined</label>
              <p className="text-sm text-slate-900 mt-1">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase">Last Activity</label>
              <p className="text-sm text-slate-900 mt-1">{formatDate(user.lastActivityAt)}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase">Wallet Balance</label>
              <p className="text-sm text-slate-900 mt-1">{formatCurrency(user.walletBalance || 0)}</p>
            </div>
            {user.totalSpent !== undefined && (
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase">Total Spent</label>
                <p className="text-sm text-slate-900 mt-1">{formatCurrency(user.totalSpent)}</p>
              </div>
            )}
            {user.profileCompleteness !== undefined && (
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase">Profile Completeness</label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-20 bg-neutral-200 rounded-full h-2">
                    <div className="bg-lime h-2 rounded-full transition-all" style={{ width: `${user.profileCompleteness}%` }} />
                  </div>
                  <span className="text-xs text-slate-500">{user.profileCompleteness}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Statistics */}
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-neutral-200 rounded w-1/3" />
            <div className="grid grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-16 bg-neutral-100 rounded" />)}
            </div>
          </div>
        ) : activityStats ? (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">
              Activity Statistics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-neutral-50 rounded-lg p-3">
                <label className="text-xs font-medium text-slate-400 uppercase">Total Orders</label>
                <p className="text-lg font-bold text-slate-900 mt-1">{s.totalOrders || 0}</p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3">
                <label className="text-xs font-medium text-slate-400 uppercase">Total Spent</label>
                <p className="text-lg font-bold text-slate-900 mt-1">{formatCurrency(s.totalSpent || 0)}</p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3">
                <label className="text-xs font-medium text-slate-400 uppercase">Events Created</label>
                <p className="text-lg font-bold text-slate-900 mt-1">{s.eventsCreated || 0}</p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3">
                <label className="text-xs font-medium text-slate-400 uppercase">Events Attended</label>
                <p className="text-lg font-bold text-slate-900 mt-1">{s.eventsAttended || 0}</p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3">
                <label className="text-xs font-medium text-slate-400 uppercase">Wallet Transactions</label>
                <p className="text-lg font-bold text-slate-900 mt-1">{s.walletTransactions || 0}</p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3">
                <label className="text-xs font-medium text-slate-400 uppercase">Login Count</label>
                <p className="text-lg font-bold text-slate-900 mt-1">{s.loginCount || 0}</p>
              </div>
              {s.totalRevenue !== undefined && (
                <div className="bg-neutral-50 rounded-lg p-3">
                  <label className="text-xs font-medium text-slate-400 uppercase">Total Revenue</label>
                  <p className="text-lg font-bold text-slate-900 mt-1">{formatCurrency(s.totalRevenue || 0)}</p>
                </div>
              )}
              {s.referralCount !== undefined && (
                <div className="bg-neutral-50 rounded-lg p-3">
                  <label className="text-xs font-medium text-slate-400 uppercase">Referrals</label>
                  <p className="text-lg font-bold text-slate-900 mt-1">{s.referralCount || 0}</p>
                </div>
              )}
              {s.commissionEarned !== undefined && (
                <div className="bg-neutral-50 rounded-lg p-3">
                  <label className="text-xs font-medium text-slate-400 uppercase">Commission Earned</label>
                  <p className="text-lg font-bold text-slate-900 mt-1">{formatCurrency(s.commissionEarned || 0)}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400">
            <Icon name="bar-chart" size={32} className="mx-auto mb-2" />
            <p className="text-sm">No activity statistics available</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-3 pt-4 border-t border-neutral-200">
          <Button variant="outline" size="sm" onClick={() => window.open(`mailto:${user.email}`, '_blank')}>
            <Icon name="mail" size={14} className="mr-1.5" />
            Send Email
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}