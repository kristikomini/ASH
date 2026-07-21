import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChartCard from "@/components/dashboard/RevenueChartCard";
import DonutChart from "@/components/dashboard/DonutChart";
import StatusPill from "@/components/dashboard/StatusPill";
import {
  IconInbox,
  IconEuro,
  IconLayers,
  IconTrend,
  IconChevronRight,
  IconClock,
  IconPin,
} from "@/components/dashboard/icons";
import {
  LEADS,
  DPROJECTS,
  APPOINTMENTS,
  MONTHLY,
  SERVICE_SPLIT,
  eur,
  leadStatusColor,
  apptTypeColor,
} from "@/lib/dashboard-data";

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short" });

const pct = (a: number, b: number) => Math.round(((a - b) / b) * 100);

export default function DashboardHome() {
  const last = MONTHLY[MONTHLY.length - 1];
  const prev = MONTHLY[MONTHLY.length - 2];
  const attivi = DPROJECTS.filter((p) => p.status === "In corso").length;
  const chiusi = LEADS.filter((l) => l.status === "Chiuso").length;
  const conversione = Math.round((chiusi / LEADS.length) * 100);

  const recentLeads = LEADS.slice(0, 5);
  const upcoming = APPOINTMENTS.slice(0, 5);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-gold">Panoramica</p>
        <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-cream md:text-3xl">
          Buongiorno, Ahmed
        </h2>
        <p className="mt-1 text-sm text-cream-dim">
          Ecco il riepilogo della tua attività questo mese.
        </p>
      </header>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Richieste (mese)"
          value={last.lead}
          delta={pct(last.lead, prev.lead)}
          spark={MONTHLY.map((m) => m.lead)}
          icon={<IconInbox />}
        />
        <StatCard
          label="Ricavi (mese)"
          value={last.ricavi}
          format="eur"
          delta={pct(last.ricavi, prev.ricavi)}
          spark={MONTHLY.map((m) => m.ricavi)}
          icon={<IconEuro />}
        />
        <StatCard
          label="Progetti attivi"
          value={attivi}
          delta={pct(last.progetti, prev.progetti)}
          spark={MONTHLY.map((m) => m.progetti)}
          icon={<IconLayers />}
        />
        <StatCard
          label="Tasso conversione"
          value={conversione}
          format="percent"
          delta={6}
          icon={<IconTrend />}
        />
      </div>

      {/* Chart + donut */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChartCard />
        </div>
        <div className="rounded-2xl border border-line bg-charcoal-2/60 p-5 md:p-6">
          <h3 className="font-display text-lg text-cream">Mix servizi</h3>
          <p className="mb-6 text-sm text-cream-dim">Distribuzione richieste</p>
          <DonutChart data={SERVICE_SPLIT} />
        </div>
      </div>

      {/* Recent leads + upcoming */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-charcoal-2/60 p-5 md:col-span-1 md:p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-lg text-cream">Richieste recenti</h3>
            <Link
              href="/dashboard/leads"
              className="inline-flex items-center gap-1 text-sm text-gold transition-colors hover:text-gold-light"
            >
              Tutte <IconChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {recentLeads.map((l) => (
              <li key={l.id} className="flex items-center gap-4 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate/70 font-display text-xs text-cream">
                  {l.nome.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-cream">{l.nome}</p>
                  <p className="truncate text-xs text-cream-dim">{l.servizio}</p>
                </div>
                <div className="hidden sm:block">
                  <StatusPill label={l.status} color={leadStatusColor[l.status]} />
                </div>
                <div className="w-20 shrink-0 text-right">
                  <p className="text-sm text-cream">{eur(l.valore)}</p>
                  <p className="text-xs text-cream-dim">{shortDate(l.data)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-charcoal-2/60 p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-lg text-cream">Prossimi appuntamenti</h3>
            <Link
              href="/dashboard/calendario"
              className="inline-flex items-center gap-1 text-sm text-gold transition-colors hover:text-gold-light"
            >
              <IconChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="space-y-4">
            {upcoming.map((a) => (
              <li key={a.id} className="flex gap-3">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: apptTypeColor[a.tipo] }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-cream">{a.titolo}</p>
                  <p className="truncate text-xs text-cream-dim">{a.cliente}</p>
                  <p className="mt-1 flex items-center gap-3 text-xs text-cream-dim">
                    <span className="inline-flex items-center gap-1">
                      <IconClock className="h-3.5 w-3.5" />
                      {shortDate(a.data)} · {a.ora}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <IconPin className="h-3.5 w-3.5" />
                      {a.luogo}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
