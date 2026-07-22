"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollToSection } from "@/lib/lenis";

/*
  The "inverse moment": on the light page, one rounded dark card carries the
  strongest call-to-action. Dark plaster texture + espresso grade + gold glow
  + grain, an ivory serif headline with a gold italic accent, and the primary
  CTA pair. Sits between Projects and Contact — the funnel into the form.
*/
export default function CtaBand() {
  const root = useRef<HTMLElement>(null);

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
          const q = gsap.utils.selector(root);
          if (reduce) {
            gsap.set(q("[data-reveal]"), { autoAlpha: 1, y: 0 });
            return;
          }
          gsap.from(q("[data-reveal]"), {
            autoAlpha: 0,
            y: 40,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top 75%" },
          });
        }
      );
    },
    { scope: root }
  );

  const goContact = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection("#contatti");
  };

  return (
    <section
      ref={root}
      aria-labelledby="cta-title"
      className="relative bg-paper px-6 py-12 md:px-12 md:py-20"
    >
      <div className="mx-auto w-full max-w-[100rem]">
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl bg-charcoal px-6 py-20 md:px-16 md:py-28"
        >
          {/* Dark plaster backdrop + grade + gold glow + grain */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/texture-cta-dark.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-charcoal/85 via-charcoal/55 to-espresso/80" />
            <div className="absolute inset-0 bg-[radial-gradient(70%_90%_at_82%_8%,rgba(198,161,91,0.20),transparent_62%)]" />
            <div className="grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <p data-reveal className="eyebrow text-gold">
              Marche · Italia
            </p>
            <h2
              id="cta-title"
              data-reveal
              className="mt-6 font-display text-[11vw] font-medium leading-[1.02] tracking-arch text-cream sm:text-5xl md:text-6xl"
            >
              Diamo forma <span className="text-metal italic">ai tuoi spazi</span>.
            </h2>
            <p
              data-reveal
              className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-cream-dim md:text-base"
            >
              Precisione millimetrica, finiture che durano nel tempo.
              Sopralluogo e preventivo senza impegno, in tutta la regione.
            </p>

            <div
              data-reveal
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <a
                href="#contatti"
                onClick={goContact}
                className="group inline-flex items-center gap-3 bg-gold px-8 py-4 font-display text-sm uppercase tracking-[0.22em] text-charcoal transition-colors duration-300 hover:bg-gold-light"
              >
                Richiedi un preventivo
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
              <a
                href="tel:+393296447797"
                className="inline-flex items-center gap-3 border border-cream/25 px-8 py-4 font-display text-sm uppercase tracking-[0.22em] text-cream transition-colors duration-300 hover:border-gold hover:text-gold"
              >
                329 644 7797
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
