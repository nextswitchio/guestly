"use client";
import React, { useState, useMemo } from "react";
import DataTable, { DataTableColumn, DataTableAction, DataTableBulkAction } from "@/components/ui/DataTable";
import { UserRoleSelector } from "./UserRoleSelector";
import { UserStatusBadge } from "./UserStatusBadge";
import { DataTableFormatters, DataTableExporter } from "@/lib/utils/dataTableUtils";
import { useDataTable } from "@/lib/hooks/useDataTable";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Icon from "@/components/ui/Icon";

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

interface EnhancedUserManagementTableProps {
  users: AdminUser[];
  loading: boolean;
  onUserUpdate: (userId: string, updates: { role?: string; status?: string }) => void;
  onBulkUpdate?: (userIds: string[], updates: { role?: string; status?: string }) => void;
  onUserDelete?: (userId: string) => void;
  onBulkDelete?: (userIds: string[]) => void;
}

export function EnhancedUserManagementTable({ 
  users, 
  loading, 
  onUserUpdate,
  onBulkUpdate,
  onUserDelete,
  onBulkDelete
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
            <div className="font-medium text-[var(--foreground)]">
              {row.displayName || 'No name'}
            </div>
            <div className="text-sm text-[var(--foreground-muted)]">
              {row.email}
            </div>
            {row.location && (
              <div className="text-xs text-[var(--foreground-muted)]">
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
          <div className="text-[var(--foreground)]">
            {value && typeof value !== 'object' ? DataTableFormatters.date(value) : '-'}
          </div>
        </div>
      ),
      exportRender: (value) => value && typeof value !== 'object' ? DataTableFormatters.date(value) : '-',
    },
    {
      key: 'lastActivityAt',
      header: 'Last Activity',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-[var(--foreground-muted)]">
          {value && typeof value !== 'object' ? DataTableFormatters.date(value) : 'Never'}
        </div>
      ),
      exportRender: (value) => value && typeof value !== 'object' ? DataTableFormatters.date(value) : 'Never',
    },
    {
      key: 'eventsCreated',
      header: 'Events',
      sortable: true,
      align: 'center',
      render: (value, row) => (
        <div className="text-sm text-center">
          {row.role === 'organizer' && (
            <div className="text-[var(--foreground)]">
              {row.eventsCreated || 0} created
            </div>
          )}
          {row.role === 'attendee' && (
            <div className="text-[var(--foreground)]">
              {row.eventsAttended || 0} attended
            </div>
          )}
          {(row.role === 'vendor' || row.role === 'admin') && (
            <div className="text-[var(--foreground-muted)]">—</div>
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
            <span className="text-[var(--foreground)]">
              {DataTableFormatters.currency(value / 100)}
            </span>
          ) : (
            <span className="text-[var(--foreground-muted)]">$0</span>
          )}
        </div>
      ),
      exportRender: (value) => value && typeof value === 'number' ? DataTableFormatters.currency(value / 100) : '$0',
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
              <span className="text-xs text-[var(--foreground-muted)]">
                {value}%
              </span>
            </div>
          ) : (
            <span className="text-[var(--foreground-muted)]">—</span>
          )}
        </div>
      ),
      exportRender: (value) => value && typeof value === 'number' ? `${value}%` : '—',
    },
  ], [onUserUpdate]);

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
          <p className="text-sm text-[var(--foreground-muted)]">
            Change the role for {selectedData.length} selected user(s).
          </p>
          
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              New Role
            </label>
            <select
              value={bulkRole}
              onChange={(e) => setBulkRole(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--surface-border)] rounded-lg bg-[var(--surface-bg)] text-[var(--foreground)]"
            >
              <option value="">Select a role...</option>
              <option value="attendee">Attendee</option>
              <option value="organizer">Organizer</option>
              <option value="vendor">Vendor</option>
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
          <p className="text-sm text-[var(--foreground-muted)]">
            Change the status for {selectedData.length} selected user(s).
          </p>
          
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              New Status
            </label>
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--surface-border)] rounded-lg bg-[var(--surface-bg)] text-[var(--foreground)]"
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
    return DataTableFormatters.currency(amount / 100);
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="User Details"
      size="lg"
    >
      <div className="space-y-6">
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
                    ? DataTableFormatters.date(activityStats.lastActivity)
                    : 'Never'
                  }
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}