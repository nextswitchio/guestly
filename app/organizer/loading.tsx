"use client";
import React from "react";

export default function OrganizerLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--surface-bg)]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      <p className="text-[var(--foreground-muted)] mt-4">Loading...</p>
    </div>
  );
}
