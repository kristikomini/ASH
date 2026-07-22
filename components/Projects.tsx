"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { PROJECTS, type Project } from "@/lib/projects";
import { Atmosphere, Aura, GhostWord } from "./Atmosphere";

const ProjectCanvas = dynamic(() => import("./ProjectCanvas"), { ssr: false });

function ProjectCard({
  project,
  enable3d,
}: {
  project: Project;
  enable3d: boolean;
}) {
  return (
    <li data-card className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.img}
          alt={`${project.title} — ${project.category}, ${project.location}`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        {enable3d && <ProjectCanvas url={project.img} />}

        {/* Soft espresso vignette so the gold index/CTA read on any photo */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-espresso/35 via-transparent to-espresso/25" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gold/0 transition-colors duration-500 group-hover:bg-gold/10" />
        <span className="eyebrow absolute left-4 top-4 z-10 text-gold">
          {project.n}
        </span>
        <span className="eyebrow absolute bottom-4 left-4 z-10 translate-y-2 text-gold opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          Vedi progetto <span aria-hidden="true">→</span>
        </span>
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-stone pt-4">
        <h3 className="font-display text-2xl font-medium tracking-arch text-ink md:text-3xl">
          {project.title}
        </h3>
        <span className="eyebrow shrink-0">{project.year}</span>
      </div>
      <p className="eyebrow mt-2 text-ink-dim">
        {project.category} · {project.location}
      </p>
      <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-ink-dim">
        {project.desc}
      </p>
    </li>
  );
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const [enable3d, setEnable3d] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)"
    );
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
    const update = () => setEnable3d(mq.matches && webgl);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const cards = q("[data-card]");
      const mm = gsap.matchMedia();

      mm.add(
        {
          base: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean };
        if (reduce) {
          gsap.set(cards, { autoAlpha: 1, yPercent: 0 });
          return;
        }
        gsap.from(cards, {
          yPercent: 8,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
      });

      // New section changes document height → refresh once images have decoded.
      const imgs = Array.from(
        root.current?.querySelectorAll("img") ?? []
      ) as HTMLImageElement[];
      Promise.all(imgs.map((i) => i.decode().catch(() => {}))).then(() =>
        ScrollTrigger.refresh()
      );
    },
    { scope: root }
  );

  return (
    <section
      id="progetti"
      ref={root}
      className="relative overflow-clip bg-paper px-6 py-24 md:px-12 md:py-40"
    >
      <Atmosphere>
        <Aura
          tint="blush"
          drift="b"
          className="left-[-10%] top-[8%] h-[44vw] w-[44vw]"
        />
        <Aura
          tint="gold"
          drift="a"
          className="bottom-[-16%] right-[-12%] h-[50vw] w-[50vw]"
        />
        <GhostWord className="left-[-2%] top-[1%] text-[17vw]">Opere</GhostWord>
      </Atmosphere>

      <div className="relative mx-auto w-full max-w-[100rem]">
        <header className="mb-12 flex items-baseline justify-between md:mb-20">
          <p className="eyebrow text-gold-deep">Progetti selezionati</p>
          <p className="eyebrow">
            {String(PROJECTS.length).padStart(2, "0")} — Realizzazioni
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.n} project={p} enable3d={enable3d} />
          ))}
        </ul>
      </div>
    </section>
  );
}
