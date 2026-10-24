"use client";

import { useMemo, useState } from "react";
import type { MagnetometerPoint } from "@/types";

const WIDTH = 800;
const HEIGHT = 220;
const PADDING = { top: 16, right: 16, bottom: 28, left: 56 };

export function FieldChart({
  points,
  field,
  label,
  unit = "nT",
  color = "var(--color-cespar-red)",
  theme = "dark",
}: {
  points: MagnetometerPoint[];
  field: "x" | "y" | "z" | "f";
  label: string;
  unit?: string;
  color?: string;
  theme?: "dark" | "light";
}) {
  const [hover, setHover] = useState<{ x: number; point: MagnetometerPoint } | null>(null);
  const gridColor = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.1)";
  const crosshairColor = theme === "dark" ? "rgba(255,255,255,0.25)" : "rgba(15,23,42,0.25)";
  const axisTextColor = theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.45)";

  const { path, min, max, coords } = useMemo(() => {
    const values = points.map((p) => p[field]);
    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 1;
    const span = max - min || 1;
    const innerW = WIDTH - PADDING.left - PADDING.right;
    const innerH = HEIGHT - PADDING.top - PADDING.bottom;

    const coords = points.map((p, i) => {
      const x = PADDING.left + (points.length > 1 ? (i / (points.length - 1)) * innerW : 0);
      const y = PADDING.top + innerH - ((p[field] - min) / span) * innerH;
      return { x, y, point: p };
    });

    const path = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(" ");
    return { path, min, max, coords };
  }, [points, field]);

  if (points.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-xl border border-[var(--mag-card-border)] bg-[var(--mag-card-bg)] text-sm text-[var(--mag-text-faint)]">
        No data in this window
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--mag-card-border)] bg-[var(--mag-card-bg)] p-4">
      <div className="flex items-center justify-between">
        <span className="label-mono text-[11px] text-[var(--mag-text-secondary)]">{label}</span>
        <span className="label-mono text-[11px] text-[var(--mag-text-faint)]">
          {hover ? `${hover.point[field].toFixed(1)} ${unit}` : `${min.toFixed(0)}–${max.toFixed(0)} ${unit}`}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mt-2 h-auto w-full"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const svg = e.currentTarget;
          const rect = svg.getBoundingClientRect();
          const relX = ((e.clientX - rect.left) / rect.width) * WIDTH;
          let nearest = coords[0];
          let nearestDist = Infinity;
          for (const c of coords) {
            const d = Math.abs(c.x - relX);
            if (d < nearestDist) {
              nearestDist = d;
              nearest = c;
            }
          }
          setHover({ x: nearest.x, point: nearest.point });
        }}
      >
        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            x1={PADDING.left}
            x2={WIDTH - PADDING.right}
            y1={PADDING.top + t * (HEIGHT - PADDING.top - PADDING.bottom)}
            y2={PADDING.top + t * (HEIGHT - PADDING.top - PADDING.bottom)}
            stroke={gridColor}
            strokeDasharray="4 6"
          />
        ))}

        <path d={path} fill="none" stroke={color} strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />

        {hover && (
          <>
            <line
              x1={hover.x}
              x2={hover.x}
              y1={PADDING.top}
              y2={HEIGHT - PADDING.bottom}
              stroke={crosshairColor}
            />
            <circle cx={hover.x} cy={coords.find((c) => c.point === hover.point)?.y ?? 0} r="3.5" fill={color} />
          </>
        )}

        <text x={PADDING.left} y={HEIGHT - 8} fontSize="10" fill={axisTextColor}>
          {formatTick(points[0].timestamp)}
        </text>
        <text x={WIDTH - PADDING.right} y={HEIGHT - 8} fontSize="10" fill={axisTextColor} textAnchor="end">
          {hover ? formatTick(hover.point.timestamp) : formatTick(points[points.length - 1].timestamp)}
        </text>
      </svg>
    </div>
  );
}

function formatTick(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
