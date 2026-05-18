"use client";

interface RoleSelectorProps {
  currentRole: "owner" | "editor" | "viewer";
  onChange: (role: string) => void;
  disabled?: boolean;
  showDescription?: boolean;
}

const roleDescriptions = {
  owner: "Full access to all features including team management",
  editor: "Can edit event details, manage tickets, budget, and planning",
  viewer: "Read-only access to event data and analytics",
};

export function RoleSelector({
  currentRole,
  onChange,
  disabled = false,
  showDescription = false,
}: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <select
        value={currentRole}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="owner">Owner</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </select>

      {showDescription && (
        <p className="text-xs text-foreground-muted">
          {roleDescriptions[currentRole]}
        </p>
      )}
    </div>
  );
}


export default RoleSelector;
