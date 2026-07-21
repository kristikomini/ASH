"use client";

import { useMemo, useState } from "react";
import { APPOINTMENTS, apptTypeColor, type Appointment } from "@/lib/dashboard-data";
import { IconChevronRight, IconClock, IconPin } from "@/components/dashboard/icons";

const WD = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const TYPES = ["Sopralluogo", "Consegna", "Riunione"] as const;

export default function CalendarioPage() {
  const [month, setMonth] = useState(() => new Date(2026, 6, 1)); // Luglio 2026
  const [selected, setSelected] = useState("2026-07-22");

  const byDate = useMemo(() => {
    const m: Record<string, Appointment[]> = {};
    APPOINTMENTS.forEach((a) => (m[a.data] ??= []).push(a));
    return m;
  }, []);

  const year = month.getFullYear();
  const mon = month.getMonth();
  const daysInMonth = new Date(year, mon + 1, 0).getDate();
  const firstWd = (new Date(year, mon, 1).getDay() + 6) % 7; // Mon-first
  const iso = (d: number) => `${year}-${String(mon + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const cells: (number | null)[] = [
    ...Array(firstWd).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = month.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
  const selDay = byDate[selected] ?? [];
  const [sy, sm, sd] = selected.split("-").map(Number);
  const selLabel = new Date(sy, sm - 1, sd).toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const shift = (n: number) => setMonth(new Date(year, mon + n, 1));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-gold">Calendario</p>
        <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-cream md:text-3xl">
          Appuntamenti
        </h2>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Month grid */}
        <div className="rounded-2xl border border-line bg-charcoal-2/60 p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-lg capitalize text-cream">{monthLabel}</h3>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => shift(-1)}
                aria-label="Mese precedente"
                className="rotate-180 rounded-lg border border-line p-1.5 text-cream-dim transition-colors hover:text-cream"
              >
                <IconChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => shift(1)}
                aria-label="Mese successivo"
                className="rounded-lg border border-line p-1.5 text-cream-dim transition-colors hover:text-cream"
              >
                <IconChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-cream-dim">
            {WD.map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
            {cells.map((d, i) => {
              if (d === null) return <div key={`e${i}`} />;
              const day = iso(d);
              const appts = byDate[day] ?? [];
              const isSel = day === selected;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelected(day)}
                  className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border text-sm transition-colors ${
                    isSel
                      ? "border-gold/60 bg-gold/10 text-cream"
                      : "border-transparent text-cream hover:border-line hover:bg-slate/40"
                  }`}
                >
                  <span>{d}</span>
                  <span className="flex h-1.5 gap-0.5">
                    {appts.slice(0, 3).map((a) => (
                      <span
                        key={a.id}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: apptTypeColor[a.tipo] }}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-4 border-t border-line pt-4">
            {TYPES.map((t) => (
              <span key={t} className="flex items-center gap-2 text-xs text-cream-dim">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: apptTypeColor[t] }} />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Agenda for selected day */}
        <div className="rounded-2xl border border-line bg-charcoal-2/60 p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Agenda</p>
          <h3 className="mt-1 font-display text-lg capitalize text-cream">{selLabel}</h3>

          <ul className="mt-5 space-y-3">
            {selDay.length === 0 && (
              <li className="rounded-xl border border-dashed border-line px-4 py-10 text-center text-sm text-cream-dim">
                Nessun appuntamento in programma.
              </li>
            )}
            {selDay
              .sort((a, b) => a.ora.localeCompare(b.ora))
              .map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-line bg-charcoal/40 p-4"
                  style={{ borderLeftColor: apptTypeColor[a.tipo], borderLeftWidth: 3 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-cream">{a.titolo}</span>
                    <span className="text-xs" style={{ color: apptTypeColor[a.tipo] }}>
                      {a.tipo}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-cream-dim">{a.cliente}</p>
                  <p className="mt-2 flex items-center gap-3 text-xs text-cream-dim">
                    <span className="inline-flex items-center gap-1">
                      <IconClock className="h-3.5 w-3.5" /> {a.ora}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <IconPin className="h-3.5 w-3.5" /> {a.luogo}
                    </span>
                  </p>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
