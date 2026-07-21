type Slice = { nome: string; valore: number; colore: string };

/* Donut built from stroke-dasharray arcs; legend beside it. `valore` sums to 100. */
export default function DonutChart({ data }: { data: Slice[] }) {
  const total = data.reduce((s, d) => s + d.valore, 0);
  const R = 46;
  const C = 2 * Math.PI * R;
  let acc = 0;

  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-10">
      <div className="relative shrink-0">
        <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90">
          <circle cx="60" cy="60" r={R} fill="none" stroke="#1b2028" strokeWidth="13" />
          {data.map((d) => {
            const len = (d.valore / total) * C;
            const seg = (
              <circle
                key={d.nome}
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke={d.colore}
                strokeWidth="13"
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-acc}
                strokeLinecap="butt"
              />
            );
            acc += len;
            return seg;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-semibold text-cream">{total}%</span>
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-cream-dim">Mix</span>
        </div>
      </div>

      <ul className="grid w-full grid-cols-1 gap-y-3">
        {data.map((d) => (
          <li key={d.nome} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2.5 text-sm text-cream-dim">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: d.colore }} />
              {d.nome}
            </span>
            <span className="font-display text-sm text-cream">{d.valore}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
