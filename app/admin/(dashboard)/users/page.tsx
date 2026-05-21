"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Icon from "@/components/ui/Icon";
import { EnhancedUserManagementTable } from "@/components/admin/EnhancedUserManagementTable";
import { UserStatsCards } from "@/components/admin/UserStatsCards";
import { UserFilters } from "@/components/admin/UserFilters";

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState([]);
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  async function loadStatsData() {
    const response = await fetch('/api/admin/users?stats=true');
    const data = await response.json();
    return data.success ? data.data : null;
  }

  async function loadUsersData({
    page,
    search,
    role,
    status,
  }: {
    page: number;
    search: string;
    role: string;
    status: string;
  }) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20'
    });

    if (search) params.append('search', search);
    if (role) params.append('role', role);
    if (status) params.append('status', status);

    const response = await fetch(`/api/admin/users?${params}`);
    const data = await response.json();
    return data.success
      ? {
          users: data.data.users ?? [],
          totalPages: data.data.pagination?.totalPages ?? 1,
        }
      : null;
  }

  const fetchStats = React.useCallback(async () => {
    try {
      const data = await loadStatsData();
      if (data) setStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }, []);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await loadUsersData({
        page: currentPage,
        search: debouncedSearchQuery,
        role: roleFilter,
        status: statusFilter,
      });
      if (data) {
        setUsers(data.users);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchQuery, roleFilter, statusFilter]);

  React.useEffect(() => {
    let active = true;

    async function loadPageData() {
      const [statsData, usersData] = await Promise.all([
        loadStatsData(),
        loadUsersData({
          page: currentPage,
          search: debouncedSearchQuery,
          role: roleFilter,
          status: statusFilter,
        }),
      ]);

      if (!active) return;
      if (statsData) setStats(statsData);
      if (usersData) {
        setUsers(usersData.users);
        setTotalPages(usersData.totalPages);
      }
      setLoading(false);
    }

    loadPageData().catch((error) => {
      console.error('Error fetching user data:', error);
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [currentPage, debouncedSearchQuery, roleFilter, statusFilter]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFilterChange = (type: 'role' | 'status', value: string) => {
    if (type === 'role') {
      setRoleFilter(value);
    } else {
      setStatusFilter(value);
    }
    setCurrentPage(1);
  };

  const handleUserUpdate = async (userId: string, updates: { role?: string; status?: string }) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      if (data.success) {
        fetchUsers();
        fetchStats();
      } else {
        console.error('Failed to update user:', data.error);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleBulkUpdate = async (userIds: string[], updates: { role?: string; status?: string }) => {
    try {
      const response = await fetch('/api/admin/users/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds, updates })
      });

      const data = await response.json();
      if (data.success) {
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      console.error('Error bulk updating users:', error);
    }
  };

  const handleUserDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleBulkDelete = async (userIds: string[]) => {
    try {
      const response = await fetch('/api/admin/users/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds })
      });

      const data = await response.json();
      if (data.success) {
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      console.error('Error bulk deleting users:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-sm text-slate-500">
          Manage platform users, roles, and permissions
        </p>
      </div>

      {stats && <UserStatsCards stats={stats} />}

      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Input
                placeholder="Search users by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <Icon name="search" size={16} />
              </div>
            </div>
          </div>
          
          <UserFilters
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            onFilterChange={handleFilterChange}
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <EnhancedUserManagementTable
          users={users}
          loading={loading}
          onUserUpdate={handleUserUpdate}
          onBulkUpdate={handleBulkUpdate}
          onUserDelete={handleUserDelete}
          onBulkDelete={handleBulkDelete}
        />
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
            <div className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <Icon name="chevron-left" size={16} />
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                Next
                <Icon name="chevron-right" size={16} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
