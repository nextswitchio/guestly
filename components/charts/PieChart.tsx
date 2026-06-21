"use client";
import React from "react";

interface Segment {
  label: string;
  value: number;
  color?: string; // Made optional to use brand colors by default
}

interface PieChartProps {
  data: Segment[];
  size?: number;
  animated?: boolean;
  gradient?: boolean;
}

export function PieChart({ 
  data, 
  size = 200, 
  animated = true, 
  gradient = true 
}: PieChartProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setMounted(true), 300);
      return () => clearTimeout(timer);
    } else {
      setMounted(true);
    }
  }, [animated]);

  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-[var(--surface-border)] bg-[var(--surface-hover)]" style={{ width: size, height: size }}>
        <p className="text-xs text-[var(--foreground-muted)]">No data</p>
      </div>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 12;
  const innerR = r * 0.55; // donut

  // Brand color palette
  const brandColors = [
    'var(--color-primary-500)',
    'var(--color-success-500)', 
    'var(--color-warning-500)',
    'var(--color-danger-500)',
    'var(--color-navy-500)',
    'var(--color-primary-400)',
    'var(--color-success-400)',
    'var(--color-warning-400)',
  ];

  function getSegmentColor(segment: Segment, index: number) {
    return segment.color || brandColors[index % brandColors.length];
  }

  function polarToCartesian(angle: number, radius: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  // Pre-compute cumulative start angles
  const startAngles = data.reduce<number[]>((acc, d, i) => {
    const prev = i === 0 ? 0 : acc[i - 1] + (data[i - 1].value / total) * 360;
    acc.push(prev);
    return acc;
  }, []);

  const arcs = data.map((d, i) => {
    const angle = (d.value / total) * 360;
    const start = startAngles[i];
    const end = start + angle;
    const largeArc = angle > 180 ? 1 : 0;

    // Animation: start from 0 angle and grow to full angle
    const animatedAngle = mounted ? angle : 0;
    const animatedEnd = start + animatedAngle;

    const outerStart = polarToCartesian(start, r);
    const outerEnd = polarToCartesian(animatedEnd, r);
    const innerEnd = polarToCartesian(animatedEnd, innerR);
    const innerStart = polarToCartesian(start, innerR);

    const path = animatedAngle > 0 ? [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${r} ${r} 0 ${animatedAngle > 180 ? 1 : 0} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${innerR} ${innerR} 0 ${animatedAngle > 180 ? 1 : 0} 0 ${innerStart.x} ${innerStart.y}`,
      "Z",
    ].join(" ") : "";

    const midAngle = start + angle / 2;
    const labelR = r + 20;
    const labelPos = polarToCartesian(midAngle, labelR);

    return { 
      path, 
      color: getSegmentColor(d, i), 
      label: d.label, 
      value: d.value, 
      pct: Math.round((d.value / total) * 100), 
      labelPos, 
      index: i,
      angle: animatedAngle
    };
  });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Gradient definitions */}
          {gradient && (
            <defs>
              {data.map((d, i) => {
                const baseColor = getSegmentColor(d, i);
                return (
                  <radialGradient key={i} id={`pieGradient${i}`} cx="30%" cy="30%">
                    <stop offset="0%" stopColor={baseColor} stopOpacity="1" />
                    <stop offset="100%" stopColor={baseColor} stopOpacity="0.8" />
                  </radialGradient>
                );
              })}
              {/* Glow filter */}
              <filter id="pieGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          )}

          {/* Background circle for better visual separation */}
          <circle
            cx={cx}
            cy={cy}
            r={r + 2}
            fill="none"
            stroke="var(--surface-border)"
            strokeWidth={1}
            opacity={0.2}
          />

          {/* Pie segments */}
          {arcs.map((arc) => (
            <path
              key={arc.index}
              d={arc.path}
              fill={gradient ? `url(#pieGradient${arc.index})` : arc.color}
              opacity={hovered === null || hovered === arc.index ? 1 : 0.6}
              onMouseEnter={() => setHovered(arc.index)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer transition-all duration-300"
              stroke="var(--surface-card)"
              strokeWidth={2}
              filter={hovered === arc.index ? "url(#pieGlow)" : "none"}
              style={{
                transform: hovered === arc.index ? 'scale(1.05)' : 'scale(1)',
                transformOrigin: `${cx}px ${cy}px`,
                transition: animated ? `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${arc.index * 100}ms` : 'all 0.3s ease'
              }}
            />
          ))}

          {/* Center content */}
          <circle
            cx={cx}
            cy={cy}
            r={innerR}
            fill="var(--surface-card)"
            stroke="var(--surface-border)"
            strokeWidth={1}
          />

          {/* Center label */}
          {hovered !== null && (
            <g className="animate-fade-in">
              <text 
                x={cx} 
                y={cy - 8} 
                textAnchor="middle" 
                className="fill-[var(--foreground)]" 
                fontSize={24} 
                fontWeight={700}
              >
                {arcs[hovered].pct}%
              </text>
              <text 
                x={cx} 
                y={cy + 8} 
                textAnchor="middle" 
                className="fill-[var(--foreground-muted)]" 
                fontSize={11}
                fontWeight={500}
              >
                {arcs[hovered].label}
              </text>
              <text 
                x={cx} 
                y={cy + 20} 
                textAnchor="middle" 
                className="fill-[var(--foreground-subtle)]" 
                fontSize={10}
              >
                {arcs[hovered].value.toLocaleString()}
              </text>
            </g>
          )}
          {hovered === null && (
            <g>
              <text 
                x={cx} 
                y={cy - 4} 
                textAnchor="middle" 
                className="fill-[var(--foreground)]" 
                fontSize={16} 
                fontWeight={600}
              >
                Total
              </text>
              <text 
                x={cx} 
                y={cy + 12} 
                textAnchor="middle" 
                className="fill-[var(--foreground-muted)]" 
                fontSize={12}
              >
                {total.toLocaleString()}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Enhanced Legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 sm:flex-col sm:gap-y-2">
        {data.map((d, i) => {
          const isHovered = hovered === i;
          const pct = Math.round((d.value / total) * 100);
          
          return (
            <div
              key={i}
              className={`flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                hovered !== null && !isHovered ? "opacity-50" : ""
              } ${isHovered ? "scale-105" : ""}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="relative">
                <span 
                  className="block h-3 w-3 rounded-full transition-all duration-200" 
                  style={{ 
                    backgroundColor: getSegmentColor(d, i),
                    boxShadow: isHovered ? `0 0 8px ${getSegmentColor(d, i)}40` : 'none'
                  }} 
                />
                {isHovered && (
                  <span 
                    className="absolute inset-0 h-3 w-3 rounded-full animate-ping" 
                    style={{ backgroundColor: getSegmentColor(d, i) }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-[var(--foreground)] truncate">
                    {d.label}
                  </span>
                  <span className="text-sm font-semibold text-[var(--foreground)] tabular-nums">
                    {pct}%
                  </span>
                </div>
                <div className="text-xs text-[var(--foreground-muted)] tabular-nums">
                  {d.value.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PieChart;
