import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

/*
  Root layout: fonts + globals only. The public site and the dashboard each own
  their shell via route groups — app/(marketing) and app/dashboard.

  Display face: Fraunces — a contemporary variable serif with optical sizing
  (crisp and sharp at display sizes, soft at small) and true italics. More
  modern-luxury than Cormorant, closer to today's editorial identities.
  Body stays Inter.
*/
const display = Fraunces({
  variable: "--font-display-src",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"], // optical size axis — display cuts at hero scale
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
      {/* Background comes from the animated --canvas variable (globals.css) —
          the whole marketing site shares ONE morphing background surface. */}
      <body className="min-h-dvh font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
