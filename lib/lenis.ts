/*
  Lenis instance singleton — set from SmoothScroll.tsx so the Nav (and any
  anchor) can drive smooth scrolling. Falls back to native scroll when Lenis
  was never created (reduced-motion).
*/
import type Lenis from "lenis";

let _lenis: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  _lenis = l;
};
export const getLenis = () => _lenis;

// easeOutExpo — matches the site's Lenis easing
const easeOutExpo = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

// Leave room for the fixed nav bar so section tops don't tuck under it.
const NAV_OFFSET = -88;

export function scrollToSection(selector: string) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(selector, {
      offset: NAV_OFFSET,
      duration: 1.2,
      easing: easeOutExpo,
    });
    return;
  }
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function scrollToTop() {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.2, easing: easeOutExpo });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export const lenisStop = () => getLenis()?.stop();
export const lenisStart = () => getLenis()?.start();
