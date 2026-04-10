import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeMatchScore } from "@/lib/matching";
import Link from "next/link";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    country?: string;
    donor?: string;
    mode?: string;
    sort?: string;
  }>;
};

function formatEnum(value: string | null | undefined) {
  if (!value) return "—";
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
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

function formatBudget(min?: number | null, max?: number | null, currency?: string | null) {
  if (!min && !max) return "Budget not specified";
  if (min && max) return `${min} - ${max} ${currency || "EUR"}`;
  if (min) return `From ${min} ${currency || "EUR"}`;
  return `Up to ${max} ${currency || "EUR"}`;
}

export default async function MissionsPage({ searchParams }: PageProps) {
  const session = await auth();
  const params = await searchParams;

  const q = params.q?.trim() || "";
  const country = params.country?.trim() || "";
  const donor = params.donor?.trim() || "";
  const mode = params.mode?.trim() || "";
  const sort = params.sort?.trim() || "match";

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

  const missions = await prisma.mission.findMany({
    where: {
      status: "PUBLISHED",
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { sector: { contains: q, mode: "insensitive" } },
              { donorFunder: { contains: q, mode: "insensitive" } },
              { country: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(country
        ? {
            country: {
              equals: country,
              mode: "insensitive",
            },
          }
        : {}),
      ...(donor
        ? {
            donorFunder: {
              equals: donor,
              mode: "insensitive",
            },
          }
        : {}),
      ...(mode
        ? {
            workMode: mode as any,
          }
        : {}),
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

  const expertExpertise = expert?.expertise.map((item) => item.expertise.name) || [];
  const expertLanguages = expert?.languages.map((item) => item.language.name) || [];
  const expertDonors = expert?.donorExperiences.map((item) => item.donor) || [];

  let missionsWithScore = missions.map((mission) => {
    const score = expert
      ? computeMatchScore({
          expert: {
            expertise: expertExpertise,
            donorExperience: expertDonors,
            languages: expertLanguages,
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

    return {
      ...mission,
      matchScore: score,
    };
  });

  if (sort === "newest") {
    missionsWithScore = missionsWithScore.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (sort === "deadline") {
    missionsWithScore = missionsWithScore.sort((a, b) => {
      const aTime = a.deadline ? new Date(a.deadline).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.deadline ? new Date(b.deadline).getTime() : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });
  } else {
    missionsWithScore = missionsWithScore.sort((a, b) => {
      const aScore = a.matchScore ?? -1;
      const bScore = b.matchScore ?? -1;
      return bScore - aScore;
    });
  }

  const allCountriesRaw = await prisma.mission.findMany({
    where: { status: "PUBLISHED" },
    select: { country: true },
    distinct: ["country"],
  });

  const allDonorsRaw = await prisma.mission.findMany({
    where: { status: "PUBLISHED" },
    select: { donorFunder: true },
    distinct: ["donorFunder"],
  });

  const countries = allCountriesRaw
    .map((item) => item.country)
    .filter(Boolean)
    .sort() as string[];

  const donors = allDonorsRaw
    .map((item) => item.donorFunder)
    .filter(Boolean)
    .sort() as string[];

  const hasFilters = Boolean(q || country || donor || mode || (sort && sort !== "match"));

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-text-muted">Expert / Missions</p>
          <h1 className="text-3xl font-semibold text-text-primary">Browse missions</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Discover consulting opportunities and see how well your profile matches each mission.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/expert/dashboard"
            className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-raised"
          >
            ← Dashboard
          </Link>

          <Link
            href="/expert/applications"
            className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition hover:opacity-95"
          >
            My applications
          </Link>
        </div>
      </div>

      <form className="rounded-2xl border border-border bg-surface p-5">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto]">
          <div>
            <label className="text-xs uppercase tracking-wide text-text-muted">Search</label>
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by title, sector, donor, country..."
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-text-muted">Country</label>
            <select
              name="country"
              defaultValue={country}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
            >
              <option value="">All countries</option>
              {countries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-text-muted">Donor</label>
            <select
              name="donor"
              defaultValue={donor}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
            >
              <option value="">All donors</option>
              {donors.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-text-muted">Work mode</label>
            <select
              name="mode"
              defaultValue={mode}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
            >
              <option value="">All modes</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ON_SITE">On Site</option>
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-text-muted">Sort by</label>
            <select
              name="sort"
              defaultValue={sort}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
            >
              <option value="match">Best match</option>
              <option value="newest">Newest</option>
              <option value="deadline">Closest deadline</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white transition hover:opacity-95"
            >
              Apply filters
            </button>

            <Link
              href="/missions"
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-surface-raised"
            >
              Reset
            </Link>
          </div>
        </div>
      </form>

      {hasFilters ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-text-muted">Active filters:</span>

          {q ? (
            <span className="rounded-full border border-border bg-background px-3 py-1 text-text-secondary">
              Search: {q}
            </span>
          ) : null}

          {country ? (
            <span className="rounded-full border border-border bg-background px-3 py-1 text-text-secondary">
              Country: {country}
            </span>
          ) : null}

          {donor ? (
            <span className="rounded-full border border-border bg-background px-3 py-1 text-text-secondary">
              Donor: {donor}
            </span>
          ) : null}

          {mode ? (
            <span className="rounded-full border border-border bg-background px-3 py-1 text-text-secondary">
              Work mode: {formatEnum(mode)}
            </span>
          ) : null}

          {sort && sort !== "match" ? (
            <span className="rounded-full border border-border bg-background px-3 py-1 text-text-secondary">
              Sort: {formatEnum(sort)}
            </span>
          ) : null}
        </div>
      ) : null}

      {missionsWithScore.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center">
          <h2 className="text-xl font-semibold text-text-primary">
            No missions match your filters
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Try removing one or more filters to discover more opportunities.
          </p>

          <div className="mt-5 flex justify-center gap-3">
            <Link
              href="/missions"
              className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition hover:opacity-95"
            >
              Reset filters
            </Link>

            <Link
              href="/expert/my-profile"
              className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-raised"
            >
              Improve my profile
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {missionsWithScore.map((mission) => {
            const badge = getMatchBadge(mission.matchScore);

            return (
              <Link
                key={mission.id}
                href={`/missions/${mission.id}`}
                className="rounded-2xl border border-border bg-surface p-5 transition hover:border-border-strong hover:bg-surface-raised"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold text-text-primary">
                        {mission.title}
                      </h2>

                      {badge.label ? (
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-2 text-sm text-text-secondary">
                      {mission.organization?.name || "Organization not specified"} ·{" "}
                      {mission.country || "International"} · {formatEnum(mission.workMode)}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {mission.donorFunder ? (
                        <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs text-brand">
                          {mission.donorFunder}
                        </span>
                      ) : null}

                      <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
                        {mission.sector}
                      </span>

                      <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
                        {formatEnum(mission.missionType)}
                      </span>

                      <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
                        {formatEnum(mission.seniorityRequired)}
                      </span>
                    </div>

                    {mission.requiredExpertise.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {mission.requiredExpertise.slice(0, 4).map((item) => (
                          <span
                            key={item.expertise.name}
                            className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary"
                          >
                            {item.expertise.name}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="shrink-0 rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-secondary">
                    <p className="text-xs uppercase tracking-wide text-text-muted">Budget</p>
                    <p className="mt-1 font-medium text-text-primary">
                      {formatBudget(
                        mission.budgetMin ? Number(mission.budgetMin) : null,
                        mission.budgetMax ? Number(mission.budgetMax) : null,
                        mission.budgetCurrency
                      )}
                    </p>
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