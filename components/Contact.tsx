"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { gsap, useGSAP } from "@/lib/gsap";
import { SERVICE_NAMES } from "@/lib/services";
import { submitContact } from "@/app/actions/contact";
import { initialContactState } from "@/lib/contact";
import { Atmosphere, GhostWord } from "./Atmosphere";

const inputClass =
  "w-full border-0 border-b border-cream/15 bg-transparent py-3 text-cream outline-none transition-colors duration-300 placeholder:text-cream-dim/40 focus:border-gold aria-[invalid=true]:border-terra-soft";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="group inline-flex items-center gap-3 rounded-full border border-gold/60 px-9 py-4 font-display text-sm uppercase tracking-[0.22em] text-gold transition-colors duration-300 hover:bg-gold hover:text-charcoal disabled:cursor-not-allowed disabled:border-cream/15 disabled:text-cream-dim disabled:hover:bg-transparent"
    >
      {pending ? "Invio in corso…" : "Invia richiesta"}
      <span
        aria-hidden
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </button>
  );
}

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [state, action] = useActionState(submitContact, initialContactState);

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
            gsap.set(q("[data-field]"), { autoAlpha: 1, y: 0 });
            return;
          }
          gsap.from(q("[data-field]"), {
            autoAlpha: 0,
            y: 22,
            duration: 0.6,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top 78%" },
          });
        }
      );
    },
    { scope: root }
  );

  const err = state.errors;

  return (
    <section
      id="contatti"
      ref={root}
      className="relative overflow-clip px-6 py-24 [color-scheme:dark] md:px-12 md:py-32"
    >
      {/* Ambient gold wash — the section floats on the dark canvas */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(80%_55%_at_12%_0%,rgba(198,161,91,0.10),transparent_58%)]" />
      </div>
      <Atmosphere>
        <GhostWord tone="cream" className="bottom-[4%] right-[-4%] text-[16vw]">
          Insieme
        </GhostWord>
      </Atmosphere>

      <div className="relative mx-auto w-full max-w-[100rem]">
        <header data-field className="max-w-4xl">
          <p className="eyebrow text-gold">Contatti</p>
          <h2 className="text-metal mt-6 font-display text-[13vw] font-bold leading-[0.85] tracking-arch md:text-[8.5vw]">
            Costruiamo
            <br />
            insieme.
          </h2>
        </header>

        <div className="mt-14 grid gap-x-20 gap-y-16 lg:mt-24 lg:grid-cols-[0.9fr_1.1fr]">
          {/* ── Left: invitation + real contact details ── */}
          <div className="flex flex-col gap-12">
            <p
              data-field
              className="max-w-md text-lg leading-relaxed text-cream-dim"
            >
              Raccontaci il progetto. Effettuiamo sopralluoghi e preventivi in
              tutta la regione Marche, senza impegno.
            </p>

            <dl className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
              <div data-field>
                <dt className="eyebrow mb-3 text-cream-dim">Studio</dt>
                <dd className="text-cream">A.S.H. Finiture Contract</dd>
                <dd className="text-cream-dim">di Ahmed Abdelaziz</dd>
              </div>
              <div data-field>
                <dt className="eyebrow mb-3 text-cream-dim">Sede</dt>
                <dd className="text-cream">Via Adigrat 3/A</dd>
                <dd className="text-cream-dim">62032 Camerino (MC), Marche</dd>
              </div>
              <div data-field>
                <dt className="eyebrow mb-3 text-cream-dim">Scrivici</dt>
                <dd>
                  <a
                    href="mailto:ashfiniturecontract@outlook.it"
                    className="break-all text-cream underline-offset-4 transition-colors hover:text-gold"
                  >
                    ashfiniturecontract@outlook.it
                  </a>
                </dd>
              </div>
              <div data-field>
                <dt className="eyebrow mb-3 text-cream-dim">Telefono</dt>
                <dd>
                  <a
                    href="tel:+393296447797"
                    className="text-cream transition-colors hover:text-gold"
                  >
                    329 644 7797
                  </a>
                </dd>
                <dd>
                  <a
                    href="tel:+393383386946"
                    className="text-cream-dim transition-colors hover:text-gold"
                  >
                    338 338 6946
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* ── Right: form / success ── */}
          <div>
            {state.ok === true ? (
              <div
                role="status"
                className="flex min-h-[18rem] flex-col justify-center border-t border-cream/15 pt-10"
              >
                <p className="text-metal font-display text-5xl tracking-arch">
                  Grazie.
                </p>
                <p className="mt-4 max-w-sm text-cream-dim">{state.message}</p>
              </div>
            ) : (
              <form action={action} noValidate className="w-full">
                <p className="mb-10 text-xs text-cream-dim">
                  I campi con <span className="text-gold">*</span> sono
                  obbligatori.
                </p>

                {state.ok === false && state.message && (
                  <p
                    role="alert"
                    className="mb-8 border-l-2 border-terra-soft pl-4 text-sm text-terra-soft"
                  >
                    {state.message}
                  </p>
                )}

                <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
                  {/* Nome */}
                  <div data-field>
                    <label htmlFor="nome" className="eyebrow text-cream-dim">
                      Nome *
                    </label>
                    <div className="relative mt-3">
                      <input
                        id="nome"
                        name="nome"
                        autoComplete="name"
                        aria-required
                        defaultValue={state.values.nome}
                        aria-invalid={!!err.nome}
                        aria-describedby={err.nome ? "nome-err" : undefined}
                        className={inputClass}
                      />
                    </div>
                    {err.nome && (
                      <p id="nome-err" role="alert" className="mt-2 text-xs text-terra-soft">
                        {err.nome}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div data-field>
                    <label htmlFor="email" className="eyebrow text-cream-dim">
                      Email *
                    </label>
                    <div className="relative mt-3">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        aria-required
                        defaultValue={state.values.email}
                        aria-invalid={!!err.email}
                        aria-describedby={err.email ? "email-err" : undefined}
                        className={inputClass}
                      />
                    </div>
                    {err.email && (
                      <p id="email-err" role="alert" className="mt-2 text-xs text-terra-soft">
                        {err.email}
                      </p>
                    )}
                  </div>

                  {/* Telefono */}
                  <div data-field>
                    <label htmlFor="telefono" className="eyebrow text-cream-dim">
                      Telefono (facoltativo)
                    </label>
                    <div className="relative mt-3">
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        autoComplete="tel"
                        defaultValue={state.values.telefono}
                        aria-invalid={!!err.telefono}
                        aria-describedby={err.telefono ? "telefono-err" : undefined}
                        className={inputClass}
                      />
                    </div>
                    {err.telefono && (
                      <p id="telefono-err" role="alert" className="mt-2 text-xs text-terra-soft">
                        {err.telefono}
                      </p>
                    )}
                  </div>

                  {/* Servizio */}
                  <div data-field>
                    <label htmlFor="servizio" className="eyebrow text-cream-dim">
                      Servizio *
                    </label>
                    <div className="relative mt-3">
                      <select
                        id="servizio"
                        name="servizio"
                        aria-required
                        defaultValue={state.values.servizio}
                        aria-invalid={!!err.servizio}
                        aria-describedby={err.servizio ? "servizio-err" : undefined}
                        className={`${inputClass} cursor-pointer appearance-none pr-8`}
                      >
                        <option value="" className="bg-espresso text-cream-dim">
                          Seleziona…
                        </option>
                        {SERVICE_NAMES.map((s) => (
                          <option key={s} value={s} className="bg-espresso text-cream">
                            {s}
                          </option>
                        ))}
                      </select>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gold"
                      >
                        ↓
                      </span>
                    </div>
                    {err.servizio && (
                      <p id="servizio-err" role="alert" className="mt-2 text-xs text-terra-soft">
                        {err.servizio}
                      </p>
                    )}
                  </div>

                  {/* Messaggio */}
                  <div data-field className="sm:col-span-2">
                    <label htmlFor="messaggio" className="eyebrow text-cream-dim">
                      Messaggio *
                    </label>
                    <div className="relative mt-3">
                      <textarea
                        id="messaggio"
                        name="messaggio"
                        rows={5}
                        aria-required
                        defaultValue={state.values.messaggio}
                        aria-invalid={!!err.messaggio}
                        aria-describedby={err.messaggio ? "messaggio-err" : undefined}
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                    {err.messaggio && (
                      <p id="messaggio-err" role="alert" className="mt-2 text-xs text-terra-soft">
                        {err.messaggio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Honeypot */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
                >
                  <input name="azienda" tabIndex={-1} autoComplete="off" />
                </div>

                <div data-field className="mt-12">
                  <SubmitButton />
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
