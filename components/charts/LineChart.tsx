"use client";
import React from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  showArea?: boolean;
  formatValue?: (v: number) => string;
  animated?: boolean;
  gradient?: boolean;
}

export function LineChart({
  data,
  height = 200,
  color = "var(--color-primary-500)",
  showArea = true,
  formatValue = (v) => v.toLocaleString(),
  animated = true,
  gradient = true,
}: LineChartProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setMounted(true), 200);
      return () => clearTimeout(timer);
    } else {
      setMounted(true);
    }
  }, [animated]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-[var(--surface-border)] bg-[var(--surface-hover)]" style={{ height }}>
        <p className="text-xs text-[var(--foreground-muted)]">No data available</p>
      </div>
    );
  }

  const padding = { top: 24, right: 20, bottom: 40, left: 60 };
  const width = 600;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value));
  const range = maxVal - minVal || 1;

  function x(i: number) {
    return padding.left + (i / (data.length - 1)) * chartW;
  }

  function y(v: number) {
    return padding.top + chartH - ((v - minVal) / range) * chartH;
  }

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${x(data.length - 1).toFixed(1)},${(padding.top + chartH).toFixed(1)} L${padding.left},${(padding.top + chartH).toFixed(1)} Z`;

  // Y-axis ticks
  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => minVal + (range / tickCount) * i);

  // X-axis labels (show ~5)
  const xStep = Math.max(1, Math.floor(data.length / 5));

  // Animation path for line drawing
  const pathLength = React.useMemo(() => {
    if (typeof document !== 'undefined') {
      const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      tempPath.setAttribute('d', linePath);
      return tempPath.getTotalLength();
    }
    return 1000; // fallback
  }, [linePath]);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Gradient definitions */}
        <defs>
          {gradient && (
            <>
              {/* Area gradient */}
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                <stop offset="100%" stopColor={color} stopOpacity="0.02" />
              </linearGradient>
              {/* Line gradient */}
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                <stop offset="50%" stopColor={color} stopOpacity="1" />
                <stop offset="100%" stopColor={color} stopOpacity="0.8" />
              </linearGradient>
              {/* Glow filter */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </>
          )}
        </defs>

        {/* Grid lines */}
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={padding.left}
              y1={y(tick)}
              x2={width - padding.right}
              y2={y(tick)}
              stroke="var(--surface-border)"
              strokeWidth={1}
              strokeDasharray="2 4"
              opacity={0.4}
            />
            <text 
              x={padding.left - 8} 
              y={y(tick) + 4} 
              textAnchor="end" 
              className="fill-[var(--foreground-muted)]" 
              fontSize={10}
              fontWeight={500}
            >
              {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : Math.round(tick)}
            </text>
          </g>
        ))}

        {/* Area fill with gradient */}
        {showArea && (
          <path 
            d={areaPath} 
            fill={gradient ? "url(#areaGradient)" : color} 
            opacity={gradient ? 1 : 0.1}
            className={animated ? "transition-all duration-1000 ease-out" : ""}
            style={{
              transform: mounted ? 'scaleY(1)' : 'scaleY(0)',
              transformOrigin: `center ${padding.top + chartH}px`,
              transition: animated ? 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
              transitionDelay: '0.3s'
            }}
          />
        )}

        {/* Line with drawing animation */}
        <path 
          d={linePath} 
          fill="none" 
          stroke={gradient ? "url(#lineGradient)" : color} 
          strokeWidth={3} 
          strokeLinecap="round" 
          strokeLinejoin="round"
          filter={gradient ? "url(#glow)" : "none"}
          className="drop-shadow-sm"
          style={{
            strokeDasharray: animated ? pathLength : 'none',
            strokeDashoffset: animated ? (mounted ? 0 : pathLength) : 0,
            transition: animated ? 'stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
            transitionDelay: '0.1s'
          }}
        />

        {/* Data points */}
        {data.map((d, i) => {
          const pointX = x(i);
          const pointY = y(d.value);
          const isHov = hovered === i;
          
          return (
            <g key={i}>
              {/* Hover area */}
              <rect 
                x={pointX - 15} 
                y={padding.top} 
                width={30} 
                height={chartH} 
                fill="transparent" 
                className="cursor-pointer"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
              
              {/* Data point */}
              <circle 
                cx={pointX} 
                cy={pointY} 
                r={isHov ? 6 : 4}
                fill="var(--surface-card)"
                stroke={color}
                strokeWidth={isHov ? 3 : 2}
                className={`transition-all duration-200 ${isHov ? 'drop-shadow-lg' : ''}`}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: isHov ? 'scale(1.2)' : 'scale(1)',
                  transition: animated ? `opacity 0.3s ease ${0.5 + i * 0.1}s, transform 0.2s ease, r 0.2s ease, stroke-width 0.2s ease` : 'transform 0.2s ease, r 0.2s ease, stroke-width 0.2s ease'
                }}
              />

              {/* Hover effects */}
              {isHov && (
                <g className="animate-fade-in">
                  {/* Vertical line */}
                  <line 
                    x1={pointX} 
                    y1={padding.top} 
                    x2={pointX} 
                    y2={padding.top + chartH} 
                    stroke={color} 
                    strokeWidth={1} 
                    opacity={0.4} 
                    strokeDasharray="4 2" 
                  />
                  
                  {/* Tooltip */}
                  <g>
                    <rect 
                      x={pointX - 50} 
                      y={pointY - 40} 
                      width={100} 
                      height={32} 
                      rx={8} 
                      fill="var(--surface-card)"
                      stroke="var(--surface-border)"
                      strokeWidth={1}
                      className="drop-shadow-xl"
                      style={{
                        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))'
                      }}
                    />
                    {/* Tooltip arrow */}
                    <path
                      d={`M ${pointX - 8} ${pointY - 8} L ${pointX} ${pointY - 2} L ${pointX + 8} ${pointY - 8} Z`}
                      fill="var(--surface-card)"
                      stroke="var(--surface-border)"
                      strokeWidth={1}
                    />
                    {/* Tooltip text */}
                    <text 
                      x={pointX} 
                      y={pointY - 20} 
                      textAnchor="middle" 
                      className="fill-[var(--foreground)]" 
                      fontSize={12} 
                      fontWeight={600}
                    >
                      {formatValue(d.value)}
                    </text>
                    <text 
                      x={pointX} 
                      y={pointY - 12} 
                      textAnchor="middle" 
                      className="fill-[var(--foreground-muted)]" 
                      fontSize={10}
                    >
                      {d.label}
                    </text>
                  </g>
                </g>
              )}
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) =>
          i % xStep === 0 || i === data.length - 1 ? (
            <text 
              key={i} 
              x={x(i)} 
              y={height - 12} 
              textAnchor="middle" 
              className="fill-[var(--foreground-muted)]" 
              fontSize={10}
              fontWeight={500}
            >
              {d.label}
            </text>
          ) : null
        )}
      </svg>
    </div>
  );
}

export default LineChart;
