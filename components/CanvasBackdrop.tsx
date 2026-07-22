"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Aura } from "./Atmosphere";

/*
  THE canvas. The entire marketing site sits on one continuous background
  surface: `--canvas` on <html>, scrubbed by GSAP through a warm journey —

    ivory (hero/servizi) → cream (metodo) → sand (progetti)
    → espresso (cta) → deep espresso (contatti/footer)

  — so sections never own a background and there are no seams (the Apple
  long-scroll model: the ground travels, content floats). Alongside it:
  persistent aura fields and a single global film-grain pass, shared by every
  section, so the whole page reads as one scene.

  [data-zone="dark"] is flipped on <html> at the CTA boundary so fixed chrome
  (nav, scroll rail) can adapt via the --zone-* variables.
*/

/* [selector, canvas color, scrub start, scrub end] — sequential legs; ranges
   must not overlap. The dark leg runs late and tight so the outgoing light
   section's ink text is never left sitting on a darkened ground. */
const STOPS: [string, string, string, string][] = [
  ["#metodo", "#efe8d8", "top 85%", "top 35%"],
  ["#progetti", "#eae2cf", "top 85%", "top 35%"],
  ["#cta", "#201812", "top 60%", "top 25%"],
  ["#contatti", "#1a120d", "top 85%", "top 35%"],
];
const START = "#f4f0e7";
const DARK_AT = "#cta";

export default function CanvasBackdrop() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      const setZone = (dark: boolean) => {
        if (dark) html.setAttribute("data-zone", "dark");
        else html.removeAttribute("data-zone");
      };

      const mm = gsap.matchMedia();
      mm.add(
        {
          base: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { reduce } = ctx.conditions as { reduce: boolean };

          // IMPORTANT: useGSAP's `scope` makes selector STRINGS resolve
          // relative to this component's root div — where the page sections
          // don't live. Resolve them on document and pass ELEMENTS.
          const darkEl = document.querySelector(DARK_AT);

          if (reduce) {
            // No scrubbing: a single instant light↔dark switch at the CTA.
            // onToggle is STATE-driven (fires on refresh corrections too),
            // unlike edge-fired onEnter/onLeaveBack.
            if (!darkEl) return;
            ScrollTrigger.create({
              trigger: darkEl,
              start: "top 60%",
              end: () => `+=${ScrollTrigger.maxScroll(window)}`,
              onToggle: (self) => {
                gsap.set(html, { "--canvas": self.isActive ? "#1a120d" : START });
                setZone(self.isActive);
              },
            });
            return;
          }

          // Scrubbed colour journey — each leg starts where the last ended.
          let prev = START;
          for (const [sel, color, legStart, legEnd] of STOPS) {
            const el = document.querySelector(sel);
            if (!el) continue;
            gsap.fromTo(
              html,
              { "--canvas": prev },
              {
                "--canvas": color,
                ease: "none",
                immediateRender: false,
                scrollTrigger: {
                  trigger: el,
                  start: legStart,
                  end: legEnd,
                  scrub: true,
                },
              }
            );
            prev = color;
          }

          // Flip the fixed-chrome zone mid-transition into the dark finale.
          // The range spans to the page end and onToggle is state-driven, so
          // any ScrollTrigger.refresh() self-corrects the attribute.
          if (darkEl) {
            ScrollTrigger.create({
              trigger: darkEl,
              start: "top 55%",
              end: () => `+=${ScrollTrigger.maxScroll(window)}`,
              onToggle: (self) => setZone(self.isActive),
            });
          }
        }
      );

      return () => setZone(false);
    },
    { scope: root }
  );

  return (
    <div ref={root} aria-hidden>
      {/* Persistent aura fields — the same three lights accompany the whole
          scroll (Gestalt common fate); on the dark canvas they read as glow. */}
      <div className="pointer-events-none fixed inset-0 -z-10 select-none">
        <Aura
          tint="gold"
          drift="a"
          className="left-[-18%] top-[-12%] h-[58vw] w-[58vw]"
        />
        <Aura
          tint="blush"
          drift="b"
          className="right-[-14%] top-[28%] h-[46vw] w-[46vw]"
        />
        <Aura
          tint="olive"
          drift="a"
          className="bottom-[-18%] left-[10%] h-[44vw] w-[44vw]"
        />
      </div>

      {/* One global film-grain pass over everything (below the nav) — a single
          shared texture is what makes disparate imagery read as one page. */}
      <div className="grain pointer-events-none fixed inset-0 z-[45] opacity-[0.04] mix-blend-overlay" />
    </div>
  );
}
