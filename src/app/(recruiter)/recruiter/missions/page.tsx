import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarDays, Globe2, Plus, Briefcase } from "lucide-react";

function formatStatus(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function getStatusClasses(status: string) {
  switch (status) {
    case "PUBLISHED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "DRAFT":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "CLOSED":
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    case "ARCHIVED":
      return "border-border bg-background text-text-secondary";
    default:
      return "border-border bg-background text-text-secondary";
  }
}

function formatDeadline(value: Date | null) {
  if (!value) return "No deadline";

  return new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDeadlineTone(value: Date | null) {
  if (!value) return "text-text-muted";

  const now = new Date();
  const diff = value.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days <= 3) return "text-rose-300";
  if (days <= 7) return "text-amber-300";
  return "text-text-primary";
}

export default async function RecruiterMissionsPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    redirect("/login");
  }

  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, organizationId: true },
  });

  if (!recruiter) {
    redirect("/recruiter/dashboard");
  }

  const missions = await prisma.mission.findMany({
    where: {
      OR: [
        {
          recruiterId: recruiter.id,
        },
        {
          organizationId: recruiter.organizationId,
          visibility: "ORGANIZATION",
        },
      ],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      country: true,
      deadline: true,
      createdAt: true,
      missionType: true,
      workMode: true,
      visibility: true,
      recruiterId: true,
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  const publishedCount = missions.filter((m) => m.status === "PUBLISHED").length;
  const draftCount = missions.filter((m) => m.status === "DRAFT").length;
  const totalApplications = missions.reduce((sum, mission) => sum + mission._count.applications, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-text-muted">Recruiter / Missions</p>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
            My Missions
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">
            Manage your active and draft missions, monitor deadlines, and review candidate activity.
          </p>
        </div>

        <Link
          href="/recruiter/missions/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-brand-glow transition hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          New mission
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">Total missions</p>
            <div className="rounded-lg bg-brand/10 p-2 text-brand">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold text-text-primary">{missions.length}</p>
          <p className="mt-1 text-sm text-text-muted">
            {publishedCount} published · {draftCount} draft
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">Applications received</p>
            <div className="rounded-lg bg-brand/10 p-2 text-brand">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold text-text-primary">{totalApplications}</p>
          <p className="mt-1 text-sm text-text-muted">Across all missions</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">Active publishing</p>
            <div className="rounded-lg bg-brand/10 p-2 text-brand">
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold text-text-primary">{publishedCount}</p>
          <p className="mt-1 text-sm text-text-muted">Live opportunities open to experts</p>
        </div>
      </div>

      {missions.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <Briefcase className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-text-primary">No missions yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
            Create your first mission to start attracting qualified experts and building your pipeline.
          </p>
          <div className="mt-6">
            <Link
              href="/recruiter/missions/new"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-brand-glow transition hover:opacity-95"
            >
              <Plus className="h-4 w-4" />
              Create first mission
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {missions.map((mission) => {
            const isShared = mission.visibility === "ORGANIZATION";
            const isOwnedByCurrentRecruiter = mission.recruiterId === recruiter.id;

            return (
              <Link
                key={mission.id}
                href={`/recruiter/missions/${mission.id}`}
                className="group rounded-2xl border border-border bg-surface p-5 transition hover:border-border-strong hover:bg-surface-raised"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-text-primary transition group-hover:text-brand">
                        {mission.title}
                      </h2>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusClasses(
                          mission.status
                        )}`}
                      >
                        {formatStatus(mission.status)}
                      </span>

                      <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-text-secondary">
                        {isShared ? "Shared" : "Private"}
                      </span>

                      {!isOwnedByCurrentRecruiter && isShared ? (
                        <span className="rounded-full border border-brand/20 bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-brand">
                          Team mission
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
                        <Globe2 className="h-3.5 w-3.5" />
                        {mission.country || "International"}
                      </span>

                      <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
                        {formatStatus(mission.workMode)}
                      </span>

                      <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
                        {formatStatus(mission.missionType)}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                      <span>
                        <span className="font-medium text-text-primary">
                          {mission._count.applications}
                        </span>{" "}
                        applications
                      </span>
                      <span>
                        Created{" "}
                        <span className="text-text-primary">
                          {new Date(mission.createdAt).toLocaleDateString()}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                    <div className="rounded-xl border border-border bg-background px-4 py-3">
                      <p className="text-[11px] uppercase tracking-wide text-text-muted">
                        Deadline
                      </p>
                      <p className={`mt-1 text-sm font-medium ${getDeadlineTone(mission.deadline)}`}>
                        {formatDeadline(mission.deadline)}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 text-sm font-medium text-brand">
                      View mission
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}