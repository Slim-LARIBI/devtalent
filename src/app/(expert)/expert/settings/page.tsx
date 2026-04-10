import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ExpertSettingsPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "EXPERT") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      role: true,
      name: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <p className="text-sm text-text-muted">Expert / Settings</p>
        <h1 className="text-3xl font-semibold text-text-primary">Account settings</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Manage your account information and future notification preferences.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">Account overview</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Full name</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {user.name || "Not set"}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Email</p>
            <p className="mt-2 text-sm font-medium text-text-primary">{user.email}</p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Role</p>
            <p className="mt-2 text-sm font-medium text-text-primary">{user.role}</p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Status</p>
            <p className="mt-2 text-sm font-medium text-emerald-600">Active</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>

        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm font-medium text-text-primary">
              Mission invitations
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              You will receive invitations and application-related updates by email.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm font-medium text-text-primary">
              Status updates
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Recruiter actions such as review, shortlist, or hire will appear here in future versions.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">Coming next</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm font-medium text-text-primary">Change password</p>
            <p className="mt-2 text-sm text-text-secondary">
              Password and account security settings will be added here.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm font-medium text-text-primary">Notification preferences</p>
            <p className="mt-2 text-sm text-text-secondary">
              Email and platform notification controls will be added here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}