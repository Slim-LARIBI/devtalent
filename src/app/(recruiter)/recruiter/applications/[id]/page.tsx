import { auth } from "@/lib/auth";
import { ApplicationStatusForm } from "@/components/recruiter/application-status-form";
import { prisma } from "@/lib/prisma";
import { computeMatchScore } from "@/lib/matching";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";

function formatStatus(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatLevel(value: string | null | undefined) {
  if (!value) return "—";
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function getStatusClasses(status: string) {
  switch (status) {
    case "NEW":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    case "REVIEWED":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "SHORTLISTED":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";
    case "REJECTED":
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    case "HIRED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    default:
      return "border-border bg-background text-text-secondary";
  }
}

function getMatchClasses(score: number) {
  if (score >= 85) return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  if (score >= 65) return "border-brand/20 bg-brand/10 text-brand";
  return "border-amber-500/20 bg-amber-500/10 text-amber-300";
}

function formatDate(value: Date | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RecruiterApplicationDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    redirect("/login");
  }

  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!recruiter) {
    redirect("/recruiter/dashboard");
  }

  const { id } = await params;

  const application = await prisma.application.findFirst({
    where: {
      id,
      mission: {
        recruiterId: recruiter.id,
      },
    },
    include: {
      expert: {
        include: {
          user: true,
          expertise: {
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
          donorExperiences: {
            select: {
              donor: true,
            },
          },
        },
      },
      mission: {
        include: {
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
        },
      },
      documents: {
        include: {
          document: {
            select: {
              id: true,
              name: true,
              url: true,
              type: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  if (!application) {
    notFound();
  }

  const matchScore = computeMatchScore({
    expert: {
      expertise: application.expert.expertise.map((item) => item.expertise.name),
      donorExperience: application.expert.donorExperiences.map((item) => item.donor),
      languages: application.expert.languages.map((item) => item.language.name),
      level: application.expert.level || "MID",
      location: application.expert.location || "",
    },
    mission: {
      expertise: application.mission.requiredExpertise.map((item) => item.expertise.name),
      donor: application.mission.donorFunder,
      languages: application.mission.languages.map((item) => item.language.name),
      seniority: application.mission.seniorityRequired,
      country: application.mission.country,
    },
  });

  const linkedCv = application.documents.find((item) => item.document.type === "CV")?.document || null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-text-muted">Recruiter / Applications / Detail</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-text-primary">
              {application.expert.user.name || "Unnamed candidate"}
            </h1>

            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusClasses(
                application.status
              )}`}
            >
              {formatStatus(application.status)}
            </span>

            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getMatchClasses(
                matchScore
              )}`}
            >
              {matchScore}% match
            </span>
          </div>

          <p className="mt-2 text-sm text-text-secondary">
            {application.expert.title || "No title"} · {application.mission.title}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/recruiter/applications"
            className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-raised"
          >
            Back to applications
          </Link>

          <Link
            href={`/recruiter/missions/${application.mission.id}`}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition hover:opacity-95"
          >
            View mission
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">Pipeline actions</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Move this candidate through your hiring workflow.
        </p>

        <div className="mt-4 max-w-md">
          <ApplicationStatusForm
            applicationId={application.id}
            currentStatus={application.status}
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-text-primary">Candidate profile</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Name</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {application.expert.user.name || "—"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Email</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {application.expert.user.email}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Title</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {application.expert.title || "—"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Level</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {formatLevel(application.expert.level)}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Location</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {application.expert.location || "—"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Experience</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {application.expert.yearsOfExperience
                  ? `${application.expert.yearsOfExperience} years`
                  : "—"}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Bio</p>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-text-secondary">
              {application.expert.bio || "No bio provided."}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-text-primary">Application details</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Mission</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {application.mission.title}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Applied on</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {formatDate(application.createdAt)}
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

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Reviewed at</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {formatDate(application.reviewedAt)}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Shortlisted at</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {formatDate(application.shortlistedAt)}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Closed at</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {formatDate(application.closedAt)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Cover note</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-text-secondary">
              {application.coverNote || "No cover note provided."}
            </p>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Expertise</h2>
            <span className="text-sm text-text-muted">
              {application.expert.expertise.length} item(s)
            </span>
          </div>

          {application.expert.expertise.length === 0 ? (
            <div className="mt-4 rounded-xl border border-border bg-background p-4 text-sm text-text-secondary">
              No expertise listed.
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {application.expert.expertise.map((item) => (
                <span
                  key={item.expertise.name}
                  className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs text-brand"
                >
                  {item.expertise.name}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Languages</h2>
            <span className="text-sm text-text-muted">
              {application.expert.languages.length} item(s)
            </span>
          </div>

          {application.expert.languages.length === 0 ? (
            <div className="mt-4 rounded-xl border border-border bg-background p-4 text-sm text-text-secondary">
              No languages listed.
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {application.expert.languages.map((item) => (
                <span
                  key={item.language.name}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary"
                >
                  {item.language.name}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">Linked CV</h2>

        {!linkedCv ? (
          <div className="mt-4 rounded-xl border border-border bg-background p-4 text-sm text-text-secondary">
            No CV linked to this application.
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-border bg-background p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-medium text-text-primary">{linkedCv.name}</p>
                <p className="mt-2 text-sm text-text-secondary">
                  This is the CV used when the candidate submitted the application.
                </p>
                <p className="mt-2 text-xs text-text-muted">
                  Attached on {formatDate(linkedCv.createdAt)}
                </p>
              </div>

              <a
                href={linkedCv.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-raised"
              >
                View CV
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}