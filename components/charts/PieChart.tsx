"use client";
import React from "react";

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: Segment[];
  size?: number;
}

export default function PieChart({ data, size = 200 }: PieChartProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);

  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50" style={{ width: size, height: size }}>
        <p className="text-xs text-neutral-400">No data</p>
      </div>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;
  const innerR = r * 0.55; // donut

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

    const outerStart = polarToCartesian(start, r);
    const outerEnd = polarToCartesian(end, r);
    const innerEnd = polarToCartesian(end, innerR);
    const innerStart = polarToCartesian(start, innerR);

    const path = [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
      "Z",
    ].join(" ");

    const midAngle = start + angle / 2;
    const labelR = r + 16;
    const labelPos = polarToCartesian(midAngle, labelR);

    return { path, color: d.color, label: d.label, value: d.value, pct: Math.round((d.value / total) * 100), labelPos, index: i };
  });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {arcs.map((arc) => (
          <path
            key={arc.index}
            d={arc.path}
            fill={arc.color}
            opacity={hovered === null || hovered === arc.index ? 1 : 0.4}
            onMouseEnter={() => setHovered(arc.index)}
            onMouseLeave={() => setHovered(null)}
            className="cursor-pointer transition-opacity duration-200"
            stroke="white"
            strokeWidth={2}
          />
        ))}
        {/* Center label */}
        {hovered !== null && (
          <>
            <text x={cx} y={cy - 4} textAnchor="middle" className="fill-neutral-900" fontSize={20} fontWeight={700}>
              {arcs[hovered].pct}%
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" className="fill-neutral-500" fontSize={11}>
              {arcs[hovered].label}
            </text>
          </>
        )}
        {hovered === null && (
          <text x={cx} y={cy + 5} textAnchor="middle" className="fill-neutral-400" fontSize={11}>
            Hover to view
          </text>
        )}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 sm:flex-col">
        {data.map((d, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 transition-opacity ${hovered !== null && hovered !== i ? "opacity-40" : ""}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-neutral-700">{d.label}</span>
            <span className="text-xs font-semibold text-neutral-900 tabular-nums">{Math.round((d.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
