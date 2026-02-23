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
}

export default function LineChart({
  data,
  height = 200,
  color = "#6366f1",
  showArea = true,
  formatValue = (v) => v.toLocaleString(),
}: LineChartProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50" style={{ height }}>
        <p className="text-xs text-neutral-400">No data available</p>
      </div>
    );
  }

  const padding = { top: 20, right: 16, bottom: 32, left: 56 };
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

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
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
            {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : Math.round(tick)}
          </text>
        </g>
      ))}

      {/* Area */}
      {showArea && (
        <path d={areaPath} fill={color} opacity={0.08} />
      )}

      {/* Line */}
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

      {/* X-axis labels */}
      {data.map((d, i) =>
        i % xStep === 0 || i === data.length - 1 ? (
          <text key={i} x={x(i)} y={height - 8} textAnchor="middle" className="fill-neutral-400" fontSize={10}>
            {d.label}
          </text>
        ) : null
      )}

      {/* Hover dots & tooltip */}
      {data.map((d, i) => (
        <g
          key={i}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          className="cursor-pointer"
        >
          <rect x={x(i) - 12} y={padding.top} width={24} height={chartH} fill="transparent" />
          {hovered === i && (
            <>
              <line x1={x(i)} y1={padding.top} x2={x(i)} y2={padding.top + chartH} stroke={color} strokeWidth={1} opacity={0.3} strokeDasharray="4 2" />
              <circle cx={x(i)} cy={y(d.value)} r={5} fill="white" stroke={color} strokeWidth={2} />
              <rect x={x(i) - 40} y={y(d.value) - 28} width={80} height={22} rx={6} fill="#1f2937" />
              <text x={x(i)} y={y(d.value) - 14} textAnchor="middle" fill="white" fontSize={11} fontWeight={600}>
                {formatValue(d.value)}
              </text>
            </>
          )}
        </g>
      ))}
    </svg>
  );
}
