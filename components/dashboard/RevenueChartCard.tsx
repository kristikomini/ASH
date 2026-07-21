"use client";

import { useState } from "react";
import AreaChart from "./AreaChart";
import { MONTHLY, eur } from "@/lib/dashboard-data";

export default function RevenueChartCard() {
  const [tab, setTab] = useState<"ricavi" | "lead">("ricavi");
  const data = MONTHLY.map((m) => ({
    label: m.mese,
    value: tab === "ricavi" ? m.ricavi : m.lead,
  }));
  const format =
    tab === "ricavi" ? eur : (n: number) => `${Math.round(n)} richieste`;

  return (
    <div className="rounded-2xl border border-line bg-charcoal-2/60 p-5 md:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-lg text-cream">Andamento</h3>
          <p className="text-sm text-cream-dim">Ultimi 8 mesi</p>
        </div>
        <div className="flex rounded-lg border border-line p-0.5 text-sm">
          {(["ricavi", "lead"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1.5 transition-colors ${
                tab === t ? "bg-slate text-cream" : "text-cream-dim hover:text-cream"
              }`}
            >
              {t === "ricavi" ? "Ricavi" : "Richieste"}
            </button>
          ))}
        </div>
      </div>
      <AreaChart data={data} format={format} color="#c6a15b" />
    </div>
  );
}
