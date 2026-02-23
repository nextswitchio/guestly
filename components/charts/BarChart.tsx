"use client";
import React from "react";

interface BarItem {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: BarItem[];
  height?: number;
  formatValue?: (v: number) => string;
}

export default function BarChart({
  data,
  height = 200,
  formatValue = (v) => v.toLocaleString(),
}: BarChartProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50" style={{ height }}>
        <p className="text-xs text-neutral-400">No data available</p>
      </div>
    );
  }

  const padding = { top: 16, right: 16, bottom: 36, left: 52 };
  const width = 400;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.value));
  const barGap = 16;
  const barW = Math.min(60, (chartW - barGap * (data.length - 1)) / data.length);
  const totalBarsW = barW * data.length + barGap * (data.length - 1);
  const offsetX = padding.left + (chartW - totalBarsW) / 2;

  // Y-axis ticks
  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => Math.round((maxVal / tickCount) * i));

  function y(v: number) {
    return padding.top + chartH - (v / (maxVal || 1)) * chartH;
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      {/* Grid */}
      {yTicks.map((tick) => (
        <g key={tick}>
          <line
            x1={padding.left}
            y1={y(tick)}
            x2={width - padding.right}
            y2={y(tick)}
            stroke="#e5e7eb"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          <text x={padding.left - 8} y={y(tick) + 4} textAnchor="end" className="fill-neutral-400" fontSize={10}>
            {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
          </text>
        </g>
      ))}

      {/* Bars */}
      {data.map((d, i) => {
        const bx = offsetX + i * (barW + barGap);
        const bh = (d.value / (maxVal || 1)) * chartH;
        const by = padding.top + chartH - bh;
        const isHov = hovered === i;

        return (
          <g
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="cursor-pointer"
          >
            <rect x={bx} y={by} width={barW} height={bh} rx={6} fill={d.color} opacity={isHov ? 1 : 0.85} />

            {/* Label */}
            <text x={bx + barW / 2} y={height - 10} textAnchor="middle" className="fill-neutral-500" fontSize={10}>
              {d.label}
            </text>

            {/* Tooltip */}
            {isHov && (
              <>
                <rect x={bx + barW / 2 - 36} y={by - 28} width={72} height={22} rx={6} fill="#1f2937" />
                <text x={bx + barW / 2} y={by - 14} textAnchor="middle" fill="white" fontSize={11} fontWeight={600}>
                  {formatValue(d.value)}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
