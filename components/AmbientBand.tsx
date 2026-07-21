"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/*
  Full-bleed atmospheric divider between sections: a parallaxing plaster texture
  (baked to dissolve top & bottom into charcoal) with a centred brand line.
  Decorative but the phrase is read by assistive tech.
*/
export default function AmbientBand({
  image,
  eyebrow,
  phrase,
}: {
  image: string;
  eyebrow?: string;
  phrase: string;
}) {
  const root = useRef<HTMLElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const text = useRef<HTMLDivElement>(null);

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
          if (reduce) return;

          // Vertical parallax drift (image is over-scanned so edges never show).
          gsap.fromTo(
            img.current,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );

          gsap.from(text.current, {
            autoAlpha: 0,
            y: 30,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top 78%" },
          });
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative flex h-[60vh] min-h-[400px] items-center justify-center overflow-hidden bg-charcoal"
    >
      {/* Parallax texture — 130% tall + offset so the drift never reveals an edge */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={img}
          src={image}
          alt=""
          className="absolute left-0 top-[-15%] h-[130%] w-full object-cover will-change-transform"
        />
      </div>

      {/* Extra blend into the neighbouring sections + grain */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal" />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay" />

      {/* Brand line */}
      <div
        ref={text}
        className="relative z-10 mx-auto max-w-[100rem] px-6 text-center md:px-12"
      >
        {eyebrow && <p className="eyebrow text-gold">{eyebrow}</p>}
        <p className="mx-auto mt-5 max-w-4xl font-display text-[7vw] font-medium leading-[1.08] tracking-arch text-cream md:mt-6 md:text-[3.2vw]">
          {phrase}
        </p>
      </div>
    </section>
  );
}
