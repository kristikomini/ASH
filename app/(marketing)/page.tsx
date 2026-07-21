import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import AmbientBand from "@/components/AmbientBand";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <AmbientBand
        image="/texture-band-1.jpg"
        eyebrow="Il metodo"
        phrase="Dal grezzo al dettaglio, ogni superficie curata a mano."
      />
      <Projects />
      <AmbientBand
        image="/texture-band-2.jpg"
        eyebrow="Marche · Italia"
        phrase="Precisione millimetrica, finiture che durano nel tempo."
      />
      <Contact />
    </>
  );
}
