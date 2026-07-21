"use client";

import { useState } from "react";
import {
  DPROJECTS,
  eur,
  projectStatusColor,
  type DProject,
  type ProjectStatus,
} from "@/lib/dashboard-data";
import { IconPin } from "@/components/dashboard/icons";

const COLUMNS: ProjectStatus[] = ["Preventivo", "In corso", "Completato"];

export default function ProgettiPage() {
  const [projects, setProjects] = useState<DProject[]>(DPROJECTS);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<ProjectStatus | null>(null);

  const move = (id: string, status: ProjectStatus) => {
    setProjects((ps) =>
      ps.map((p) =>
        p.id === id
          ? { ...p, status, avanzamento: status === "Completato" ? 100 : status === "Preventivo" ? 0 : p.avanzamento || 10 }
          : p
      )
    );
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-gold">Progetti</p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-cream md:text-3xl">
            Bacheca cantieri
          </h2>
          <p className="mt-1 text-sm text-cream-dim">
            Trascina le schede per aggiornare lo stato.
          </p>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = projects.filter((p) => p.status === col);
          const total = items.reduce((s, p) => s + p.valore, 0);
          return (
            <div
              key={col}
              onDragOver={(e) => {
                e.preventDefault();
                setOverCol(col);
              }}
              onDragLeave={() => setOverCol((c) => (c === col ? null : c))}
              onDrop={() => {
                if (dragId) move(dragId, col);
                setDragId(null);
                setOverCol(null);
              }}
              className={`flex flex-col rounded-2xl border bg-charcoal-2/40 transition-colors ${
                overCol === col ? "border-gold/50 bg-slate/30" : "border-line"
              }`}
            >
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-cream">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: projectStatusColor[col] }}
                  />
                  {col}
                  <span className="text-cream-dim">{items.length}</span>
                </span>
                <span className="text-xs text-cream-dim">{eur(total)}</span>
              </div>

              <div className="flex-1 space-y-3 p-3">
                {items.map((p) => (
                  <article
                    key={p.id}
                    draggable
                    onDragStart={() => setDragId(p.id)}
                    onDragEnd={() => setDragId(null)}
                    className={`cursor-grab overflow-hidden rounded-xl border border-line bg-charcoal-2 transition-opacity active:cursor-grabbing ${
                      dragId === p.id ? "opacity-40" : ""
                    }`}
                  >
                    <div className="relative h-24 w-full overflow-hidden bg-slate">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.img}
                        alt=""
                        className="h-full w-full object-cover"
                        style={{ filter: "brightness(0.7) saturate(0.85)" }}
                      />
                      <span className="absolute left-2 top-2 rounded-md bg-charcoal/70 px-2 py-0.5 text-[0.65rem] text-gold backdrop-blur">
                        {p.categoria}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-sm text-cream">{p.titolo}</h3>
                        <span className="shrink-0 text-xs text-cream-dim">{p.id}</span>
                      </div>
                      <p className="mt-1 text-xs text-cream-dim">{p.cliente}</p>
                      <p className="mt-2 flex items-center gap-1 text-xs text-cream-dim">
                        <IconPin className="h-3.5 w-3.5" /> {p.luogo}
                      </p>

                      {/* progress */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-cream-dim">Avanzamento</span>
                          <span className="text-cream">{p.avanzamento}%</span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate">
                          <div
                            className="h-full rounded-full bg-gold transition-[width] duration-500"
                            style={{ width: `${p.avanzamento}%` }}
                          />
                        </div>
                      </div>

                      <p className="mt-3 font-display text-sm text-cream">{eur(p.valore)}</p>
                    </div>
                  </article>
                ))}
                {items.length === 0 && (
                  <p className="rounded-xl border border-dashed border-line px-4 py-8 text-center text-xs text-cream-dim">
                    Rilascia qui una scheda
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
