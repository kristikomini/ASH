import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import CanvasBackdrop from "@/components/CanvasBackdrop";

/* Public-site shell: one morphing canvas + smooth scroll + fixed chrome. */
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:text-charcoal"
      >
        Salta al contenuto
      </a>
      <SmoothScroll>
        <CanvasBackdrop />
        <Nav />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <ScrollProgress />
      </SmoothScroll>
    </>
  );
}
