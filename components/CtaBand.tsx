"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollToSection } from "@/lib/lenis";

/*
  The turn into the dark finale. No card, no container: CanvasBackdrop scrubs
  the page canvas to espresso as this section enters, and the CTA is carried
  by scale and contrast alone — cream serif display with a gold italic accent,
  pill CTAs. From here to the footer the canvas stays dark, so the drama is a
  destination, not an island.
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
            scrollTrigger: { trigger: root.current, start: "top 70%" },
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
      id="cta"
      ref={root}
      aria-labelledby="cta-title"
      className="relative overflow-clip px-6 py-32 md:px-12 md:py-48"
    >
      {/* Gold breath on the dark canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_20%,rgba(198,161,91,0.13),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <p data-reveal className="eyebrow text-gold">
          Marche · Italia
        </p>
        <h2
          id="cta-title"
          data-reveal
          className="mt-7 font-display text-[13vw] font-medium leading-[1.02] tracking-arch text-cream sm:text-6xl md:text-[5.6vw]"
        >
          Diamo forma <span className="text-metal italic">ai tuoi spazi</span>.
        </h2>
        <p
          data-reveal
          className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-cream-dim md:text-base"
        >
          Precisione millimetrica, finiture che durano nel tempo. Sopralluogo e
          preventivo senza impegno, in tutta la regione.
        </p>

        <div
          data-reveal
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#contatti"
            onClick={goContact}
            className="group inline-flex items-center gap-3 rounded-full bg-gold px-9 py-4 font-display text-sm uppercase tracking-[0.22em] text-charcoal transition-colors duration-300 hover:bg-gold-light"
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
            className="inline-flex items-center gap-3 rounded-full border border-cream/25 px-9 py-4 font-display text-sm uppercase tracking-[0.22em] text-cream transition-colors duration-300 hover:border-gold hover:text-gold"
          >
            329 644 7797
          </a>
        </div>
      </div>
    </section>
  );
}
