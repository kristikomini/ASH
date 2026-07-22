"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/*
  Subtle scroll-progress readout, fixed bottom-right: a thin gold rail that fills
  top→down plus a live percentage. Driven imperatively via ScrollTrigger.onUpdate
  (textContent + gsap.set) so scrolling never re-renders React. Fades in once the
  hero is scrolled past; decorative (aria-hidden) and never intercepts pointers.
*/
export default function ScrollProgress() {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const f = fill.current;
      const p = pct.current;
      if (!el || !f || !p) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          base: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { reduce } = ctx.conditions as { reduce: boolean };

          // GSAP owns the fill transform (Tailwind's scale-y-* uses the CSS
          // `scale` property, which would multiply with GSAP's transform → stuck at 0).
          gsap.set(f, { scaleY: 0, transformOrigin: "center top" });

          // Progress → rail fill + number (runs in every mode).
          ScrollTrigger.create({
            start: 0,
            end: () => ScrollTrigger.maxScroll(window),
            onUpdate: (self) => {
              gsap.set(f, { scaleY: self.progress });
              p.textContent = String(Math.round(self.progress * 100)).padStart(
                2,
                "0"
              );
            },
          });

          if (reduce) {
            gsap.set(el, { autoAlpha: 1 });
            return;
          }

          // Reveal once past the hero so it doesn't clutter the opening.
          ScrollTrigger.create({
            start: () => window.innerHeight * 0.6,
            end: () => ScrollTrigger.maxScroll(window),
            onToggle: (self) =>
              gsap.to(el, {
                autoAlpha: self.isActive ? 1 : 0,
                duration: 0.4,
                ease: "power2.out",
              }),
          });
        }
      );
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed bottom-10 right-6 z-40 hidden select-none flex-col items-center gap-3 opacity-0 md:flex md:right-8"
    >
      <span ref={pct} className="eyebrow text-ink-dim">
        00
      </span>
      <span className="relative block h-20 w-px bg-stone">
        <span
          ref={fill}
          className="absolute inset-x-0 top-0 block h-full bg-gold-deep"
        />
      </span>
    </div>
  );
}
