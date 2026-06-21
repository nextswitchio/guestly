"use client";
import React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export default function Breadcrumb({
  items,
  separator = "/",
  className = "",
}: BreadcrumbProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-sm ${className}`}
    >
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isClickable = !isLast && item.href;

          return (
            <li
              key={index}
              className="flex items-center gap-2"
            >
              {isClickable ? (
                <Link
                  href={item.href!}
                  className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-lime/20 focus-visible:rounded px-1 -mx-1"
                  aria-current={undefined}
                >
                  {item.icon && (
                    <span className="inline-flex items-center" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={`flex items-center gap-1.5 ${
                    isLast
                      ? "text-neutral-900 font-medium"
                      : "text-neutral-500"
                  }`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.icon && (
                    <span className="inline-flex items-center" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </span>
              )}

              {!isLast && (
                <span
                  className="text-neutral-400 select-none"
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
