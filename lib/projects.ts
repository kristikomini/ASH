/*
  Selected projects (Italian). Images are local, same-origin JPGs in /public/projects
  (photoreal placeholders — swap for real A.S.H. photography). Each `category`
  maps 1:1 to a service name in lib/services.ts.
*/
export type Project = {
  n: string;
  title: string;
  category: string;
  year: number;
  location: string;
  desc: string;
  img: string;
};

export const PROJECTS: Project[] = [
  {
    n: "01",
    title: "Palazzo Vitali",
    category: "Rasatura armata",
    year: 2024,
    location: "Tolentino",
    desc: "Rasatura armata su 400 mq di pareti storiche, superfici planari pronte alla finitura.",
    img: "/projects/rasatura-armata.jpg",
  },
  {
    n: "02",
    title: "Residenza Il Cortile",
    category: "Intonachino",
    year: 2023,
    location: "Camerino",
    desc: "Intonachino minerale materico nei toni della terra per un casale ristrutturato.",
    img: "/projects/intonachino.jpg",
  },
  {
    n: "03",
    title: "Uffici Marasca",
    category: "Cartongesso",
    year: 2025,
    location: "Macerata",
    desc: "Controsoffitti e pareti in cartongesso con nicchie luminose per open space direzionali.",
    img: "/projects/cartongesso.jpg",
  },
  {
    n: "04",
    title: "Boutique Aurora",
    category: "Carta da parati",
    year: 2022,
    location: "Civitanova Marche",
    desc: "Rivestimenti decorativi d'autore e posa a filo per uno spazio retail elegante.",
    img: "/projects/carta-da-parati.jpg",
  },
  {
    n: "05",
    title: "Villa Sereni",
    category: "Tinteggiatura",
    year: 2023,
    location: "San Severino Marche",
    desc: "Tinteggiatura dai toni caldi e neutri, colore uniforme su volumi a doppia altezza.",
    img: "/projects/tinteggiatura.jpg",
  },
  {
    n: "06",
    title: "Loft San Venanzio",
    category: "Sistemi a secco",
    year: 2021,
    location: "Matelica",
    desc: "Ristrutturazione rapida a secco: nuove partizioni pulite senza tempi di asciugatura.",
    img: "/projects/sistemi-a-secco.jpg",
  },
];
