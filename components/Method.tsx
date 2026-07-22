"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/*
  "Il metodo" — a scroll-scrubbed statement (each word inks in as the reader
  scrolls, the Apple long-scroll pattern) followed by a hairline three-step
  process row. Pure typography on the shared canvas: no images, no containers.
  The full sentence is exposed to assistive tech once; the animated word spans
  are aria-hidden.
*/

const STATEMENT: { t: string; em?: boolean }[] = [
  { t: "Dal" },
  { t: "grezzo" },
  { t: "al" },
  { t: "dettaglio," },
  { t: "ogni" },
  { t: "superficie" },
  { t: "è" },
  { t: "curata", em: true },
  { t: "a", em: true },
  { t: "mano", em: true },
  { t: "—" },
  { t: "strato" },
  { t: "dopo" },
  { t: "strato," },
  { t: "con" },
  { t: "la" },
  { t: "pazienza" },
  { t: "del" },
  { t: "mestiere" },
  { t: "e" },
  { t: "una" },
  { t: "precisione" },
  { t: "che" },
  { t: "si" },
  { t: "vede" },
  { t: "in" },
  { t: "luce" },
  { t: "radente." },
];

const STEPS = [
  {
    n: "01",
    name: "Sopralluogo e preparazione",
    desc: "Analisi dei supporti, protezione degli ambienti e fondi a regola d'arte.",
  },
  {
    n: "02",
    name: "Applicazione a mano",
    desc: "Cartongesso, rasature e intonachini stesi con gesto esperto e tempi giusti.",
  },
  {
    n: "03",
    name: "Rifinitura millimetrica",
    desc: "Spigoli netti, planarità perfetta, dettagli pronti alla consegna.",
  },
];

export default function Method() {
  const root = useRef<HTMLElement>(null);
  const statement = useRef<HTMLParagraphElement>(null);

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
            gsap.set(q("[data-word]"), { opacity: 1 });
            gsap.set(q("[data-step]"), { autoAlpha: 1, y: 0 });
            return;
          }

          // Words ink in sequentially, tied to scroll (scrubbed, reversible).
          gsap.fromTo(
            q("[data-word]"),
            { opacity: 0.14 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.35,
              scrollTrigger: {
                trigger: statement.current,
                start: "top 80%",
                end: "top 25%",
                scrub: true,
              },
            }
          );

          gsap.from(q("[data-step]"), {
            autoAlpha: 0,
            y: 26,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: q("[data-steps]")[0], start: "top 80%" },
          });
        }
      );
    },
    { scope: root }
  );

  const full = STATEMENT.map((w) => w.t).join(" ");

  return (
    <section
      id="metodo"
      ref={root}
      className="relative overflow-clip px-6 py-24 md:px-12 md:py-40"
    >
      <div className="mx-auto w-full max-w-[100rem]">
        <p className="eyebrow text-gold-deep">Il metodo</p>

        <p
          ref={statement}
          className="mt-8 max-w-5xl font-display text-[7.5vw] font-medium leading-[1.14] tracking-arch text-ink md:text-[3.9vw]"
        >
          <span className="sr-only">{full}</span>
          <span aria-hidden>
            {STATEMENT.map((w, i) => (
              <span key={i}>
                <span
                  data-word
                  className={`inline-block ${
                    w.em ? "text-metal-deep italic" : ""
                  }`}
                >
                  {w.t}
                </span>{" "}
              </span>
            ))}
          </span>
        </p>

        <div
          data-steps
          className="mt-16 grid gap-x-10 gap-y-10 border-t border-stone pt-10 sm:grid-cols-3 md:mt-24"
        >
          {STEPS.map((s) => (
            <div key={s.n} data-step>
              <p className="eyebrow text-gold-deep">{s.n}</p>
              <h3 className="mt-3 font-display text-2xl font-medium tracking-arch text-ink">
                {s.name}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-dim">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
