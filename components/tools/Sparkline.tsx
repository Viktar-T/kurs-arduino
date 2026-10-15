"use client";

/**
 * Small trend chart for one column of the Rejestrator CSV dashboard.
 * One series, one accent colour, gaps where a measurement is missing.
 * Hover (or touch) shows a crosshair and the value of the nearest point.
 */
import { useId, useState } from "react";

export interface SparkPoint {
  /** `null` = no measurement (empty CSV field). */
  value: number | null;
  /** Label shown in the hover readout, e.g. the computer time. */
  label: string;
}

interface SparklineProps {
  points: SparkPoint[];
  unit: string;
  /** Decimal places for min / max / hover readouts (as the board sends them). */
  decimals: number;
  /** Accessible name of the chart, e.g. "Temperatura w szafie". */
  title: string;
}

const WIDTH = 240;
const HEIGHT = 56;
const PAD_Y = 6;

export function Sparkline({ points, unit, decimals, title }: SparklineProps) {
  const [hover, setHover] = useState<number | null>(null);
  const titleId = useId();

  const values = points
    .map((p) => p.value)
    .filter((v): v is number => v !== null);
  if (values.length === 0) {
    return (
      <p className="flex h-14 items-center text-xs text-[var(--article-muted)]">
        Brak pomiarów do narysowania.
      </p>
    );
  }

  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const step = points.length > 1 ? WIDTH / (points.length - 1) : 0;
  const x = (i: number) => (points.length > 1 ? i * step : WIDTH / 2);
  const y = (v: number) =>
    PAD_Y + (HEIGHT - 2 * PAD_Y) * (1 - (v - min) / (max - min));

  // One path segment per unbroken run of measurements.
  let path = "";
  const lonePoints: number[] = [];
  points.forEach((p, i) => {
    if (p.value === null) return;
    const prev = points[i - 1]?.value ?? null;
    const next = points[i + 1]?.value ?? null;
    if (prev === null && next === null) lonePoints.push(i);
    path += `${prev === null ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)} `;
  });

  const hovered = hover === null ? null : points[hover];

  function onPointerMove(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const index = Math.round(ratio * (points.length - 1));
    setHover(Math.min(points.length - 1, Math.max(0, index)));
  }

  return (
    <div>
      <div className="mb-1 flex h-4 items-baseline justify-between text-[11px] text-[var(--article-muted)]">
        {hovered ? (
          <>
            <span>{hovered.label}</span>
            <span className="font-semibold text-[#243236]">
              {hovered.value === null
                ? "brak pomiaru"
                : `${hovered.value.toFixed(decimals)}${unit ? ` ${unit}` : ""}`}
            </span>
          </>
        ) : (
          <>
            <span>min {Math.min(...values).toFixed(decimals)}</span>
            <span>max {Math.max(...values).toFixed(decimals)}</span>
          </>
        )}
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        role="img"
        aria-labelledby={titleId}
        className="block h-14 w-full touch-none overflow-visible"
        onPointerMove={onPointerMove}
        onPointerDown={onPointerMove}
        onPointerLeave={() => setHover(null)}
      >
        <title id={titleId}>{`${title}: ostatnie ${points.length} pomiarów`}</title>
        <line
          x1={0}
          x2={WIDTH}
          y1={HEIGHT - 0.5}
          y2={HEIGHT - 0.5}
          stroke="var(--forbot-line)"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={path}
          fill="none"
          stroke="var(--forbot-green)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {lonePoints.map((i) => (
          <circle
            key={i}
            cx={x(i)}
            cy={y(points[i].value as number)}
            r={2}
            fill="var(--forbot-green)"
          />
        ))}
        {hover !== null && (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={0}
            y2={HEIGHT}
            stroke="#465157"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    </div>
  );
}
