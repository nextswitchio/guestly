"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Icon from "@/components/ui/Icon";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { UserStatsCards } from "@/components/admin/UserStatsCards";
import { UserFilters } from "@/components/admin/UserFilters";

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState([]);
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  // Fetch user statistics
  const fetchStats = React.useCallback(async () => {
    try {
      const response = await fetch('/api/admin/users?stats=true');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }, []);

  // Fetch users with filters
  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });
      
      if (searchQuery) params.append('search', searchQuery);
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data.users);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, roleFilter, statusFilter]);

  // Initial data fetch
  React.useEffect(() => {
    fetchStats();
    fetchUsers();
  }, [fetchStats, fetchUsers]);

  // Handle search with debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle filter changes
  const handleFilterChange = (type: 'role' | 'status', value: string) => {
    if (type === 'role') {
      setRoleFilter(value);
    } else {
      setStatusFilter(value);
    }
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle user role/status update
  const handleUserUpdate = async (userId: string, updates: { role?: string; status?: string }) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      if (data.success) {
        // Refresh users list and stats
        fetchUsers();
        fetchStats();
      } else {
        console.error('Failed to update user:', data.error);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">User Management</h1>
        <p className="text-sm text-[var(--foreground-muted)]">
          Manage platform users, roles, and permissions
        </p>
      </div>

      {/* User Statistics */}
      {stats && <UserStatsCards stats={stats} />}

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Input
                placeholder="Search users by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
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

      {/* Users Table */}
      <Card className="overflow-hidden">
        <UserManagementTable
          users={users}
          loading={loading}
          onUserUpdate={handleUserUpdate}
        />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[var(--surface-border)] px-6 py-4">
            <div className="text-sm text-[var(--foreground-muted)]">
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