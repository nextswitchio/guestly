"use client";
import React from "react";

export default function OrganizerError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--surface-bg)]">
      <h2 className="text-2xl font-bold text-[var(--foreground)]">Something went wrong</h2>
      <p className="text-[var(--foreground-muted)] mt-2">
        An error occurred while loading the organizer page.
      </p>
    </div>
  );
}
