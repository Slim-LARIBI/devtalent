import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  Globe2,
  Lock,
  Users,
  UserRound,
} from "lucide-react";
import { MissionInternalNotes } from "@/components/recruiter/mission-internal-notes";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatStatus(value: string | null | undefined) {
  if (!value) return "—";
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDeadline(value: Date | null) {
  if (!value) return "No deadline";

  return new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatBudget(
  min?: number | null,
  max?: number | null,
  currency?: string | null
) {
  if (!min && !max) return "Not specified";
  if (min && max) return `${min} - ${max} ${currency || "EUR"}`;
  if (min) return `From ${min} ${currency || "EUR"}`;
  return `Up to ${max} ${currency || "EUR"}`;
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

export default async function RecruiterMissionDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    redirect("/login");
  }

  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      organizationId: true,
      organizationRole: true,
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  if (!recruiter) {
    redirect("/recruiter/dashboard");
  }

  const { id } = await params;

  const mission = await prisma.mission.findFirst({
    where: {
      id,
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
    include: {
      organization: {
        select: {
          name: true,
        },
      },
      recruiter: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      applications: {
        select: {
          id: true,
          status: true,
          createdAt: true,
        },
      },
      requiredExpertise: {
        include: {
          expertise: {
            select: {
              name: true,
            },
          },
        },
      },
      languages: {
        include: {
          language: {
            select: {
              name: true,
            },
          },
        },
      },
      internalNotes: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          recruiter: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!mission) {
    notFound();
  }

  const isOwnerRecruiter = mission.recruiterId === recruiter.id;
  const isSharedMission = mission.visibility === "ORGANIZATION";

  const notes = mission.internalNotes.map((note) => ({
    id: note.id,
    content: note.content,
    createdAt: note.createdAt.toISOString(),
    authorName: note.recruiter.user.name || "Unnamed recruiter",
    authorEmail: note.recruiter.user.email,
    authorRole: note.recruiter.organizationRole,
    isCurrentUser: note.recruiterId === recruiter.id,
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-text-muted">Recruiter / Missions / Detail</p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
              {mission.title}
            </h1>

            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusClasses(
                mission.status
              )}`}
            >
              {formatStatus(mission.status)}
            </span>

            <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-text-secondary">
              {isSharedMission ? "Shared" : "Private"}
            </span>

            {!isOwnerRecruiter && isSharedMission ? (
              <span className="rounded-full border border-brand/20 bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-brand">
                Team mission
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-sm text-text-secondary">
            {mission.organization?.name || "Organization"} · {mission.country || "International"} ·{" "}
            {formatStatus(mission.workMode)}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/recruiter/missions"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-surface-raised"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to missions
          </Link>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">Applications</p>
            <div className="rounded-lg bg-brand/10 p-2 text-brand">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold text-text-primary">
            {mission.applications.length}
          </p>
          <p className="mt-1 text-sm text-text-muted">Received so far</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">Deadline</p>
            <div className="rounded-lg bg-brand/10 p-2 text-brand">
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-xl font-semibold text-text-primary">
            {formatDeadline(mission.deadline)}
          </p>
          <p className="mt-1 text-sm text-text-muted">Application closing date</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">Country</p>
            <div className="rounded-lg bg-brand/10 p-2 text-brand">
              <Globe2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-xl font-semibold text-text-primary">
            {mission.country || "International"}
          </p>
          <p className="mt-1 text-sm text-text-muted">{formatStatus(mission.missionType)}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">Created by</p>
            <div className="rounded-lg bg-brand/10 p-2 text-brand">
              {isSharedMission ? <Users className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </div>
          </div>
          <p className="mt-4 text-base font-semibold text-text-primary">
            {mission.recruiter.user.name || "Unnamed recruiter"}
          </p>
          <p className="mt-1 text-sm text-text-muted">
            {mission.recruiter.user.email}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary">Mission overview</h2>

          <div className="mt-5 rounded-2xl border border-border bg-background p-5">
            <p className="whitespace-pre-line text-sm leading-7 text-text-secondary">
              {mission.description}
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Sector</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {mission.sector}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Donor</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {mission.donorFunder || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Contract type</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {formatStatus(mission.contractType)}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Budget</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {formatBudget(
                  mission.budgetMin ? Number(mission.budgetMin) : null,
                  mission.budgetMax ? Number(mission.budgetMax) : null,
                  mission.budgetCurrency
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-text-muted">Required expertise</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {mission.requiredExpertise.length > 0 ? (
                  mission.requiredExpertise.map((item) => (
                    <span
                      key={item.expertise.name}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary"
                    >
                      {item.expertise.name}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-text-secondary">No expertise specified.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-text-muted">Required languages</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {mission.languages.length > 0 ? (
                  mission.languages.map((item) => (
                    <span
                      key={item.language.name}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary"
                    >
                      {item.language.name}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-text-secondary">No language specified.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-brand/10 p-2 text-brand">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Mission ownership</h2>
              <p className="text-sm text-text-secondary">
                Visibility and recruiter collaboration context.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Visibility</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {isSharedMission ? "Shared with organization" : "Private mission"}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Created by</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {mission.recruiter.user.name || "Unnamed recruiter"}
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                {mission.recruiter.user.email}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Your access</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {isOwnerRecruiter
                  ? "You are the mission owner."
                  : isSharedMission
                  ? "You can collaborate because this mission is shared with your organization."
                  : "Limited access."}
              </p>
            </div>
          </div>
        </section>
      </div>

      <MissionInternalNotes missionId={mission.id} notes={notes} />
    </div>
  );
}