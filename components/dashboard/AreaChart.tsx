"use client";

import { useRef, useState } from "react";

type Point = { label: string; value: number };

/*
  Dependency-free area chart with an interactive hover guide + tooltip.
  Pointer x → nearest data point; renders a vertical guide, a dot and a tooltip.
*/
export default function AreaChart({
  data,
  color = "#c6a15b",
  format = (n: number) => String(n),
  height = 240,
}: {
  data: Point[];
  color?: string;
  format?: (n: number) => string;
  height?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const W = 720;
  const H = height;
  const padL = 6, padR = 6, padT = 22, padB = 30;
  const n = data.length;
  const max = Math.max(...data.map((d) => d.value)) * 1.12;

  const x = (i: number) => padL + (i / (n - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - v / max) * (H - padT - padB);

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(n - 1).toFixed(1)},${H - padB} L${x(0).toFixed(1)},${H - padB} Z`;
  const grid = [0.25, 0.5, 0.75, 1].map((f) => padT + f * (H - padT - padB));

  const onMove = (e: React.PointerEvent) => {
    const r = wrap.current!.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    setHover(Math.round(ratio * (n - 1)));
  };

  const hp = hover != null ? data[hover] : null;

  return (
    <div
      ref={wrap}
      className="relative w-full"
      onPointerMove={onMove}
      onPointerLeave={() => setHover(null)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "auto" }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {grid.map((gy, i) => (
          <line key={i} x1={padL} y1={gy} x2={W - padR} y2={gy} stroke="#23282f" strokeWidth="1" />
        ))}

        <path d={area} fill="url(#areaFill)" />
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {data.map((d, i) => (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="fill-cream-dim" style={{ fontSize: 12 }}>
            {d.label}
          </text>
        ))}

        {hp && (
          <g>
            <line x1={x(hover!)} y1={padT} x2={x(hover!)} y2={H - padB} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <circle cx={x(hover!)} cy={y(hp.value)} r="5.5" fill={color} stroke="#0c0e12" strokeWidth="2.5" />
          </g>
        )}
      </svg>

      {hp && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-charcoal-2/95 px-3 py-2 text-center shadow-xl"
          style={{ left: `${(hover! / (n - 1)) * 100}%`, top: 8 }}
        >
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-cream-dim">{hp.label}</p>
          <p className="mt-0.5 font-display text-sm text-cream">{format(hp.value)}</p>
        </div>
      )}
    </div>
  );
}
