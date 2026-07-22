import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import AmbientBand from "@/components/AmbientBand";
import CtaBand from "@/components/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <AmbientBand
        image="/texture-band-light.jpg"
        eyebrow="Il metodo"
        phrase="Dal grezzo al dettaglio, ogni superficie curata a mano."
      />
      <Projects />
      <CtaBand />
      <Contact />
    </>
  );
}
