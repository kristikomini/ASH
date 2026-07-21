import StatCard from "@/components/dashboard/StatCard";
import StatusPill from "@/components/dashboard/StatusPill";
import { IconFile, IconEuro, IconTrend, IconChevronRight } from "@/components/dashboard/icons";
import { eur } from "@/lib/dashboard-data";

type QStatus = "Bozza" | "Inviato" | "Accettato" | "Rifiutato";
const qColor: Record<QStatus, string> = {
  Bozza: "#98958d",
  Inviato: "#7aa2d0",
  Accettato: "#6fae8f",
  Rifiutato: "#c9714e",
};

const PREVENTIVI: {
  id: string;
  cliente: string;
  servizio: string;
  importo: number;
  stato: QStatus;
  data: string;
}[] = [
  { id: "PR-088", cliente: "Studio Marasca", servizio: "Cartongesso", importo: 24000, stato: "Inviato", data: "2026-07-20" },
  { id: "PR-087", cliente: "Fam. De Santis", servizio: "Intonachino", importo: 31000, stato: "Accettato", data: "2026-07-18" },
  { id: "PR-086", cliente: "P. Gentili", servizio: "Sistemi a secco", importo: 33800, stato: "Inviato", data: "2026-07-16" },
  { id: "PR-085", cliente: "Elena Rossi", servizio: "Tinteggiatura", importo: 9400, stato: "Bozza", data: "2026-07-14" },
  { id: "PR-084", cliente: "Aurora S.r.l.", servizio: "Carta da parati", importo: 12800, stato: "Accettato", data: "2026-07-08" },
  { id: "PR-083", cliente: "Conti Edil", servizio: "Cartongesso", importo: 21200, stato: "Accettato", data: "2026-07-05" },
  { id: "PR-082", cliente: "M. Bellini", servizio: "Rasatura armata", importo: 18500, stato: "Rifiutato", data: "2026-06-30" },
  { id: "PR-081", cliente: "F. Neri", servizio: "Rasatura armata", importo: 7600, stato: "Inviato", data: "2026-06-28" },
];

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" });

export default function PreventiviPage() {
  const inviati = PREVENTIVI.filter((p) => p.stato === "Inviato" || p.stato === "Accettato");
  const accettati = PREVENTIVI.filter((p) => p.stato === "Accettato");
  const inTrattativa = PREVENTIVI.filter((p) => p.stato === "Inviato").reduce((s, p) => s + p.importo, 0);
  const decisi = PREVENTIVI.filter((p) => p.stato === "Accettato" || p.stato === "Rifiutato").length;
  const tasso = decisi ? Math.round((accettati.length / decisi) * 100) : 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-gold">Preventivi</p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-cream md:text-3xl">
            Offerte
          </h2>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-gold-light">
          Nuovo preventivo
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Preventivi attivi" value={inviati.length} icon={<IconFile />} />
        <StatCard label="In trattativa" value={inTrattativa} format="eur" icon={<IconEuro />} />
        <StatCard label="Tasso accettazione" value={tasso} format="percent" icon={<IconTrend />} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-charcoal-2/60">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-cream-dim">
                <th className="px-5 py-3 font-medium">N°</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Servizio</th>
                <th className="px-5 py-3 font-medium">Importo</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Stato</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {PREVENTIVI.map((p) => (
                <tr
                  key={p.id}
                  className="group border-b border-line/60 transition-colors last:border-0 hover:bg-slate/40"
                >
                  <td className="px-5 py-3.5 font-display text-gold">{p.id}</td>
                  <td className="px-5 py-3.5 text-cream">{p.cliente}</td>
                  <td className="px-5 py-3.5 text-cream-dim">{p.servizio}</td>
                  <td className="px-5 py-3.5 text-cream">{eur(p.importo)}</td>
                  <td className="px-5 py-3.5 text-cream-dim">{shortDate(p.data)}</td>
                  <td className="px-5 py-3.5">
                    <StatusPill label={p.stato} color={qColor[p.stato]} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <IconChevronRight className="ml-auto h-4 w-4 text-cream-dim opacity-0 transition-opacity group-hover:opacity-100" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
