"use client";
import React, { useState, useRef, useEffect } from "react";

type AccordionMode = "single" | "multiple";

interface AccordionItemData {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItemData[];
  mode?: AccordionMode;
  defaultExpanded?: string | string[];
  className?: string;
  onChange?: (expanded: string | string[]) => void;
}

export default function Accordion({
  items,
  mode = "single",
  defaultExpanded,
  className = "",
  onChange,
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    if (defaultExpanded) {
      return new Set(
        Array.isArray(defaultExpanded) ? defaultExpanded : [defaultExpanded]
      );
    }
    return new Set();
  });

  const handleToggle = (itemId: string) => {
    setExpandedItems((prev) => {
      const newExpanded = new Set(prev);

      if (mode === "single") {
        // Single mode: only one item can be expanded at a time
        if (newExpanded.has(itemId)) {
          newExpanded.delete(itemId);
        } else {
          newExpanded.clear();
          newExpanded.add(itemId);
        }
      } else {
        // Multiple mode: toggle the clicked item
        if (newExpanded.has(itemId)) {
          newExpanded.delete(itemId);
        } else {
          newExpanded.add(itemId);
        }
      }

      // Call onChange callback
      if (onChange) {
        const result = Array.from(newExpanded);
        onChange(mode === "single" ? result[0] || "" : result);
      }

      return newExpanded;
    });
  };

  return (
    <div className={`w-full ${className}`} role="region">
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isExpanded={expandedItems.has(item.id)}
          onToggle={() => handleToggle(item.id)}
          isFirst={index === 0}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}

interface AccordionItemProps {
  item: AccordionItemData;
  isExpanded: boolean;
  onToggle: () => void;
  isFirst: boolean;
  isLast: boolean;
}

function AccordionItem({
  item,
  isExpanded,
  onToggle,
  isFirst,
  isLast,
}: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(0);

  useEffect(() => {
    if (contentRef.current) {
      if (isExpanded) {
        // Get the full height of the content
        const contentHeight = contentRef.current.scrollHeight;
        setHeight(contentHeight);
      } else {
        setHeight(0);
      }
    }
  }, [isExpanded]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!item.disabled) {
        onToggle();
      }
    }
  };

  return (
    <div
      className={`border-b border-surface-border ${
        isFirst ? "border-t" : ""
      } ${isLast ? "border-b" : ""}`}
    >
      <button
        type="button"
        onClick={!item.disabled ? onToggle : undefined}
        onKeyDown={handleKeyDown}
        disabled={item.disabled}
        aria-expanded={isExpanded}
        aria-controls={`accordion-content-${item.id}`}
        className={`w-full flex items-center justify-between px-4 py-4 text-left transition-colors duration-200 ${
          item.disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-inset"
        }`}
      >
        <span className="text-base font-semibold text-foreground pr-4">
          {item.title}
        </span>
        <ChevronIcon
          isExpanded={isExpanded}
          disabled={item.disabled}
        />
      </button>
      <div
        ref={contentRef}
        id={`accordion-content-${item.id}`}
        role="region"
        aria-labelledby={`accordion-header-${item.id}`}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          height: height !== undefined ? `${height}px` : "auto",
        }}
      >
        <div className="px-4 pb-4 pt-0 text-sm text-foreground-muted">
          {item.content}
        </div>
      </div>
    </div>
  );
}

interface ChevronIconProps {
  isExpanded: boolean;
  disabled?: boolean;
}

function ChevronIcon({ isExpanded, disabled }: ChevronIconProps) {
  return (
    <svg
      className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ease-out ${
        isExpanded ? "rotate-180" : "rotate-0"
      } ${disabled ? "text-foreground-subtle" : "text-foreground-muted"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}
