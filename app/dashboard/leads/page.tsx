"use client";

import { useMemo, useState } from "react";
import StatusPill from "@/components/dashboard/StatusPill";
import { IconSearch, IconX, IconMail, IconPhone } from "@/components/dashboard/icons";
import {
  LEADS,
  eur,
  leadStatusColor,
  type Lead,
  type LeadStatus,
} from "@/lib/dashboard-data";

const STATUSES: LeadStatus[] = ["Nuovo", "Contattato", "Preventivo", "Chiuso"];
// Parse from parts (not new Date(isoString)) so the local date is stable across
// server/client timezones — avoids hydration mismatches on the formatted label.
const shortDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(LEADS);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "Tutte">("Tutte");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const needle = q.toLowerCase().trim();
    return leads
      .filter((l) => (filter === "Tutte" ? true : l.status === filter))
      .filter(
        (l) =>
          !needle ||
          l.nome.toLowerCase().includes(needle) ||
          l.email.toLowerCase().includes(needle) ||
          l.servizio.toLowerCase().includes(needle)
      )
      .sort((a, b) => +new Date(b.data) - +new Date(a.data));
  }, [leads, q, filter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { Tutte: leads.length };
    STATUSES.forEach((s) => (c[s] = leads.filter((l) => l.status === s).length));
    return c;
  }, [leads]);

  const open = leads.find((l) => l.id === openId) ?? null;
  const setStatus = (id: string, status: LeadStatus) =>
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-gold">Richieste</p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-cream md:text-3xl">
            Gestione lead
          </h2>
        </div>
        <p className="text-sm text-cream-dim">
          {rows.length} di {leads.length} richieste
        </p>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 rounded-lg border border-line bg-charcoal-2/60 px-3 sm:w-72">
          <IconSearch className="h-4 w-4 text-cream-dim" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cerca nome, email, servizio…"
            className="w-full bg-transparent py-2.5 text-sm text-cream outline-none placeholder:text-cream-dim"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["Tutte", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                filter === s
                  ? "border-gold/50 bg-gold/10 text-gold"
                  : "border-line text-cream-dim hover:text-cream"
              }`}
            >
              {s} <span className="opacity-60">{counts[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-line bg-charcoal-2/60">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-cream-dim">
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Servizio</th>
                <th className="px-5 py-3 font-medium">Valore</th>
                <th className="px-5 py-3 font-medium">Fonte</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Stato</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr
                  key={l.id}
                  onClick={() => setOpenId(l.id)}
                  className="cursor-pointer border-b border-line/60 transition-colors last:border-0 hover:bg-slate/40"
                >
                  <td className="px-5 py-3.5">
                    <p className="text-cream">{l.nome}</p>
                    <p className="text-xs text-cream-dim">{l.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-cream-dim">{l.servizio}</td>
                  <td className="px-5 py-3.5 text-cream">{eur(l.valore)}</td>
                  <td className="px-5 py-3.5 text-cream-dim">{l.fonte}</td>
                  <td className="px-5 py-3.5 text-cream-dim">{shortDate(l.data)}</td>
                  <td className="px-5 py-3.5">
                    <StatusPill label={l.status} color={leadStatusColor[l.status]} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-cream-dim">
                    Nessuna richiesta trovata.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail slide-over */}
      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={() => setOpenId(null)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-charcoal-2 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gold">{open.id}</p>
                <h3 className="mt-1 font-display text-xl text-cream">{open.nome}</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                aria-label="Chiudi"
                className="rounded-lg border border-line p-2 text-cream-dim transition-colors hover:text-cream"
              >
                <IconX />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              <div className="grid grid-cols-2 gap-4">
                <Info label="Servizio" value={open.servizio} />
                <Info label="Valore stimato" value={eur(open.valore)} />
                <Info label="Fonte" value={open.fonte} />
                <Info label="Data" value={shortDate(open.data)} />
              </div>

              <div className="space-y-2">
                <a
                  href={`mailto:${open.email}`}
                  className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm text-cream transition-colors hover:border-gold/40"
                >
                  <IconMail className="h-5 w-5 text-gold" /> {open.email}
                </a>
                <a
                  href={`tel:${open.telefono.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm text-cream transition-colors hover:border-gold/40"
                >
                  <IconPhone className="h-5 w-5 text-gold" /> {open.telefono}
                </a>
              </div>

              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cream-dim">Messaggio</p>
                <p className="rounded-xl border border-line bg-charcoal/40 p-4 text-sm leading-relaxed text-cream-dim">
                  {open.messaggio}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cream-dim">
                  Cambia stato
                </p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(open.id, s)}
                      className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                        open.status === s
                          ? "text-charcoal"
                          : "border-line text-cream-dim hover:text-cream"
                      }`}
                      style={
                        open.status === s
                          ? { backgroundColor: leadStatusColor[s], borderColor: leadStatusColor[s] }
                          : undefined
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-line px-6 py-4">
              <a
                href={`mailto:${open.email}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-gold-light"
              >
                Rispondi via email
              </a>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.15em] text-cream-dim">{label}</p>
      <p className="mt-1 text-sm text-cream">{value}</p>
    </div>
  );
}
