/*
  Single source of truth for the six core services.
  Shared by Services.tsx, the Projects category map, and the Contact form + server action.
*/
export type Service = { name: string; desc: string; img: string };

export const SERVICES: Service[] = [
  { name: "Cartongesso", desc: "Pareti e controsoffitti in lastre, precisi e su misura.", img: "/projects/cartongesso.jpg" },
  { name: "Sistemi a secco", desc: "Costruzione rapida e pulita, senza tempi di asciugatura.", img: "/projects/sistemi-a-secco.jpg" },
  { name: "Rasatura armata", desc: "Superfici lisce e resistenti, pronte alla finitura.", img: "/projects/rasatura-armata.jpg" },
  { name: "Tinteggiatura", desc: "Colore uniforme e duraturo, dai toni caldi ai neutri.", img: "/projects/tinteggiatura.jpg" },
  { name: "Intonachino", desc: "Finitura minerale materica, elegante e traspirante.", img: "/projects/intonachino.jpg" },
  { name: "Carta da parati", desc: "Rivestimenti decorativi d'autore, posa impeccabile.", img: "/projects/carta-da-parati.jpg" },
];

export const SERVICE_NAMES = SERVICES.map((s) => s.name);
