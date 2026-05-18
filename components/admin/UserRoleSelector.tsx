"use client";
import React from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

interface UserRoleSelectorProps {
  currentRole: 'attendee' | 'organizer' | 'vendor' | 'admin';
  userId: string;
  onRoleChange: (role: string) => void;
}

export function UserRoleSelector({ currentRole, userId, onRoleChange }: UserRoleSelectorProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const roles = [
    { value: 'attendee', label: 'Attendee', color: 'bg-blue-100 text-blue-700' },
    { value: 'organizer', label: 'Organizer', color: 'bg-purple-100 text-purple-700' },
    { value: 'vendor', label: 'Vendor', color: 'bg-green-100 text-green-700' },
    { value: 'admin', label: 'Admin', color: 'bg-red-100 text-red-700' },
  ];

  const currentRoleData = roles.find(role => role.value === currentRole);

  const handleRoleChange = async (newRole: string) => {
    if (newRole === currentRole) {
      setShowDropdown(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onRoleChange(newRole);
    } catch (error) {
      console.error('Error updating role:', error);
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
        className={`${currentRoleData?.color} hover:opacity-80 transition-opacity`}
      >
        {isUpdating ? (
          <Icon name="loader" size={14} className="animate-spin" />
        ) : (
          <>
            {currentRoleData?.label}
            <Icon name="chevron-down" size={12} />
          </>
        )}
      </Button>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 w-32 bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-lg shadow-lg z-10">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => handleRoleChange(role.value)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--surface-hover)] first:rounded-t-lg last:rounded-b-lg transition-colors ${
                currentRole === role.value ? 'bg-primary-50 text-primary-600' : 'text-[var(--foreground)]'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}