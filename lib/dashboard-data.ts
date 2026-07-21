/*
  Sample back-office data for the A.S.H. dashboard (demo / prototype — no backend).
  Dates are anchored around July 2026. Swap for a real DB/API when wired up.
*/

export type LeadStatus = "Nuovo" | "Contattato" | "Preventivo" | "Chiuso";
export type Lead = {
  id: string;
  nome: string;
  email: string;
  telefono: string;
  servizio: string;
  messaggio: string;
  data: string; // ISO date
  status: LeadStatus;
  valore: number; // estimated € value
  fonte: "Sito web" | "Passaparola" | "Telefono";
};

export type ProjectStatus = "Preventivo" | "In corso" | "Completato";
export type DProject = {
  id: string;
  titolo: string;
  cliente: string;
  categoria: string;
  luogo: string;
  status: ProjectStatus;
  valore: number;
  avanzamento: number; // 0..100
  inizio: string;
  img: string;
};

export type AppointmentType = "Sopralluogo" | "Consegna" | "Riunione";
export type Appointment = {
  id: string;
  titolo: string;
  cliente: string;
  tipo: AppointmentType;
  data: string; // ISO date
  ora: string;
  luogo: string;
};

export const LEADS: Lead[] = [
  { id: "L-1042", nome: "Giulia Marasca", email: "g.marasca@studiomarasca.it", telefono: "329 118 4420", servizio: "Cartongesso", messaggio: "Controsoffitti e pareti per nuovo open space direzionale, ~180 mq.", data: "2026-07-20", status: "Nuovo", valore: 24000, fonte: "Sito web" },
  { id: "L-1041", nome: "Marco Bellini", email: "marco.bellini@gmail.com", telefono: "347 902 7781", servizio: "Rasatura armata", messaggio: "Pareti storiche da rasare prima della finitura, palazzo in centro.", data: "2026-07-19", status: "Contattato", valore: 18500, fonte: "Sito web" },
  { id: "L-1040", nome: "Chiara De Santis", email: "chiara.desantis@outlook.it", telefono: "333 445 1290", servizio: "Intonachino", messaggio: "Intonachino minerale per casale ristrutturato, toni terra.", data: "2026-07-18", status: "Preventivo", valore: 31000, fonte: "Passaparola" },
  { id: "L-1039", nome: "Studio Aureli", email: "info@studioaureli.it", telefono: "0733 261 887", servizio: "Carta da parati", messaggio: "Rivestimenti d'autore per boutique, posa a filo.", data: "2026-07-16", status: "Contattato", valore: 12800, fonte: "Sito web" },
  { id: "L-1038", nome: "Luca Fioretti", email: "l.fioretti@fiorettispa.it", telefono: "340 771 2213", servizio: "Sistemi a secco", messaggio: "Partizioni a secco per uffici, tempi stretti.", data: "2026-07-15", status: "Chiuso", valore: 27500, fonte: "Telefono" },
  { id: "L-1037", nome: "Elena Rossi", email: "elena.rossi92@gmail.com", telefono: "348 220 6654", servizio: "Tinteggiatura", messaggio: "Tinteggiatura completa villa a doppia altezza.", data: "2026-07-14", status: "Preventivo", valore: 9400, fonte: "Sito web" },
  { id: "L-1036", nome: "Alberto Conti", email: "a.conti@contiedil.it", telefono: "339 556 0091", servizio: "Cartongesso", messaggio: "Nicchie luminose e controsoffitti per showroom.", data: "2026-07-11", status: "Chiuso", valore: 21200, fonte: "Passaparola" },
  { id: "L-1035", nome: "Federica Neri", email: "fede.neri@libero.it", telefono: "351 118 9930", servizio: "Rasatura armata", messaggio: "Rasatura armata su 90 mq, appartamento.", data: "2026-07-09", status: "Nuovo", valore: 7600, fonte: "Sito web" },
  { id: "L-1034", nome: "Giordano Bianchi", email: "g.bianchi@bianchi-immobili.it", telefono: "335 447 8820", servizio: "Intonachino", messaggio: "Intonachino per hall di ingresso residenziale.", data: "2026-07-07", status: "Contattato", valore: 14300, fonte: "Sito web" },
  { id: "L-1033", nome: "Sara Ferretti", email: "sara.ferretti@icloud.com", telefono: "346 002 3311", servizio: "Carta da parati", messaggio: "Carta da parati camera master, motivo botanico.", data: "2026-07-04", status: "Chiuso", valore: 4200, fonte: "Telefono" },
  { id: "L-1032", nome: "Paolo Gentili", email: "p.gentili@gentilicostruzioni.it", telefono: "329 771 5540", servizio: "Sistemi a secco", messaggio: "Ristrutturazione loft, nuove partizioni.", data: "2026-07-01", status: "Preventivo", valore: 33800, fonte: "Sito web" },
];

export const DPROJECTS: DProject[] = [
  { id: "P-24", titolo: "Palazzo Vitali", cliente: "Immobiliare Vitali", categoria: "Rasatura armata", luogo: "Tolentino", status: "In corso", valore: 46000, avanzamento: 62, inizio: "2026-06-02", img: "/projects/rasatura-armata.jpg" },
  { id: "P-23", titolo: "Residenza Il Cortile", cliente: "Fam. De Santis", categoria: "Intonachino", luogo: "Camerino", status: "In corso", valore: 31000, avanzamento: 38, inizio: "2026-06-22", img: "/projects/intonachino.jpg" },
  { id: "P-22", titolo: "Uffici Marasca", cliente: "Studio Marasca", categoria: "Cartongesso", luogo: "Macerata", status: "Preventivo", valore: 24000, avanzamento: 0, inizio: "2026-08-01", img: "/projects/cartongesso.jpg" },
  { id: "P-21", titolo: "Boutique Aurora", cliente: "Aurora S.r.l.", categoria: "Carta da parati", luogo: "Civitanova Marche", status: "Completato", valore: 12800, avanzamento: 100, inizio: "2026-05-04", img: "/projects/carta-da-parati.jpg" },
  { id: "P-20", titolo: "Villa Sereni", cliente: "Fam. Sereni", categoria: "Tinteggiatura", luogo: "San Severino Marche", status: "In corso", valore: 9400, avanzamento: 80, inizio: "2026-07-06", img: "/projects/tinteggiatura.jpg" },
  { id: "P-19", titolo: "Loft San Venanzio", cliente: "P. Gentili", categoria: "Sistemi a secco", luogo: "Matelica", status: "Preventivo", valore: 33800, avanzamento: 0, inizio: "2026-08-18", img: "/projects/sistemi-a-secco.jpg" },
  { id: "P-18", titolo: "Showroom Conti", cliente: "Conti Edil", categoria: "Cartongesso", luogo: "Tolentino", status: "Completato", valore: 21200, avanzamento: 100, inizio: "2026-04-12", img: "/projects/cartongesso.jpg" },
  { id: "P-17", titolo: "Attico Belvedere", cliente: "M. Bellini", categoria: "Rasatura armata", luogo: "Macerata", status: "Completato", valore: 18500, avanzamento: 100, inizio: "2026-03-20", img: "/projects/rasatura-armata.jpg" },
];

export const APPOINTMENTS: Appointment[] = [
  { id: "A-1", titolo: "Sopralluogo open space", cliente: "Studio Marasca", tipo: "Sopralluogo", data: "2026-07-22", ora: "09:30", luogo: "Macerata" },
  { id: "A-2", titolo: "Consegna cantiere", cliente: "Aurora S.r.l.", tipo: "Consegna", data: "2026-07-22", ora: "15:00", luogo: "Civitanova Marche" },
  { id: "A-3", titolo: "Sopralluogo casale", cliente: "Fam. De Santis", tipo: "Sopralluogo", data: "2026-07-23", ora: "11:00", luogo: "Camerino" },
  { id: "A-4", titolo: "Riunione preventivo", cliente: "P. Gentili", tipo: "Riunione", data: "2026-07-24", ora: "17:30", luogo: "Ufficio" },
  { id: "A-5", titolo: "Sopralluogo villa", cliente: "Fam. Sereni", tipo: "Sopralluogo", data: "2026-07-27", ora: "10:00", luogo: "San Severino Marche" },
  { id: "A-6", titolo: "Consegna palazzo", cliente: "Immobiliare Vitali", tipo: "Consegna", data: "2026-07-29", ora: "14:30", luogo: "Tolentino" },
  { id: "A-7", titolo: "Riunione cliente", cliente: "Conti Edil", tipo: "Riunione", data: "2026-07-30", ora: "16:00", luogo: "Ufficio" },
  { id: "A-8", titolo: "Sopralluogo appartamento", cliente: "F. Neri", tipo: "Sopralluogo", data: "2026-07-31", ora: "09:00", luogo: "Camerino" },
];

// Monthly metrics (Dic 2025 → Lug 2026) for the overview charts.
export const MONTHLY = [
  { mese: "Dic", lead: 9, ricavi: 38000, progetti: 3 },
  { mese: "Gen", lead: 12, ricavi: 41000, progetti: 4 },
  { mese: "Feb", lead: 10, ricavi: 36500, progetti: 3 },
  { mese: "Mar", lead: 15, ricavi: 52000, progetti: 5 },
  { mese: "Apr", lead: 14, ricavi: 47500, progetti: 4 },
  { mese: "Mag", lead: 18, ricavi: 61000, progetti: 6 },
  { mese: "Giu", lead: 21, ricavi: 68500, progetti: 6 },
  { mese: "Lug", lead: 24, ricavi: 74200, progetti: 7 },
];

// Service mix (donut). Colours drawn from the brand's warm palette + 2 cool accents.
export const SERVICE_SPLIT = [
  { nome: "Cartongesso", valore: 28, colore: "#e7cf9b" },
  { nome: "Rasatura armata", valore: 22, colore: "#c6a15b" },
  { nome: "Intonachino", valore: 18, colore: "#a9834b" },
  { nome: "Sistemi a secco", valore: 14, colore: "#8f6f3f" },
  { nome: "Tinteggiatura", valore: 10, colore: "#6fae8f" },
  { nome: "Carta da parati", valore: 8, colore: "#7aa2d0" },
];

/* ---- small derived helpers ---- */
export const eur = (n: number) =>
  new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

export const leadStatusColor: Record<LeadStatus, string> = {
  Nuovo: "#7aa2d0",
  Contattato: "#e7cf9b",
  Preventivo: "#c6a15b",
  Chiuso: "#6fae8f",
};

export const projectStatusColor: Record<ProjectStatus, string> = {
  Preventivo: "#98958d",
  "In corso": "#c6a15b",
  Completato: "#6fae8f",
};

export const apptTypeColor: Record<AppointmentType, string> = {
  Sopralluogo: "#c6a15b",
  Consegna: "#6fae8f",
  Riunione: "#7aa2d0",
};
