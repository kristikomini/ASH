"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import {
  scrollToSection,
  scrollToTop,
  lenisStop,
  lenisStart,
} from "@/lib/lenis";

const LINKS = [
  { label: "Servizi", target: "#servizi" },
  { label: "Progetti", target: "#progetti" },
  { label: "Contatti", target: "#contatti" },
];

export default function Nav() {
  const header = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const q = gsap.utils.selector(header);
      const bar = q("[data-bar]");
      const progress = q("[data-progress]");

      const mm = gsap.matchMedia();
      mm.add(
        {
          base: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { reduce } = ctx.conditions as {
            base: boolean;
            reduce: boolean;
          };

          if (reduce) {
            gsap.set(bar, { autoAlpha: 1 });
            gsap.set(progress, { scaleX: 1 });
            return;
          }

          // Backdrop bar fades in once the hero is mostly scrolled past.
          ScrollTrigger.create({
            start: () => window.innerHeight * 0.85,
            end: () => ScrollTrigger.maxScroll(window),
            onToggle: (self) =>
              gsap.to(bar, {
                autoAlpha: self.isActive ? 1 : 0,
                duration: 0.4,
                ease: "power2.out",
              }),
          });

          // Thin gold scroll-progress line.
          gsap.to(progress, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              start: 0,
              end: () => ScrollTrigger.maxScroll(window),
              scrub: 0.3,
            },
          });

          // Active-section highlight.
          LINKS.forEach(({ target }) => {
            if (!document.querySelector(target)) return;
            ScrollTrigger.create({
              trigger: target,
              start: "top 45%",
              end: "bottom 45%",
              onToggle: (self) => self.isActive && setActive(target),
            });
          });
        }
      );
    },
    { scope: header }
  );

  // Mobile overlay: lock scroll, reveal links, manage focus + keyboard.
  useEffect(() => {
    const links = gsap.utils.toArray<HTMLElement>("[data-mlink]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (open) {
      lenisStop();
      document.body.style.overflow = "hidden";
      if (reduce) {
        gsap.set(links, { yPercent: 0, autoAlpha: 1 });
      } else {
        gsap.fromTo(
          links,
          { yPercent: 120, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            stagger: 0.08,
            duration: 0.6,
            ease: "power4.out",
          }
        );
      }
      links[0]?.focus();

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
          return;
        }
        if (e.key === "Tab" && menuRef.current) {
          const f = menuRef.current.querySelectorAll<HTMLElement>("a[href]");
          if (!f.length) return;
          const first = f[0];
          const last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    }

    lenisStart();
    document.body.style.overflow = "";
    if (wasOpen.current) hamburgerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  const go = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToSection(target);
  };
  const goTop = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToTop();
  };

  return (
    <header ref={header} className="fixed inset-x-0 top-0 z-50">
      {/* Bar tint derives from the LIVE canvas variable, so it always matches
          the morphing background — light or dark, no seam, no state. */}
      <div
        data-bar
        className="absolute inset-0 border-b border-(color:--zone-line) opacity-0 backdrop-blur-md transition-colors duration-500 [background:color-mix(in_srgb,var(--canvas)_86%,transparent)]"
      />

      <nav className="relative mx-auto flex h-16 max-w-[100rem] items-center justify-between px-6 md:h-20 md:px-12">
        <a
          href="#top"
          onClick={goTop}
          className="group flex items-center gap-2.5"
          aria-label="A.S.H. Finiture Contract — torna su"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-mark.png"
            alt=""
            aria-hidden
            className="h-7 w-auto transition-transform duration-500 group-hover:rotate-[-6deg] md:h-8"
          />
          <span className="text-metal-deep font-display text-lg font-bold tracking-arch">
            A.S.H.
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map(({ label, target }) => (
            <a
              key={target}
              href={target}
              onClick={(e) => go(e, target)}
              aria-current={active === target ? "true" : undefined}
              className={`eyebrow relative transition-colors duration-300 hover:text-(--zone-fg) ${
                active === target ? "text-(--zone-accent)" : "text-(--zone-fg-dim)"
              }`}
            >
              {label}
              <span
                aria-hidden
                className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-(--zone-accent) transition-transform duration-300 ${
                  active === target ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </a>
          ))}
          <a
            href="#contatti"
            onClick={(e) => go(e, "#contatti")}
            className="eyebrow rounded-full border border-(color:--zone-accent) px-5 py-2 text-(--zone-accent) transition-colors duration-300 hover:bg-gold hover:text-charcoal"
          >
            Preventivo
          </a>
        </div>

        <button
          ref={hamburgerRef}
          type="button"
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex h-6 w-7 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-6 bg-(--zone-fg) transition-[transform,background-color] duration-300 ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-(--zone-fg) transition-[transform,background-color] duration-300 ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      <span
        data-progress
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gold"
      />

      {/* Mobile overlay */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu di navigazione"
        {...(open ? {} : { inert: true })}
        style={{ background: "var(--canvas)" }}
        className={`fixed inset-0 z-40 flex flex-col justify-center gap-1 px-6 transition-opacity duration-500 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {LINKS.map(({ label, target }) => (
          <div key={target} className="overflow-hidden py-1">
            <a
              data-mlink
              href={target}
              onClick={(e) => go(e, target)}
              className="text-metal-deep block font-display text-[13vw] font-bold leading-none tracking-arch"
            >
              {label}
            </a>
          </div>
        ))}
        <a
          data-mlink
          href="#contatti"
          onClick={(e) => go(e, "#contatti")}
          className="eyebrow mt-8 block text-(--zone-accent)"
        >
          Richiedi un preventivo <span aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  );
}
