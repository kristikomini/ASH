"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { IconArrowUp, IconArrowDown } from "./icons";
import { eur } from "@/lib/dashboard-data";

/*
  KPI card: GSAP count-up + mini sparkline + delta. `format` is a string (not a
  function) so the card can be rendered from server components (functions can't
  cross the server→client boundary).
*/
export type StatFormat = "number" | "eur" | "percent";

export default function StatCard({
  label,
  value,
  format = "number",
  delta,
  spark,
  icon,
}: {
  label: string;
  value: number;
  format?: StatFormat;
  delta?: number;
  spark?: number[];
  icon?: React.ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  const fmt = (n: number) => {
    const r = Math.round(n);
    if (format === "eur") return eur(r);
    if (format === "percent") return `${r}%`;
    return new Intl.NumberFormat("it-IT").format(r);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          base: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { reduce } = ctx.conditions as { reduce: boolean };
          if (reduce || !num.current) return;
          const o = { v: 0 };
          gsap.to(o, {
            v: value,
            duration: 1.3,
            ease: "power2.out",
            onUpdate: () => {
              if (num.current) num.current.textContent = fmt(o.v);
            },
          });
        }
      );
    },
    { scope: root }
  );

  const up = (delta ?? 0) >= 0;
  const sparkPath = spark && spark.length > 1 ? buildSpark(spark) : null;

  return (
    <div
      ref={root}
      className="group relative overflow-hidden rounded-2xl border border-line bg-charcoal-2/60 p-5 transition-colors hover:border-gold/40"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-slate/60 text-gold">
          {icon}
        </div>
        {delta != null && (
          <span
            className="inline-flex items-center gap-1 text-xs font-medium"
            style={{ color: up ? "#6fae8f" : "#c9714e" }}
          >
            {up ? <IconArrowUp className="h-3.5 w-3.5" /> : <IconArrowDown className="h-3.5 w-3.5" />}
            {up ? "+" : ""}
            {delta}%
          </span>
        )}
      </div>

      <p className="mt-5 text-xs uppercase tracking-[0.22em] text-cream-dim">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-cream">
        <span ref={num}>{fmt(value)}</span>
      </p>

      {sparkPath && (
        <svg viewBox="0 0 100 30" className="mt-3 h-8 w-full" preserveAspectRatio="none">
          <path d={sparkPath.area} fill="#c6a15b" fillOpacity="0.12" />
          <path d={sparkPath.line} fill="none" stroke="#c6a15b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
    </div>
  );
}

function buildSpark(vals: number[]) {
  const n = vals.length;
  const max = Math.max(...vals), min = Math.min(...vals);
  const span = max - min || 1;
  const x = (i: number) => (i / (n - 1)) * 100;
  const y = (v: number) => 28 - ((v - min) / span) * 26;
  const line = vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L100,30 L0,30 Z`;
  return { line, area };
}
