import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Method from "@/components/Method";
import CtaBand from "@/components/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Method />
      <Projects />
      <CtaBand />
      <Contact />
    </>
  );
}
