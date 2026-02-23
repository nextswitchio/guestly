"use client";
import React from "react";

type Method = "wallet" | "card";

const methods: { value: Method; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: "wallet",
    label: "Guestly Wallet",
    description: "Pay from your wallet balance",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1 0-6h.75A2.25 2.25 0 0 1 18 6v0a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 6v0a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18V6" />
      </svg>
    ),
  },
  {
    value: "card",
    label: "Debit / Credit Card",
    description: "Visa, Mastercard, Verve",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
];

export default function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: Method;
  onChange: (m: Method) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {methods.map((m) => {
        const active = value === m.value;
        return (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange(m.value)}
            className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors ${active
                ? "border-primary-600 bg-primary-50/50"
                : "border-neutral-100 bg-white hover:border-neutral-200"
              }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${active
                  ? "bg-primary-100 text-primary-600"
                  : "bg-neutral-100 text-neutral-500"
                }`}
            >
              {m.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-neutral-900">{m.label}</span>
              <span className="text-xs text-neutral-500">{m.description}</span>
            </div>
            {/* Radio dot */}
            <div className="ml-auto">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${active ? "border-primary-600" : "border-neutral-300"
                  }`}
              >
                {active && <div className="h-2.5 w-2.5 rounded-full bg-primary-600" />}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

