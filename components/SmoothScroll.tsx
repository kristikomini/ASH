"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

/*
  Cinematic smooth scroll (Lenis) driven by GSAP's ticker so that Lenis,
  ScrollTrigger and every tween share a single requestAnimationFrame loop.
  Wraps the whole app at the RootLayout level.
*/
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Honour reduced-motion: skip the smoothing layer entirely.
    if (prefersReduced) {
      setLenis(null);
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      // easeOutExpo — long, weighty, architectural glide
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    setLenis(lenis);

    // Keep ScrollTrigger in lockstep with Lenis' virtual scroll position.
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    // Drive Lenis on its own rAF loop (canonical setup).
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
