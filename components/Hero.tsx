"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, useGSAP } from "@/lib/gsap";
import HeroLogo from "./HeroLogo";

/* WebGL is client-only + desktop-only; never server-rendered. */
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const [mount3d, setMount3d] = useState(false);

  // Only spin up WebGL on non-touch desktops that don't ask for reduced motion.
  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)"
    );
    const update = () => setMount3d(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { isDesktop, reduce } = ctx.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduce: boolean;
          };
          if (reduce) return; // content stays at natural, visible position

          const q = gsap.utils.selector(root);

          // Cinematic entrance — masked line + fade stagger, pre-paint from-state.
          const tl = gsap.timeline({
            defaults: { ease: "power4.out" },
            delay: 0.15,
          });
          tl.from(q("[data-line]"), {
            yPercent: 115,
            duration: 1.15,
            stagger: 0.12,
          })
            .from(
              q("[data-fade]"),
              { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.12 },
              "-=0.7"
            )
            .from(
              q("[data-edge]"),
              { autoAlpha: 0, duration: 1.2, stagger: 0.15 },
              "-=0.6"
            );

          // Parallax drift on exit — content lifts & fades, background pushes in.
          if (isDesktop) {
            const scroll = {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            } as const;

            gsap.to(content.current, {
              yPercent: -14,
              autoAlpha: 0.15,
              ease: "none",
              scrollTrigger: scroll,
            });

            gsap.fromTo(
              bg.current,
              { scale: 1 },
              { scale: 1.08, ease: "none", scrollTrigger: scroll }
            );
          }
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative min-h-dvh overflow-hidden bg-charcoal"
    >
      {/* Background stack — scaled on scroll for parallax depth */}
      <div ref={bg} className="absolute inset-0 will-change-transform">
        {/* Baked, on-brand plaster image: dark charcoal, warm raking light upper-right,
            dissolving to black under the headline. Visible on ALL devices — this is
            what mobile / reduced-motion / no-WebGL users see. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero.jpg"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[64%_28%]"
        />

        {/* Live WebGL enhancement (desktop, no reduced motion): drifting light + cursor bloom */}
        {mount3d && (
          <div className="absolute inset-0">
            <HeroCanvas />
          </div>
        )}

        {/* Type-legibility scrim — charcoal on the left, clearing toward the lit right */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/60 to-transparent md:via-charcoal/35" />
        {/* Nav + section blends (top & bottom fade to charcoal) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/40" />
        {/* Film grain */}
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay" />
      </div>

      {/* Interactive 3D brand emblem in the negative space (desktop) */}
      <HeroLogo />

      {/* Foreground content */}
      <div
        ref={content}
        className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[100rem] flex-col justify-between px-6 py-16 md:px-12 md:py-20"
      >
        <header className="flex items-center justify-between">
          <span data-fade className="eyebrow">
            A.S.H. Finiture Contract
          </span>
          <span data-fade className="eyebrow hidden sm:block">
            Marche · Italia
          </span>
        </header>

        <div>
          <p data-fade className="eyebrow mb-6 text-gold md:mb-8">
            Specialisti in finiture edili
          </p>

          <h1 className="font-display font-bold tracking-arch">
            <span className="block overflow-hidden">
              <span
                data-line
                className="text-metal block text-[26vw] leading-[0.8] md:text-[19vw]"
              >
                A.S.H.
              </span>
            </span>
            <span className="mt-2 block overflow-hidden md:mt-4">
              <span
                data-line
                className="block text-[7.6vw] font-medium leading-[0.95] text-cream [letter-spacing:0.02em] md:text-[5.4vw]"
              >
                FINITURE CONTRACT
              </span>
            </span>
          </h1>

          <p
            data-fade
            className="mt-8 max-w-xl text-base leading-relaxed text-cream-dim md:mt-10 md:text-lg"
          >
            Ricostruzioni su misura e finiture d&apos;interni di alta gamma.
            Superfici impeccabili, precisione millimetrica — di Ahmed
            Abdelaziz.
          </p>
        </div>

        <footer className="flex items-end justify-between">
          <a
            data-fade
            href="#servizi"
            className="group inline-flex items-center gap-4 text-cream-dim transition-colors hover:text-cream"
          >
            <span className="eyebrow">Scopri i servizi</span>
            <span className="relative block h-10 w-px overflow-hidden bg-line">
              <span className="absolute inset-0 block h-full w-full origin-top animate-[scrollcue_2.2s_ease-in-out_infinite] bg-gold" />
            </span>
          </a>
          <span data-fade className="eyebrow hidden max-w-[16ch] text-right sm:block">
            Via Adigrat 3/A · 62032
          </span>
        </footer>
      </div>
    </section>
  );
}
