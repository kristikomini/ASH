/*
  Contact form state shape + initial value.
  Kept OUT of the "use server" action file, which may only export async functions.
*/
export type Field = "nome" | "email" | "telefono" | "servizio" | "messaggio";

export type ContactState = {
  ok: boolean | null; // null = untouched
  message: string; // it-IT banner summary
  errors: Partial<Record<Field, string>>;
  values: Record<Field, string>;
};

export const emptyValues: Record<Field, string> = {
  nome: "",
  email: "",
  telefono: "",
  servizio: "",
  messaggio: "",
};

export const initialContactState: ContactState = {
  ok: null,
  message: "",
  errors: {},
  values: emptyValues,
};
