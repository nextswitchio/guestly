"use client";
import React from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

interface UserStatusBadgeProps {
  status: 'active' | 'suspended' | 'pending' | 'banned';
  userId: string;
  onStatusChange: (status: string) => void;
}

export function UserStatusBadge({ status, userId, onStatusChange }: UserStatusBadgeProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const statuses = [
    { 
      value: 'active', 
      label: 'Active', 
      color: 'bg-success-100 text-success-700',
      icon: 'check-circle'
    },
    { 
      value: 'pending', 
      label: 'Pending', 
      color: 'bg-warning-100 text-warning-700',
      icon: 'clock'
    },
    { 
      value: 'suspended', 
      label: 'Suspended', 
      color: 'bg-orange-100 text-orange-700',
      icon: 'pause-circle'
    },
    { 
      value: 'banned', 
      label: 'Banned', 
      color: 'bg-danger-100 text-danger-700',
      icon: 'x-circle'
    },
  ];

  const currentStatusData = statuses.find(s => s.value === status);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) {
      setShowDropdown(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onStatusChange(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isUpdating}
        className={`${currentStatusData?.color} hover:opacity-80 transition-opacity`}
      >
        {isUpdating ? (
          <Icon name="loader" size={14} className="animate-spin" />
        ) : (
          <>
            <Icon name={currentStatusData?.icon as any} size={14} />
            {currentStatusData?.label}
            <Icon name="chevron-down" size={12} />
          </>
        )}
      </Button>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-neutral-200 rounded-lg shadow-lg z-10">
          {statuses.map((statusOption) => (
            <button
              key={statusOption.value}
              onClick={() => handleStatusChange(statusOption.value)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 first:rounded-t-lg last:rounded-b-lg transition-colors flex items-center gap-2 ${
                status === statusOption.value ? 'bg-primary-50 text-primary-600' : 'text-slate-900'
              }`}
            >
              <Icon name={statusOption.icon as any} size={14} />
              {statusOption.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}