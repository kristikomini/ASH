"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SERVICES } from "@/lib/services";
import { scrollToSection } from "@/lib/lenis";

/* Cohesive dark grade so the (brighter) interior photos sit in the dark theme. */
const PHOTO_FILTER = "brightness(0.72) contrast(1.08) saturate(0.82)";

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(
        {
          base: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { reduce } = ctx.conditions as { reduce: boolean };
          if (reduce) {
            gsap.set(q("[data-reveal]"), { autoAlpha: 1, y: 0 });
            return;
          }
          gsap.from(q("[data-reveal]"), {
            autoAlpha: 0,
            y: 26,
            duration: 0.7,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top 72%" },
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
      id="servizi"
      ref={root}
      className="relative bg-charcoal px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto w-full max-w-[100rem]">
        <header
          data-reveal
          className="mb-10 flex items-baseline justify-between md:mb-16"
        >
          <p className="eyebrow text-gold">Servizi principali</p>
          <p className="eyebrow">
            {String(SERVICES.length).padStart(2, "0")} — Specialità
          </p>
        </header>

        <div className="grid gap-y-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-20">
          {/* ── Index list ─────────────────────────────────────────── */}
          <ul>
            {SERVICES.map((s, i) => {
              const on = active === i;
              return (
                <li key={s.name} data-reveal>
                  <a
                    href="#contatti"
                    onClick={goContact}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-label={`${s.name} — richiedi un preventivo`}
                    className="group relative block border-t border-line py-6 outline-none md:py-7"
                  >
                    {/* active marker */}
                    <span
                      aria-hidden
                      className={`absolute left-0 top-[-1px] h-px w-full origin-left bg-gold transition-transform duration-500 ${
                        on ? "scale-x-100" : "scale-x-0"
                      }`}
                    />

                    <div className="flex items-baseline gap-5 transition-transform duration-300 md:gap-8 lg:group-hover:translate-x-3">
                      <span
                        className={`font-display text-xs transition-colors md:text-sm ${
                          on ? "text-gold" : "text-cream-dim"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <h3
                        className={`font-display font-medium leading-[1.02] tracking-arch transition-colors text-[8.5vw] md:text-[2.9vw] ${
                          on ? "text-gold" : "text-cream"
                        }`}
                      >
                        {s.name}
                      </h3>

                      <span
                        aria-hidden
                        className={`ml-auto hidden shrink-0 self-center whitespace-nowrap text-gold transition-all duration-300 lg:block ${
                          on
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-3 opacity-0"
                        }`}
                      >
                        <span className="eyebrow text-gold">Preventivo →</span>
                      </span>
                    </div>

                    <p className="mt-3 max-w-md text-sm leading-relaxed text-cream-dim md:mt-4">
                      {s.desc}
                    </p>

                    {/* Inline image — mobile only (desktop uses the sticky panel) */}
                    <div className="relative mt-5 aspect-[16/10] overflow-hidden bg-slate lg:hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.img}
                        alt={`${s.name} — esempio di lavoro`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                        style={{ filter: PHOTO_FILTER }}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                    </div>
                  </a>
                </li>
              );
            })}
            <li aria-hidden className="border-t border-line" />
          </ul>

          {/* ── Sticky crossfade preview — desktop ─────────────────── */}
          <div data-reveal className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden bg-slate">
                {SERVICES.map((s, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={s.name}
                    src={s.img}
                    alt=""
                    aria-hidden={active !== i}
                    className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-out ${
                      active === i ? "scale-100 opacity-100" : "scale-105 opacity-0"
                    }`}
                    style={{ filter: PHOTO_FILTER }}
                  />
                ))}

                {/* grade + gold wash + grain */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/15 to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-gold/[0.06] mix-blend-overlay" />
                <div className="grain pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay" />

                {/* caption */}
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <p className="eyebrow text-gold">
                    {String(active + 1).padStart(2, "0")} /{" "}
                    {String(SERVICES.length).padStart(2, "0")}
                  </p>
                  <p className="mt-2 font-display text-3xl tracking-arch text-cream">
                    {SERVICES[active].name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
