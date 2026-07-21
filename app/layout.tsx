import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import "./globals.css";

/*
  Fonts injected at the root as CSS variables → zero cumulative layout shift,
  so GSAP/ScrollTrigger measure stable positions on first paint.
*/
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ashfiniture.it"),
  title: {
    default: "A.S.H. Finiture Contract — Specialisti in finiture edili",
    template: "%s · A.S.H. Finiture Contract",
  },
  description:
    "A.S.H. Finiture Contract di Ahmed Abdelaziz. Cartongesso, sistemi a secco, rasatura armata, tinteggiatura, intonachino e carta da parati. Finiture d'interni di alta gamma a Camerino, Marche.",
  keywords: [
    "finiture edili",
    "cartongesso",
    "sistemi a secco",
    "rasatura armata",
    "tinteggiatura",
    "intonachino",
    "carta da parati",
    "Camerino",
    "Marche",
    "ristrutturazioni",
  ],
  authors: [{ name: "Ahmed Abdelaziz" }],
  openGraph: {
    title: "A.S.H. Finiture Contract",
    description:
      "Specialisti in finiture edili — finiture d'interni di alta gamma a Camerino (MC), Marche.",
    locale: "it_IT",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0e12",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-dvh bg-charcoal font-sans text-cream">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:text-charcoal"
        >
          Salta al contenuto
        </a>
        <SmoothScroll>
          <Nav />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <ScrollProgress />
        </SmoothScroll>
      </body>
    </html>
  );
}
