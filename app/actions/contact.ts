"use server";

import { SERVICE_NAMES } from "@/lib/services";
import { type ContactState, type Field, emptyValues } from "@/lib/contact";

export async function submitContact(
  _prev: ContactState,
  fd: FormData
): Promise<ContactState> {
  const v = (k: Field) => String(fd.get(k) ?? "").trim();
  const values: Record<Field, string> = {
    nome: v("nome"),
    email: v("email"),
    telefono: v("telefono"),
    servizio: v("servizio"),
    messaggio: v("messaggio"),
  };

  // Honeypot: a filled hidden field means a bot — succeed silently, send nothing.
  if (String(fd.get("azienda") ?? "")) {
    return { ok: true, message: "Grazie, ti ricontattiamo a breve.", errors: {}, values: emptyValues };
  }

  const errors: ContactState["errors"] = {};
  if (values.nome.length < 2 || values.nome.length > 80)
    errors.nome = "Inserisci il tuo nome.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 120)
    errors.email = "Email non valida.";
  if (values.telefono && !/^[+\d][\d\s().\-]{5,19}$/.test(values.telefono))
    errors.telefono = "Numero non valido.";
  if (!SERVICE_NAMES.includes(values.servizio))
    errors.servizio = "Seleziona un servizio.";
  if (values.messaggio.length < 10 || values.messaggio.length > 2000)
    errors.messaggio = "Scrivi almeno 10 caratteri.";

  if (Object.keys(errors).length) {
    return { ok: false, message: "", errors, values };
  }

  try {
    // ── Integration point ──────────────────────────────────────────────
    // The form is fully validated server-side. To actually deliver the lead,
    // add an email provider here (e.g. Resend) enabled by an env var:
    //
    //   if (process.env.RESEND_API_KEY) {
    //     const { Resend } = await import("resend");
    //     const resend = new Resend(process.env.RESEND_API_KEY);
    //     await resend.emails.send({
    //       from: "sito@ashfiniture.it",
    //       to: "info@ashfiniture.it",
    //       subject: `Nuova richiesta — ${values.servizio}`,
    //       replyTo: values.email,
    //       text: `${values.nome} (${values.email}, ${values.telefono})\n\n${values.messaggio}`,
    //     });
    //   }
    // ───────────────────────────────────────────────────────────────────
    if (process.env.RESEND_API_KEY) {
      // no-op until configured
    }
  } catch {
    return { ok: false, message: "Errore di invio, riprova.", errors: {}, values };
  }

  return { ok: true, message: "Grazie, ti ricontattiamo a breve.", errors: {}, values: emptyValues };
}
