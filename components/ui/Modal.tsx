"use client";
import React from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-4 shadow-xl">
        {title && <div className="mb-2 text-lg font-medium">{title}</div>}
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}

