// ─── Expert Dashboard Layout ──────────────────────────────────────────────────
// Server component. Validates session and role, then renders the shell.
// ─────────────────────────────────────────────────────────────────────────────

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function ExpertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.role !== "EXPERT" && session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <DashboardShell
      role="EXPERT"
      user={{
        name:  session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
    >
      {children}
    </DashboardShell>
  );
}
