"use client";

import { scrollToTop } from "@/lib/lenis";

export default function Footer() {
  const goTop = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTop();
  };
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-charcoal px-6 py-14 md:px-12">
      <div className="mx-auto grid max-w-[100rem] gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        {/* Brand + slogan */}
        <div>
          <a
            href="#top"
            onClick={goTop}
            className="group inline-flex items-center gap-3"
            aria-label="A.S.H. Finiture Contract — torna su"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-mark.png"
              alt=""
              aria-hidden
              className="h-9 w-auto transition-transform duration-500 group-hover:rotate-[-6deg]"
            />
            <span className="text-metal font-display text-xl font-bold tracking-arch">
              A.S.H.
            </span>
          </a>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream-dim">
            Qualità e precisione per ogni spazio. Finiture d&apos;interni di alta
            gamma nelle Marche.
          </p>
        </div>

        {/* Contatti */}
        <div>
          <p className="eyebrow mb-4 text-gold">Contatti</p>
          <a
            href="mailto:ashfiniturecontract@outlook.it"
            className="block break-all text-sm text-cream transition-colors hover:text-gold"
          >
            ashfiniturecontract@outlook.it
          </a>
          <a
            href="tel:+393296447797"
            className="mt-3 block text-sm text-cream-dim transition-colors hover:text-gold"
          >
            329 644 7797
          </a>
          <a
            href="tel:+393383386946"
            className="mt-1 block text-sm text-cream-dim transition-colors hover:text-gold"
          >
            338 338 6946
          </a>
        </div>

        {/* Sede */}
        <div>
          <p className="eyebrow mb-4 text-gold">Sede</p>
          <p className="text-sm text-cream">Via Adigrat 3/A</p>
          <p className="text-sm text-cream-dim">62032 Camerino (MC), Marche</p>
          <a
            href="#top"
            onClick={goTop}
            className="eyebrow mt-6 inline-block transition-colors hover:text-gold"
          >
            Torna su <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[100rem] flex-col gap-2 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-cream-dim/60">
          © {year} A.S.H. Finiture Contract di Ahmed Abdelaziz.
        </p>
        <p className="eyebrow text-cream-dim/60">Camerino · Marche · Italia</p>
      </div>
    </footer>
  );
}
