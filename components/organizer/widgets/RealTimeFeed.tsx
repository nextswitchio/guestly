"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface FeedItem {
  name: string;
  ticket: string;
  event: string;
  time: string;
}

interface RealTimeFeedProps {
  items: FeedItem[];
  title?: string;
  maxItems?: number;
}

export function RealTimeFeed({ items, title = "Live Sales Feed", maxItems = 5 }: RealTimeFeedProps) {
  // Limit items immediately and use a ref to track if we've initialized
  const limitedItems = React.useMemo(() => items.slice(0, maxItems), [items, maxItems]);
  const [visibleCount, setVisibleCount] = React.useState(0);
  const hasInitialized = React.useRef(false);

  React.useEffect(() => {
    // Reset on items change
    hasInitialized.current = false;
    setVisibleCount(0);
    
    // Animate items appearing one by one
    limitedItems.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCount(index + 1);
      }, index * 150);
    });
    
    hasInitialized.current = true;
  }, [limitedItems]);

  return (
    <Card variant="elevated" padding="lg" hoverable>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">{title}</h2>
        <Badge variant="live" dot>Live</Badge>
      </div>
      
      <div className="flex flex-col gap-3">
        {limitedItems.slice(0, visibleCount).map((item, i) => (
          <div 
            key={`${item.name}-${item.time}-${i}`}
            className="flex items-start gap-3 rounded-xl bg-[var(--surface-bg)] p-3 animate-slide-in-right"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500/10 text-xs font-bold text-primary-600 animate-scale-in">
              {item.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[var(--foreground)]">
                <span className="text-primary-600">{item.name}</span> bought a{" "}
                <span className="font-semibold">{item.ticket}</span> ticket
              </p>
              <p className="text-[10px] text-[var(--foreground-muted)] truncate">{item.event}</p>
              <p className="text-[10px] text-[var(--foreground-subtle)]">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
