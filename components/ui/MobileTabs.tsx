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
      <div className="flex overflow-x-auto border-b border-neutral-200 bg-white rounded-t-xl -mx-4 sm:mx-0">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={`flex-shrink-0 px-4 sm:px-5 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap border-b-2 ${
              activeTab === item.id
                ? "text-lime border-lime bg-lime/5"
                : "text-neutral-500 border-transparent hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              {item.icon && (
                <Icon 
                  name={item.icon as any} 
                  size={16} 
                  className={activeTab === item.id ? "text-lime" : "text-neutral-400"}
                />
              )}
              <span className="truncate max-w-[100px]">{item.title}</span>
              {item.badge && (
                <span className={`inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium rounded-full ${
                  activeTab === item.id
                    ? "bg-lime/10 text-lime"
                    : "bg-neutral-100 text-neutral-500"
                }`}>
                  {item.badge}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-xl">
        {activeItem && (
          <div className="p-4 sm:p-6 animate-in fade-in-0 duration-200">
            {activeItem.content}
          </div>
        )}
      </div>
    </div>
  );
}