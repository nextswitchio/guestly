"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Link from "next/link";

interface QuickAction {
  label: string;
  href: string;
  iconName: "plus" | "calendar" | "chart" | "wallet" | "users" | "settings" | "ticket" | "money";
  color: string;
}

interface QuickActionCardsProps {
  actions: QuickAction[];
  title?: string;
}

export function QuickActionCards({ actions, title = "Quick Actions" }: QuickActionCardsProps) {
  return (
    <Card variant="elevated" padding="lg" hoverable className="transition-all duration-300">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[var(--foreground)]">{title}</h2>
        <p className="text-sm text-[var(--foreground-muted)]">Frequently used actions</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`group flex flex-col items-center gap-3 rounded-xl p-5 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 ${action.color}`}
          >
            <div className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
              <Icon name={action.iconName} size={24} />
            </div>
            <span className="text-sm font-semibold">{action.label}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
