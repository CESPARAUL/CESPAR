"use client";

import { useMemo, useState } from "react";
import type { MagnetometerPoint } from "@/types";

// Standard observatory "magnetogram" (as INTERMAGNET / USGS quick-looks):
// X, Y, Z and the total field F stacked, one shared time axis, so a
// disturbance lines up in time across every component. F is the field's
// overall strength, sqrt(X² + Y² + Z²) - not the sum of the components.

type Field = "x" | "y" | "z" | "f";
type Panel = { field: Field; label: string; color: string };

const WIDTH = 900;
const PANEL_H = 96;
const GAP = 18;
const PAD = { top: 26, right: 16, bottom: 30, left: 16 };
const TICKS = 6;

export function Magnetogram({ points, theme = "dark" }: { points: MagnetometerPoint[]; theme?: "dark" | "light" }) {
  const panels: Panel[] = [
    { field: "x", label: "X · north", color: theme === "dark" ? "#93a4ff" : "#3647b8" },
    { field: "y", label: "Y · east", color: theme === "dark" ? "#6ee7b7" : "#0d9488" },
    { field: "z", label: "Z · vertical", color: theme === "dark" ? "#facc15" : "#b45309" },
    { field: "f", label: "F · total field", color: "var(--color-cespar-red)" },
  ];
  const [hover, setHover] = useState<number | null>(null);
  const grid = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.1)";
  const muted = theme === "dark" ? "rgba(255,255,255,0.45)" : "rgba(15,23,42,0.5)";
  const strong = theme === "dark" ? "rgba(255,255,255,0.85)" : "rgba(15,23,42,0.85)";
  const innerW = WIDTH - PAD.left - PAD.right;
  const height = PAD.top + panels.length * PANEL_H + (panels.length - 1) * GAP + PAD.bottom;
  const xAt = (i: number) => PAD.left + (points.length > 1 ? (i / (points.length - 1)) * innerW : 0);

  const series = useMemo(
    () =>
      (["x", "y", "z", "f"] as Field[]).map((field, n) => {
        const values = points.map((p) => p[field]);
        const min = values.length ? Math.min(...values) : 0;
        const max = values.length ? Math.max(...values) : 1;
        const top = PAD.top + n * (PANEL_H + GAP);
        const y = (v: number) => top + PANEL_H - ((v - min) / (max - min || 1)) * PANEL_H;
        const path = points
          .map((p, i) => `${i ? "L" : "M"}${(PAD.left + (points.length > 1 ? (i / (points.length - 1)) * (WIDTH - PAD.left - PAD.right) : 0)).toFixed(1)},${y(p[field]).toFixed(1)}`)
          .join(" ");
        return { field, min, max, top, y, path };
      }),
    [points],
  );

  if (!points.length) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-xl border border-[var(--mag-card-border)] bg-[var(--mag-card-bg)] text-sm text-[var(--mag-text-faint)]">
        No data for this day
      </div>
    );
  }

  const ticks = Array.from({ length: TICKS }, (_, k) => Math.round((k / (TICKS - 1)) * (points.length - 1)));
  const hovered = hover != null ? points[hover] : null;

  return (
    <div className="rounded-xl border border-[var(--mag-card-border)] bg-[var(--mag-card-bg)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="label-mono text-[11px] text-[var(--mag-text-secondary)]">Magnetogram · nT</span>
        <span className="label-mono text-[11px] text-[var(--mag-text-faint)]">
          {hovered ? `${utc(hovered.timestamp)} UTC` : "Hover or tap to read values"}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        className="mt-2 h-auto w-full touch-none"
        onMouseLeave={() => setHover(null)}
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const rel = ((e.clientX - rect.left) / rect.width) * WIDTH;
          const i = Math.round(((rel - PAD.left) / innerW) * (points.length - 1));
          setHover(Math.max(0, Math.min(points.length - 1, i)));
        }}
      >
        {series.map((s, n) => {
          const panel = panels[n];
          const value = hovered ? hovered[s.field] : null;
          return (
            <g key={s.field}>
              <text x={PAD.left} y={s.top - 8} fontSize="12" fontWeight="600" fill={panel.color}>
                {panel.label}
              </text>
              <text x={WIDTH - PAD.right} y={s.top - 8} fontSize="11" fill={value != null ? strong : muted} textAnchor="end">
                {value != null ? `${value.toFixed(1)} nT` : `${s.min.toFixed(0)}–${s.max.toFixed(0)} nT`}
              </text>
              <rect x={PAD.left} y={s.top} width={innerW} height={PANEL_H} fill="none" stroke={grid} />
              <line x1={PAD.left} x2={WIDTH - PAD.right} y1={s.top + PANEL_H / 2} y2={s.top + PANEL_H / 2} stroke={grid} strokeDasharray="4 6" />
              <path d={s.path} fill="none" stroke={panel.color} strokeWidth="1.4" strokeLinejoin="round" />
              {hover != null && <circle cx={xAt(hover)} cy={s.y(points[hover][s.field])} r="3" fill={panel.color} />}
            </g>
          );
        })}

        {ticks.map((i) => (
          <g key={i}>
            <line x1={xAt(i)} x2={xAt(i)} y1={PAD.top} y2={height - PAD.bottom} stroke={grid} />
            <text
              x={xAt(i)}
              y={height - 10}
              fontSize="11"
              fill={muted}
              textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
            >
              {utc(points[i].timestamp, i === 0 || i === points.length - 1)}
            </text>
          </g>
        ))}

        {hover != null && (
          <line x1={xAt(hover)} x2={xAt(hover)} y1={PAD.top} y2={height - PAD.bottom} stroke={strong} strokeOpacity="0.35" />
        )}
      </svg>
      <p className="mt-2 text-[11px] leading-relaxed text-[var(--mag-text-faint)]">
        Times in UTC. F is the strength of the whole field, √(X² + Y² + Z²), so it isn&apos;t the sum of the three components.
      </p>
    </div>
  );
}

function utc(iso: string, withDate = true) {
  return new Date(iso).toLocaleString(undefined, {
    ...(withDate ? { day: "numeric", month: "short" } : {}),
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}
