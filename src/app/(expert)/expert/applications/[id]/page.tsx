import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";

function formatStatus(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ExpertApplicationDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "EXPERT") {
    redirect("/login");
  }

  const expert = await prisma.expertProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!expert) {
    redirect("/expert/dashboard");
  }

  const { id } = await params;

  const application = await prisma.application.findFirst({
    where: {
      id,
      expertId: expert.id,
    },
    include: {
      mission: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (!application) {
    notFound();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-text-muted">Expert / Applications / Detail</p>
          <h1 className="text-2xl font-semibold text-text-primary">
            {application.mission.title}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            {application.mission.organization?.name || "Organization"} ·{" "}
            {application.mission.country || "International"}
          </p>
        </div>

        <Link
          href="/expert/applications"
          className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-raised"
        >
          Back to applications
        </Link>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">Application status</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Current status</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {formatStatus(application.status)}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Applied on</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Availability</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {application.availability || "—"}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Expected rate</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {application.expectedRate ? `${application.expectedRate} EUR` : "—"}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">Your cover note</h2>

        <div className="mt-4 rounded-xl border border-border bg-background p-4">
          <p className="whitespace-pre-line text-sm leading-7 text-text-secondary">
            {application.coverNote || "No cover note provided."}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">Mission snapshot</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Sector</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {application.mission.sector}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Country</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {application.mission.country || "—"}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Work mode</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {application.mission.workMode}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Mission type</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {application.mission.missionType}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}