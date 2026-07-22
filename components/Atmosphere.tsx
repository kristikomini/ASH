/*
  Ambient atmosphere for the light sections — the page should never sit on a
  flat field of paper. Server components, zero JS: CSS-animated radial "aura"
  fields plus giant italic serif ghost words at whisper opacity. Everything is
  decorative (aria-hidden), non-interactive, and transform/opacity only; the
  global reduced-motion kill-switch freezes the drift.

  Usage (inside a `relative overflow-clip` section, before the content, with
  the content container itself `relative` so it paints above):

    <Atmosphere>
      <Aura tint="gold" className="left-[-12%] top-[-8%] h-[46vw] w-[46vw]" drift="a" />
      <GhostWord className="right-[-2%] top-[5%] text-[15vw]">Finiture</GhostWord>
    </Atmosphere>
*/

const TINTS = {
  gold: "radial-gradient(closest-side, rgba(198,161,91,0.16), transparent 72%)",
  blush: "radial-gradient(closest-side, rgba(201,113,78,0.10), transparent 72%)",
  olive: "radial-gradient(closest-side, rgba(122,124,84,0.11), transparent 72%)",
  bronze: "radial-gradient(closest-side, rgba(143,111,63,0.12), transparent 72%)",
} as const;

const DRIFTS = {
  a: "animate-[aura-a_38s_ease-in-out_infinite]",
  b: "animate-[aura-b_46s_ease-in-out_infinite]",
} as const;

export function Atmosphere({ children }: { children: React.ReactNode }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
      {children}
    </div>
  );
}

export function Aura({
  tint,
  drift = "a",
  className = "",
}: {
  tint: keyof typeof TINTS;
  drift?: keyof typeof DRIFTS;
  className?: string;
}) {
  return (
    <div
      className={`absolute rounded-full will-change-transform ${DRIFTS[drift]} ${className}`}
      style={{ backgroundImage: TINTS[tint] }}
    />
  );
}

export function GhostWord({
  children,
  tone = "ink",
  className = "",
}: {
  children: React.ReactNode;
  /* "ink" on the light canvas, "cream" in the dark finale */
  tone?: "ink" | "cream";
  className?: string;
}) {
  return (
    <span
      className={`absolute whitespace-nowrap font-display font-medium italic leading-none ${
        tone === "cream" ? "text-cream/[0.045]" : "text-ink/[0.05]"
      } ${className}`}
    >
      {children}
    </span>
  );
}
