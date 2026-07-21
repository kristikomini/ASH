"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/*
  The A.S.H. emblem as a 3D-reactive object: it tilts toward the cursor in
  perspective, floats gently, and a gold specular highlight sweeps across the
  glyph (a gradient masked to the mark's shape). Decorative — the wordmark
  carries the accessible name. Desktop only; mounted by Hero.
*/
export default function HeroLogo() {
  const wrap = useRef<HTMLDivElement>(null); // perspective container
  const tilt = useRef<HTMLDivElement>(null); // rotated in 3D

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
          if (reduce) return; // static emblem

          // Entrance.
          gsap.from(tilt.current, {
            autoAlpha: 0,
            scale: 0.82,
            rotationY: -22,
            duration: 1.5,
            ease: "power3.out",
            delay: 0.45,
          });

          // Idle float.
          gsap.to(tilt.current, {
            yPercent: -4,
            duration: 3.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });

          // Cursor-driven 3D tilt.
          const rotY = gsap.quickTo(tilt.current, "rotationY", {
            duration: 0.7,
            ease: "power3",
          });
          const rotX = gsap.quickTo(tilt.current, "rotationX", {
            duration: 0.7,
            ease: "power3",
          });
          const onMove = (e: PointerEvent) => {
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = (e.clientY / window.innerHeight) * 2 - 1;
            rotY(nx * 18);
            rotX(-ny * 13);
          };
          window.addEventListener("pointermove", onMove, { passive: true });
          return () => window.removeEventListener("pointermove", onMove);
        }
      );
    },
    { scope: wrap }
  );

  return (
    <div
      ref={wrap}
      aria-hidden
      className="pointer-events-none absolute right-[6%] top-1/2 z-[6] hidden -translate-y-1/2 lg:block"
      style={{ perspective: "1000px", width: "clamp(240px, 27vw, 460px)" }}
    >
      <div
        ref={tilt}
        className="relative [transform-style:preserve-3d]"
      >
        {/* soft gold backlight */}
        <div className="absolute -inset-[22%] rounded-full bg-[radial-gradient(closest-side,rgba(198,161,91,0.30),transparent_72%)] blur-2xl" />

        {/* wooden emblem */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-mark.png"
          alt=""
          className="relative block w-full drop-shadow-[0_34px_60px_rgba(0,0,0,0.55)]"
        />

        {/* gold specular sweep, masked to the mark's shape */}
        <div
          className="absolute inset-0 motion-safe:animate-[logoShine_5.5s_ease-in-out_infinite]"
          style={{
            backgroundImage:
              "linear-gradient(100deg, transparent 38%, rgba(231,207,155,0.85) 50%, transparent 62%)",
            backgroundSize: "300% 100%",
            backgroundRepeat: "no-repeat",
            mixBlendMode: "screen",
            WebkitMaskImage: "url(/logo-mark.png)",
            maskImage: "url(/logo-mark.png)",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        />
      </div>
    </div>
  );
}
