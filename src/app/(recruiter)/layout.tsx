// ─── Recruiter Dashboard Layout ───────────────────────────────────────────────

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <DashboardShell
      role="RECRUITER"
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
