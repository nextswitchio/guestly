"use client";
import React, { useState } from "react";
import Icon from "@/components/ui/Icon";

interface MobileTabItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  icon?: string;
  badge?: string | number;
}

interface MobileTabsProps {
  items: MobileTabItem[];
  defaultTab?: string;
  className?: string;
  onChange?: (tabId: string) => void;
}

export default function MobileTabs({
  items,
  defaultTab,
  className = "",
  onChange,
}: MobileTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id || "");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeItem = items.find(item => item.id === activeTab);

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-[var(--surface-border)] bg-[var(--surface-card)] rounded-t-xl">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={`flex-1 min-w-0 px-4 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === item.id
                ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50/50"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {item.icon && (
                <Icon 
                  name={item.icon as any} 
                  size={16} 
                  className={activeTab === item.id ? "text-primary-600" : "text-[var(--foreground-muted)]"}
                />
              )}
              <span className="truncate">{item.title}</span>
              {item.badge && (
                <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full ${
                  activeTab === item.id
                    ? "bg-primary-100 text-primary-700"
                    : "bg-[var(--surface-bg)] text-[var(--foreground-muted)]"
                }`}>
                  {item.badge}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-[var(--surface-card)] rounded-b-xl">
        {activeItem && (
          <div className="p-4 animate-in fade-in-0 duration-200">
            {activeItem.content}
          </div>
        )}
      </div>
    </div>
  );
}