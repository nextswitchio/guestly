'use client';
import { AlertTriangle, Flame } from 'lucide-react';

interface ScarcityIndicatorProps {
  ticketsRemaining: number;
  totalCapacity: number;
  threshold?: number; // Show indicator when below this percentage (default 20%)
}

export function ScarcityIndicator({
  ticketsRemaining,
  totalCapacity,
  threshold = 20,
}: ScarcityIndicatorProps) {
  const percentageRemaining = (ticketsRemaining / totalCapacity) * 100;

  if (percentageRemaining > threshold) return null;

  const getUrgencyLevel = () => {
    if (percentageRemaining <= 5) return 'critical';
    if (percentageRemaining <= 10) return 'high';
    return 'medium';
  };

  const urgency = getUrgencyLevel();

  const styles = {
    critical: 'bg-red-100 border-red-300 text-red-800',
    high: 'bg-orange-100 border-orange-300 text-orange-800',
    medium: 'bg-amber-100 border-amber-300 text-amber-800',
  };

  const icons = {
    critical: 'Flame',
    high: '<AlertTriangle className="h-4 w-4 inline-block" />️',
    medium: '⏰',
  };

  return (
    <div className={`p-3 rounded-lg border-2 ${styles[urgency]} animate-pulse`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{icons[urgency]}</span>
        <div>
          <p className="font-bold text-sm">
            Only {ticketsRemaining} tickets left!
          </p>
          <p className="text-xs opacity-90">
            {percentageRemaining.toFixed(0)}% remaining - Book now before they're gone
          </p>
        </div>
      </div>
    </div>
  );
}
