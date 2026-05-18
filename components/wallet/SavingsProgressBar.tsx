"use client";
import React from "react";
import Icon from "@/components/ui/Icon";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

function TargetIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

interface Milestone {
  percentage: number;
  label: string;
  reached: boolean;
  color: string;
  bgColor: string;
  glowColor: string;
}

export default function SavingsProgressBar({ goal, progress }: { goal: number; progress: number }) {
  const pct = goal > 0 ? Math.min(100, Math.round((progress / goal) * 100)) : 0;
  const remaining = Math.max(0, goal - progress);
  const prefersReducedMotion = useReducedMotion();
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [celebratingMilestone, setCelebratingMilestone] = React.useState<number | null>(null);
  const prevPctRef = React.useRef(pct);

  // Define milestones
  const milestones: Milestone[] = [
    { percentage: 25, label: "Quarter", reached: pct >= 25, color: "text-lime", bgColor: "bg-lime", glowColor: "" },
    { percentage: 50, label: "Halfway", reached: pct >= 50, color: "text-amber-600", bgColor: "bg-amber-500", glowColor: "shadow-[0_0_20px_rgba(251,191,36,0.4)]" },
    { percentage: 75, label: "Almost", reached: pct >= 75, color: "text-green-600", bgColor: "bg-green-500", glowColor: "" },
    { percentage: 100, label: "Complete", reached: pct >= 100, color: "text-green-700", bgColor: "bg-green-600", glowColor: "" },
  ];

  // Detect milestone crossing and trigger celebration (only for major milestones)
  React.useEffect(() => {
    const prevPct = prevPctRef.current;
    if (pct > prevPct && !prefersReducedMotion) {
      // Only celebrate major milestones (50% and 100%) to reduce noise
      const majorMilestones = [50, 100];
      const crossedMilestone = milestones.find(
        (m) => majorMilestones.includes(m.percentage) && prevPct < m.percentage && pct >= m.percentage
      );
      if (crossedMilestone) {
        setCelebratingMilestone(crossedMilestone.percentage);
        setShowCelebration(true);
        // Shorter celebration duration for less distraction
        setTimeout(() => {
          setShowCelebration(false);
          setCelebratingMilestone(null);
        }, 2000);
      }
    }
    prevPctRef.current = pct;
  }, [pct, prefersReducedMotion]);

  return (
    <div className="relative rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      {/* Celebration overlay - only for major milestones and when motion is enabled */}
      {showCelebration && celebratingMilestone && !prefersReducedMotion && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/95 animate-fade-in">
          <div className="text-center animate-scale-in">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white">
              <TrophyIcon />
            </div>
            <p className="text-lg font-bold text-green-600">
              {celebratingMilestone}% Milestone!
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              {celebratingMilestone === 100 ? (
                <span className="flex items-center justify-center gap-1">
                  Goal achieved! <Icon name="party" size={16} />
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1">
                  Keep going! <Icon name="rocket" size={16} />
                </span>
              )}
            </p>
            {/* Simplified confetti effect - fewer elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-fade-in-up"
                  style={{
                    left: `${20 + i * 12}%`,
                    top: `${25 + (i % 2) * 15}%`,
                    animationDelay: `${i * 100}ms`,
                    animationDuration: "0.8s",
                  }}
                >
                  <StarIcon />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime/10 text-lime">
            <TargetIcon />
          </span>
          <div>
            <p className="text-sm font-semibold text-neutral-900">Event Savings</p>
            <p className="text-xs text-neutral-500">Goal: ${goal.toFixed(2)}</p>
          </div>
        </div>
        <span className="text-xs font-bold text-lime">{pct}%</span>
      </div>

      {/* Progress bar with milestones */}
      <div className="relative mt-4">
        {/* Milestone markers */}
        <div className="absolute -top-6 left-0 right-0 flex justify-between px-1">
          {milestones.map((milestone) => (
            <div
              key={milestone.percentage}
              className="relative flex flex-col items-center"
              style={{ left: `${milestone.percentage === 100 ? -8 : 0}px` }}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                  milestone.reached
                    ? `${milestone.bgColor} border-white ${prefersReducedMotion ? '' : milestone.glowColor} ${prefersReducedMotion ? '' : 'scale-110'}`
                    : "border-neutral-300 bg-white"
                }`}
              >
                {milestone.reached && (
                  <svg className={`h-3 w-3 text-white ${prefersReducedMotion ? '' : 'animate-scale-in'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`mt-1 text-[10px] font-medium transition-colors duration-300 ${milestone.reached ? milestone.color : "text-neutral-400"}`}>
                {milestone.percentage}%
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar track */}
        <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-neutral-100">
          {/* Progress fill with gradient and animation */}
          <div
            className={`h-3 rounded-full bg-gradient-to-r from-lime via-lime-hover to-lime relative overflow-hidden ${
              prefersReducedMotion ? '' : 'transition-all duration-700 ease-out'
            }`}
            style={{ width: `${pct}%` }}
          >
            {/* Shimmer effect on progress bar - only when motion is enabled */}
            {pct > 0 && pct < 100 && !prefersReducedMotion && (
              <div className="absolute inset-0 shimmer" />
            )}
            {/* Glow effect when complete - only when motion is enabled */}
            {pct >= 100 && !prefersReducedMotion && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600" />
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-neutral-500">
          Saved <span className="font-semibold text-neutral-900">${progress.toFixed(2)}</span>
        </span>
        {remaining > 0 ? (
          <span className="text-neutral-500">
            <span className="font-semibold text-neutral-900">${remaining.toFixed(2)}</span> to go
          </span>
        ) : (
          <span className="flex items-center gap-1 font-semibold text-green-600">
            <TrophyIcon />
            Goal reached!
          </span>
        )}
      </div>

      {/* Milestone progress summary */}
      {pct > 0 && pct < 100 && (
        <div className="mt-3 flex items-center gap-1 text-[11px] text-neutral-500">
          <span>Next milestone:</span>
          <span className="font-semibold text-lime">
            {milestones.find((m) => !m.reached)?.percentage || 100}%
          </span>
        </div>
      )}
    </div>
  );
}

