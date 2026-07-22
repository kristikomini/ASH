import type { Metadata, Viewport } from "next";
import { Cormorant, Inter } from "next/font/google";
import "./globals.css";

/*
  Root layout: fonts + globals only. The public site and the dashboard each own
  their shell via route groups — app/(marketing) and app/dashboard.

  Display face: Cormorant — an elegant high-contrast serif (Garamond heritage)
  for that refined, architectural, Italian-luxury feel. Body stays Inter.
*/
const display = Cormorant({
  variable: "--font-display-src",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"], // true italics for ghost words + CTA accents
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
  themeColor: "#f4f0e7",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="it"
      className={`${display.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-dvh bg-paper font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
