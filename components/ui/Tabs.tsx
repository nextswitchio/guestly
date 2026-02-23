"use client";
import React from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
}

export default function Tabs({ tabs, defaultTabId }: TabsProps) {
  const initial = defaultTabId || (tabs[0] ? tabs[0].id : "");
  const [active, setActive] = React.useState(initial);
  const current = tabs.find((t) => t.id === active);
  return (
    <div className="w-full">
      <div className="overflow-x-auto border-b border-neutral-200">
        <div className="flex gap-1 min-w-max">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`relative px-4 py-2.5 text-sm font-medium transition ${active === t.id
                  ? "text-primary-700"
                  : "text-neutral-500 hover:text-neutral-700"
                }`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
              {active === t.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary-600" />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="py-5">{current?.content}</div>
    </div>
  );
}

