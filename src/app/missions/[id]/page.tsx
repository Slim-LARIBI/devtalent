import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeMatchScore } from "@/lib/matching";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatEnum(value: string | null | undefined) {
  if (!value) return "—";
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(value: Date | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

function formatBudget(min?: number | null, max?: number | null, currency?: string | null) {
  if (!min && !max) return "Budget not specified";
  if (min && max) return `${min} - ${max} ${currency || "EUR"}`;
  if (min) return `From ${min} ${currency || "EUR"}`;
  return `Up to ${max} ${currency || "EUR"}`;
}

function getMatchBadge(score: number | null) {
  if (score === null) {
    return {
      label: null,
      className: "",
    };
  }

  if (score >= 85) {
    return {
      label: `🔥 ${score}% match`,
      className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
    };
  }

  if (score >= 65) {
    return {
      label: `👍 ${score}% match`,
      className: "border-brand/20 bg-brand/10 text-brand",
    };
  }

  return {
    label: `⚠️ ${score}% match`,
    className: "border-amber-500/20 bg-amber-500/10 text-amber-700",
    };
}

export default async function MissionDetailPage({ params }: PageProps) {
  const session = await auth();
  const { id } = await params;

  const mission = await prisma.mission.findFirst({
    where: {
      id,
      status: "PUBLISHED",
    },
    include: {
      organization: {
        select: {
          name: true,
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
    },
  });

  if (!mission) {
    notFound();
  }

  const expert =
    session?.user?.id && session.user.role === "EXPERT"
      ? await prisma.expertProfile.findUnique({
          where: { userId: session.user.id },
          include: {
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
        })
      : null;

  const matchScore =
    expert
      ? computeMatchScore({
          expert: {
            expertise: expert.expertise.map((item) => item.expertise.name),
            donorExperience: expert.donorExperiences.map((item) => item.donor),
            languages: expert.languages.map((item) => item.language.name),
            level: expert.level || "MID",
            location: expert.location || "",
          },
          mission: {
            expertise: mission.requiredExpertise.map((item) => item.expertise.name),
            donor: mission.donorFunder,
            languages: mission.languages.map((item) => item.language.name),
            seniority: mission.seniorityRequired,
            country: mission.country,
          },
        })
      : null;

  const badge = getMatchBadge(matchScore);

  const expertExpertise = expert?.expertise.map((item) => item.expertise.name.toLowerCase()) || [];
  const missionExpertise = mission.requiredExpertise.map((item) => item.expertise.name);
  const matchingExpertise = missionExpertise.filter((item) =>
    expertExpertise.includes(item.toLowerCase())
  );

  const expertLanguages = expert?.languages.map((item) => item.language.name.toLowerCase()) || [];
  const missionLanguages = mission.languages.map((item) => item.language.name);
  const matchingLanguages = missionLanguages.filter((item) =>
    expertLanguages.includes(item.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-text-muted">Expert / Missions / Detail</p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold text-text-primary">{mission.title}</h1>

            {badge.label ? (
              <span
                className={`rounded-full border px-3 py-1 text-sm font-medium ${badge.className}`}
              >
                {badge.label}
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-sm text-text-secondary">
            {mission.organization?.name || "Organization not specified"} ·{" "}
            {mission.country || "International"} · {formatEnum(mission.workMode)}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/missions"
            className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-raised"
          >
            Back to missions
          </Link>

          <Link
            href={`/missions/${mission.id}/apply`}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition hover:opacity-95"
          >
            Apply to this mission
          </Link>
        </div>
      </div>

      {expert ? (
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-text-primary">Why this matches your profile</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Expertise match</p>
              <p className="mt-2 text-sm text-text-primary">
                {matchingExpertise.length > 0
                  ? `You match ${matchingExpertise.length}/${missionExpertise.length} required expertise area(s).`
                  : "No direct expertise match detected yet."}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Language match</p>
              <p className="mt-2 text-sm text-text-primary">
                {matchingLanguages.length > 0
                  ? `You match ${matchingLanguages.length}/${missionLanguages.length} required language(s).`
                  : "No direct language match detected yet."}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Seniority</p>
              <p className="mt-2 text-sm text-text-primary">
                Your level: {formatEnum(expert.level)} · Required: {formatEnum(mission.seniorityRequired)}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Location</p>
              <p className="mt-2 text-sm text-text-primary">
                Your location: {expert.location || "Not set"} · Mission country: {mission.country || "Not set"}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">Mission overview</h2>

        <div className="mt-4 rounded-xl border border-border bg-background p-5">
          <p className="whitespace-pre-line text-sm leading-7 text-text-secondary">
            {mission.description}
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Sector</p>
            <p className="mt-2 text-sm font-medium text-text-primary">{mission.sector}</p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Donor</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {mission.donorFunder || "—"}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Country</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {mission.country || "—"}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Work mode</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {formatEnum(mission.workMode)}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Mission type</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {formatEnum(mission.missionType)}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Seniority</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {formatEnum(mission.seniorityRequired)}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Deadline</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {formatDate(mission.deadline)}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Budget</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {formatBudget(
                mission.budgetMin ? Number(mission.budgetMin) : null,
                mission.budgetMax ? Number(mission.budgetMax) : null,
                mission.budgetCurrency
              )}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Required expertise</h2>
            <span className="text-sm text-text-muted">
              {mission.requiredExpertise.length} item(s)
            </span>
          </div>

          {mission.requiredExpertise.length === 0 ? (
            <div className="mt-4 rounded-xl border border-border bg-background p-4 text-sm text-text-secondary">
              No expertise specified.
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {mission.requiredExpertise.map((item) => (
                <span
                  key={item.expertise.name}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary"
                >
                  {item.expertise.name}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Required languages</h2>
            <span className="text-sm text-text-muted">{mission.languages.length} item(s)</span>
          </div>

          {mission.languages.length === 0 ? (
            <div className="mt-4 rounded-xl border border-border bg-background p-4 text-sm text-text-secondary">
              No languages specified.
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {mission.languages.map((item) => (
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
    </div>
  );
}