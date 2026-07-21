import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

/*
  Root layout: fonts + globals only. The public site and the dashboard each own
  their shell via route groups — app/(marketing) and app/dashboard.
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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="it"
      className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-dvh bg-charcoal font-sans text-cream">
        {children}
      </body>
    </html>
  );
}
