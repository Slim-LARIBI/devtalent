import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function GET() {
  const result = await sendEmail({
    to: "laribi.slim@gmail.com",
    subject: "🚀 DevTalent Test",
    html: "<h1>Email works 🔥</h1>",
  });

  return NextResponse.json(result);
}
