import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const result = await resend.emails.send({
      from: "DevTalent <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("RESEND RESULT:", result);

    if (result.error) {
      console.error("RESEND ERROR:", result.error);
      return { ok: false, error: result.error.message };
    }

    return { ok: true, data: result.data };
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return { ok: false, error: "Email sending failed" };
  }
}