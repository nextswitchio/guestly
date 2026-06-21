"use client";
import React from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

interface UserFiltersProps {
  roleFilter: string;
  statusFilter: string;
  onFilterChange: (type: 'role' | 'status', value: string) => void;
}

export function UserFilters({ roleFilter, statusFilter, onFilterChange }: UserFiltersProps) {
  const [showRoleDropdown, setShowRoleDropdown] = React.useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = React.useState(false);

  const roles = [
    { value: '', label: 'All Roles' },
    { value: 'attendee', label: 'Attendees' },
    { value: 'organizer', label: 'Organizers' },
    { value: 'vendor', label: 'Vendors' },
    { value: 'admin', label: 'Admins' },
  ];

  const statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'banned', label: 'Banned' },
  ];

  const handleRoleSelect = (value: string) => {
    onFilterChange('role', value);
    setShowRoleDropdown(false);
  };

  const handleStatusSelect = (value: string) => {
    onFilterChange('status', value);
    setShowStatusDropdown(false);
  };

  const getRoleLabel = () => {
    const role = roles.find(r => r.value === roleFilter);
    return role ? role.label : 'All Roles';
  };

  const getStatusLabel = () => {
    const status = statuses.find(s => s.value === statusFilter);
    return status ? status.label : 'All Statuses';
  };

  return (
    <div className="flex gap-2">
      {/* Role Filter */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowRoleDropdown(!showRoleDropdown)}
          className="flex items-center gap-2"
        >
          <Icon name="user" size={16} />
          {getRoleLabel()}
          <Icon name="chevron-down" size={14} />
        </Button>
        
        {showRoleDropdown && (
          <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-10">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => handleRoleSelect(role.value)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 first:rounded-t-lg last:rounded-b-lg ${
                  roleFilter === role.value ? 'bg-primary-50 text-primary-600' : 'text-slate-900'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status Filter */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          className="flex items-center gap-2"
        >
          <Icon name="shield" size={16} />
          {getStatusLabel()}
          <Icon name="chevron-down" size={14} />
        </Button>
        
        {showStatusDropdown && (
          <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-10">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusSelect(status.value)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 first:rounded-t-lg last:rounded-b-lg ${
                  statusFilter === status.value ? 'bg-primary-50 text-primary-600' : 'text-slate-900'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {(roleFilter || statusFilter) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onFilterChange('role', '');
            onFilterChange('status', '');
          }}
          className="text-danger-600 hover:text-danger-700"
        >
          <Icon name="x" size={16} />
          Clear
        </Button>
      )}
    </div>
  );
}