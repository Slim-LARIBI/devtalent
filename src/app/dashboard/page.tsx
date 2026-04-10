// ─── Role-based Dashboard Redirect ────────────────────────────────────────────
// Server component. Reads session role and redirects to the correct dashboard.
// ─────────────────────────────────────────────────────────────────────────────

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRedirectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  switch (session.user.role) {
    case "EXPERT":
      redirect("/expert/dashboard");
    case "RECRUITER":
      redirect("/recruiter/dashboard");
    case "ADMIN":
      redirect("/admin/dashboard");
    default:
      redirect("/");
  }
}
