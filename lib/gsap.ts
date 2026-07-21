/*
  Centralised GSAP instance.
  Import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap" in client components
  so plugins are registered exactly once and never tree-shaken away.
*/
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Guard against SSR — ScrollTrigger touches `window` on registration.
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, useGSAP };
