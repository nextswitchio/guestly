import { Mail } from 'lucide-react';
"use client";
import React from "react";
import Link from "next/link";

export default function InvitationBadge() {
  const [count, setCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  async function loadCount() {
    try {
      const res = await fetch("/api/vendors/invitations");
      const data = await res.json();
      if (res.ok) {
        const pending = data.data.filter((i: any) => i.status === "invited").length;
        setCount(pending);
      }
    } catch (error) {
      console.error("Error loading invitation count:", error);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void loadCount();
    // Poll every 30 seconds for new invitations
    const interval = setInterval(() => void loadCount(), 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || count === 0) {
    return null;
  }

  return (
    <Link
      href="/vendor/invitations"
      className="relative inline-flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100"
    >
      <span><Mail className="h-4 w-4 inline-block" /></span>
      <span>
        {count} {count === 1 ? "Invitation" : "Invitations"}
      </span>
      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger-500 text-xs font-bold text-white">
        {count}
      </span>
    </Link>
  );
}
