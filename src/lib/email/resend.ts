// ─── Resend Email Client ──────────────────────────────────────────────────────
import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY environment variable");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = {
  address: process.env.RESEND_FROM_EMAIL ?? "notifications@devtalent.io",
  name: process.env.RESEND_FROM_NAME ?? "DevTalent",
};

export function formatFrom(): string {
  return `${EMAIL_FROM.name} <${EMAIL_FROM.address}>`;
}
