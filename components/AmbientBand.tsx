"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/*
  Typographic interlude on the shared canvas — no background of its own.
  A large serif statement beside a floating "material specimen": the plaster
  texture presented as an object (rounded, warm shadow, gentle parallax and
  counter-rotation) rather than as a section background, so the page surface
  stays continuous. The phrase is real content, read by assistive tech.
*/
export default function AmbientBand({
  id,
  image,
  eyebrow,
  phrase,
}: {
  id?: string;
  image: string;
  eyebrow?: string;
  phrase: string;
}) {
  const root = useRef<HTMLElement>(null);
  const specimen = useRef<HTMLDivElement>(null);
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

          // The specimen drifts against the scroll and settles upright.
          gsap.fromTo(
            specimen.current,
            { yPercent: 10, rotation: 4 },
            {
              yPercent: -10,
              rotation: -1,
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
      id={id}
      ref={root}
      className="relative overflow-clip px-6 py-24 md:px-12 md:py-40"
    >
      <div className="mx-auto grid w-full max-w-[100rem] items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
        <div ref={text}>
          {eyebrow && <p className="eyebrow text-gold-deep">{eyebrow}</p>}
          <p className="mt-5 max-w-2xl font-display text-[9vw] font-medium italic leading-[1.06] tracking-arch text-ink md:mt-6 md:text-[4.2vw]">
            {phrase}
          </p>
        </div>

        {/* Floating material specimen — the craft itself, as an object */}
        <div
          ref={specimen}
          aria-hidden
          className="relative mx-auto w-full max-w-md will-change-transform lg:max-w-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            loading="lazy"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-[0_48px_90px_-24px_rgba(60,45,25,0.35)] ring-1 ring-ink/10"
          />
          <p className="eyebrow mt-4 text-center">
            Intonachino · dettaglio di superficie
          </p>
        </div>
      </div>
    </section>
  );
}
