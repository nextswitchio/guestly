"use client";
import React from "react";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export default function Dropdown({ trigger, children }: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);
  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 z-40 mt-2 min-w-40 rounded-md border border-neutral-200 bg-white p-2 shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}

