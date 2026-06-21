import { Check } from 'lucide-react';
"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import RoleSelector from "./RoleSelector";

interface InviteTeamMemberFormProps {
  eventId: string;
  onSuccess?: () => void;
}

export function InviteTeamMemberForm({ eventId, onSuccess }: InviteTeamMemberFormProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"owner" | "editor" | "viewer">("editor");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/events/${eventId}/team/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setEmail("");
        setRole("editor");
        onSuccess?.();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || "Failed to send invitation");
      }
    } catch (err) {
      console.error("Error sending invitation:", err);
      setError("Failed to send invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        label="Email Address"
        placeholder="colleague@example.com"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        error={error}
        disabled={loading}
        required
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Role
        </label>
        <RoleSelector
          currentRole={role}
          onChange={(newRole) => setRole(newRole as any)}
          disabled={loading}
          showDescription
        />
      </div>

      {success && (
        <div className="p-3 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg">
          <p className="text-sm text-success-700 dark:text-success-300">
           <Check className="h-4 w-4 inline" /> Invitation sent successfully!
          </p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        Send Invitation
      </Button>

      <div className="text-xs text-foreground-muted space-y-1">
        <p>The invitation will be valid for 7 days.</p>
        <p>The recipient will receive an email with a link to join your team.</p>
      </div>
    </form>
  );
}


export default InviteTeamMemberForm;
