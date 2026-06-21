"use client";
import React from "react";

interface BarItem {
  label: string;
  value: number;
  color?: string; // Made optional to use brand colors by default
}

interface BarChartProps {
  data: BarItem[];
  height?: number;
  formatValue?: (v: number) => string;
  animated?: boolean;
  gradient?: boolean;
}

export function BarChart({
  data,
  height = 200,
  formatValue = (v) => v.toLocaleString(),
  animated = true,
  gradient = true,
}: BarChartProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), animated ? 100 : 0);
    return () => clearTimeout(timer);
  }, [animated]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-[var(--surface-border)] bg-[var(--surface-hover)]" style={{ height }}>
        <p className="text-xs text-[var(--foreground-muted)]">No data available</p>
      </div>
    );
  }

  const padding = { top: 20, right: 16, bottom: 40, left: 60 };
  const width = 400;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.value));
  const barGap = 12;
  const barW = Math.min(48, (chartW - barGap * (data.length - 1)) / data.length);
  const totalBarsW = barW * data.length + barGap * (data.length - 1);
  const offsetX = padding.left + (chartW - totalBarsW) / 2;

  // Brand color palette for bars
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

  // Y-axis ticks
  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, index) => ({
    id: `bar-y-tick-${index}`,
    value: Math.round((maxVal / tickCount) * index),
  }));

  function y(v: number) {
    return padding.top + chartH - (v / (maxVal || 1)) * chartH;
  }

  function getBarColor(item: BarItem, index: number) {
    return item.color || brandColors[index % brandColors.length];
  }

  function createGradientId(index: number) {
    return `barGradient${index}`;
  }

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Gradient definitions */}
        {gradient && (
          <defs>
            {data.map((d, i) => {
              const baseColor = getBarColor(d, i);
              return (
                <linearGradient key={i} id={createGradientId(i)} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={baseColor} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={baseColor} stopOpacity="0.6" />
                </linearGradient>
              );
            })}
          </defs>
        )}

        {/* Grid lines */}
        {yTicks.map((tick) => (
          <g key={tick.id}>
            <line
              x1={padding.left}
              y1={y(tick.value)}
              x2={width - padding.right}
              y2={y(tick.value)}
              stroke="var(--surface-border)"
              strokeWidth={1}
              strokeDasharray="2 4"
              opacity={0.5}
            />
            <text 
              x={padding.left - 8} 
              y={y(tick.value) + 4} 
              textAnchor="end" 
              className="fill-[var(--foreground-muted)]" 
              fontSize={10}
              fontWeight={500}
            >
              {tick.value >= 1000 ? `${(tick.value / 1000).toFixed(1)}k` : tick.value}
            </text>
          </g>
        ))}

        {/* Bars */}
        {data.map((d, i) => {
          const bx = offsetX + i * (barW + barGap);
          const bh = (d.value / (maxVal || 1)) * chartH;
          const by = padding.top + chartH - bh;
          const isHov = hovered === i;
          const animatedHeight = mounted ? bh : 0;
          const animatedY = mounted ? by : padding.top + chartH;

          return (
            <g
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              {/* Bar with gradient and animation */}
              <rect 
                x={bx} 
                y={animatedY}
                width={barW} 
                height={animatedHeight}
                rx={4}
                fill={gradient ? `url(#${createGradientId(i)})` : getBarColor(d, i)}
                opacity={isHov ? 1 : 0.9}
                className={`transition-all duration-300 ${isHov ? 'drop-shadow-lg' : ''}`}
                style={{
                  transition: animated ? 'height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), y 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease' : 'opacity 0.2s ease',
                  transitionDelay: animated ? `${i * 100}ms` : '0ms'
                }}
              />

              {/* Hover glow effect */}
              {isHov && (
                <rect 
                  x={bx - 2} 
                  y={by - 2}
                  width={barW + 4} 
                  height={bh + 4}
                  rx={6}
                  fill="none"
                  stroke={getBarColor(d, i)}
                  strokeWidth={2}
                  opacity={0.3}
                  className="animate-pulse"
                />
              )}

              {/* Label */}
              <text 
                x={bx + barW / 2} 
                y={height - 12} 
                textAnchor="middle" 
                className="fill-[var(--foreground-muted)]" 
                fontSize={10}
                fontWeight={500}
              >
                {d.label}
              </text>

              {/* Interactive tooltip */}
              {isHov && (
                <g className="animate-fade-in">
                  {/* Tooltip background with glass effect */}
                  <rect 
                    x={bx + barW / 2 - 45} 
                    y={by - 35} 
                    width={90} 
                    height={28} 
                    rx={8} 
                    fill="var(--surface-card)"
                    stroke="var(--surface-border)"
                    strokeWidth={1}
                    className="drop-shadow-lg"
                    style={{
                      filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
                    }}
                  />
                  {/* Tooltip arrow */}
                  <path
                    d={`M ${bx + barW / 2 - 6} ${by - 7} L ${bx + barW / 2} ${by - 1} L ${bx + barW / 2 + 6} ${by - 7} Z`}
                    fill="var(--surface-card)"
                    stroke="var(--surface-border)"
                    strokeWidth={1}
                  />
                  {/* Tooltip text */}
                  <text 
                    x={bx + barW / 2} 
                    y={by - 15} 
                    textAnchor="middle" 
                    className="fill-[var(--foreground)]" 
                    fontSize={12} 
                    fontWeight={600}
                  >
                    {formatValue(d.value)}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default BarChart;
