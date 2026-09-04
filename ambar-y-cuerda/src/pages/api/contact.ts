import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  company?: string; // honeypot
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const POST: APIRoute = async ({ request }) => {
  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_body" }), { status: 400 });
  }

  // Honeypot field: bots fill every input, real visitors never see it.
  if (payload.company) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  const name = (payload.name ?? "").trim().slice(0, 200);
  const email = (payload.email ?? "").trim().slice(0, 320);
  const message = (payload.message ?? "").trim().slice(0, 5000);

  if (!name || !email || !message || !isValidEmail(email)) {
    return new Response(JSON.stringify({ error: "invalid_fields" }), { status: 400 });
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const toAddress = import.meta.env.CONTACT_TO_EMAIL;
  const fromAddress = import.meta.env.CONTACT_FROM_EMAIL ?? "Ámbar & Cuerda <onboarding@resend.dev>";

  if (!apiKey || !toAddress) {
    console.error("[contact] missing RESEND_API_KEY or CONTACT_TO_EMAIL");
    return new Response(JSON.stringify({ error: "not_configured" }), { status: 500 });
  }

  const resend = new Resend(apiKey);

  const escapeHtml = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

  try {
    await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject: `Nuevo mensaje de ${name} — Ámbar & Cuerda`,
      html: `
        <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });
  } catch (err) {
    console.error("[contact] resend send failed:", err);
    return new Response(JSON.stringify({ error: "send_failed" }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
