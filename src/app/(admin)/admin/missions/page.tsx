import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MissionStatus, Prisma } from "@prisma/client";
import { CompanyTooltip } from "@/components/admin/company-tooltip";

type SearchParams = Promise<{
  q?: string;
  status?: string;
}>;

const statusOptions: Array<"ALL" | MissionStatus> = [
  "ALL",
  "DRAFT",
  "PUBLISHED",
  "CLOSED",
];

function getStatusBadgeClasses(status: MissionStatus) {
  switch (status) {
    case "PUBLISHED":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200";
    case "DRAFT":
      return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200";
    case "CLOSED":
      return "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200";
    default:
      return "bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-200";
  }
}

function getCompetitionBadgeClasses(count: number) {
  if (count >= 4) {
    return "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200";
  }
  if (count >= 2) {
    return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200";
  }
  return "bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-200";
}

function getCompetitionLabel(count: number) {
  if (count >= 4) return "High competition";
  if (count >= 2) return "Medium competition";
  return "Low competition";
}

function getApplicationBadgeClasses(count: number) {
  if (count >= 4) {
    return "bg-brand/10 text-brand ring-1 ring-inset ring-brand/20";
  }
  if (count >= 1) {
    return "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200";
  }
  return "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200";
}

function formatRelativeDate(date: Date) {
  const now = new Date();
  const target = new Date(date);

  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetMidnight = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  const diffMs = nowMidnight.getTime() - targetMidnight.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays <= 7) return `${diffDays} days ago`;

  return target.toLocaleDateString();
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border-primary bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-text-primary">{value}</p>
    </div>
  );
}

type GroupedMission = {
  key: string;
  title: string;
  country: string | null;
  sector: string | null;
  workMode: string | null;
  donorFunder: string | null;
  createdAt: Date;
  statuses: MissionStatus[];
  recruiters: string[];
  recruiterCount: number;
  primaryStatus: MissionStatus;
  applicationCount: number;
};

export default async function AdminMissionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const query = params.q?.trim() || "";
  const selectedStatus =
    params.status && ["DRAFT", "PUBLISHED", "CLOSED"].includes(params.status)
      ? (params.status as MissionStatus)
      : "ALL";

  const where: Prisma.MissionWhereInput = {
    ...(selectedStatus !== "ALL" ? { status: selectedStatus } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { country: { contains: query, mode: "insensitive" } },
            { sector: { contains: query, mode: "insensitive" } },
            { donorFunder: { contains: query, mode: "insensitive" } },
            {
              recruiter: {
                user: {
                  name: { contains: query, mode: "insensitive" },
                },
              },
            },
            {
              recruiter: {
                organization: {
                  name: { contains: query, mode: "insensitive" },
                },
              },
            },
          ],
        }
      : {}),
  };

  const [
    missions,
    totalMissions,
    totalPublished,
    totalDrafts,
    totalClosed,
  ] = await Promise.all([
    prisma.mission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        country: true,
        sector: true,
        workMode: true,
        donorFunder: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            applications: true,
          },
        },
        recruiter: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            organization: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.mission.count(),
    prisma.mission.count({ where: { status: "PUBLISHED" } }),
    prisma.mission.count({ where: { status: "DRAFT" } }),
    prisma.mission.count({ where: { status: "CLOSED" } }),
  ]);

  const groupedMissionsMap = new Map<string, GroupedMission>();

  for (const mission of missions) {
    const normalizedTitle = mission.title.trim().toLowerCase();
    const normalizedCountry = (mission.country || "").trim().toLowerCase();
    const key = `${normalizedTitle}__${normalizedCountry}`;

    const recruiterLabel =
      mission.recruiter?.organization?.name ||
      mission.recruiter?.user?.name ||
      mission.recruiter?.user?.email ||
      "Unknown recruiter";

    if (!groupedMissionsMap.has(key)) {
      groupedMissionsMap.set(key, {
        key,
        title: mission.title,
        country: mission.country,
        sector: mission.sector,
        workMode: mission.workMode,
        donorFunder: mission.donorFunder,
        createdAt: mission.createdAt,
        statuses: [mission.status],
        recruiters: [recruiterLabel],
        recruiterCount: 1,
        primaryStatus: mission.status,
        applicationCount: mission._count.applications,
      });
      continue;
    }

    const existing = groupedMissionsMap.get(key)!;

    existing.statuses.push(mission.status);

    if (!existing.recruiters.includes(recruiterLabel)) {
      existing.recruiters.push(recruiterLabel);
    }

    existing.recruiterCount = existing.recruiters.length;
    existing.applicationCount += mission._count.applications;

    if (mission.createdAt > existing.createdAt) {
      existing.createdAt = mission.createdAt;
    }

    if (!existing.sector && mission.sector) {
      existing.sector = mission.sector;
    }

    if (!existing.workMode && mission.workMode) {
      existing.workMode = mission.workMode;
    }

    if (!existing.donorFunder && mission.donorFunder) {
      existing.donorFunder = mission.donorFunder;
    }

    if (
      existing.primaryStatus !== "PUBLISHED" &&
      mission.status === "PUBLISHED"
    ) {
      existing.primaryStatus = "PUBLISHED";
    }
  }

  const groupedMissions = Array.from(groupedMissionsMap.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
            Missions
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Review platform demand by grouped mission opportunities.
          </p>
        </div>

        <div className="text-sm text-text-tertiary">
          Showing{" "}
          <span className="font-semibold text-text-primary">
            {groupedMissions.length}
          </span>{" "}
          grouped result{groupedMissions.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total missions" value={totalMissions} />
        <StatCard label="Published" value={totalPublished} />
        <StatCard label="Drafts" value={totalDrafts} />
        <StatCard label="Closed" value={totalClosed} />
      </div>

      <div className="rounded-2xl border border-border-primary bg-white p-4 shadow-sm">
        <form className="grid gap-4 lg:grid-cols-[1fr_220px_auto]">
          <div>
            <label
              htmlFor="q"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary"
            >
              Search
            </label>
            <input
              id="q"
              name="q"
              defaultValue={query}
              placeholder="Search by title, country, sector, recruiter or company..."
              className="w-full rounded-xl border border-border-primary bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={selectedStatus}
              className="w-full rounded-xl border border-border-primary bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL" ? "All statuses" : status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="inline-flex h-[46px] items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              Apply filters
            </button>

            <Link
              href="/admin/missions"
              className="inline-flex h-[46px] items-center justify-center rounded-xl border border-border-primary px-5 text-sm font-semibold text-text-primary transition hover:bg-surface-secondary"
            >
              Reset
            </Link>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-primary bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-primary">
            <thead className="bg-surface-secondary">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                  Country
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                  Companies
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                  Competition
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                  Applications
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                  Created
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-primary bg-white">
              {groupedMissions.map((mission) => (
                <tr
                  key={mission.key}
                  className="transition hover:bg-surface-secondary/50"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-text-primary">
                      {mission.title}
                    </div>
                    <div className="mt-1 text-xs text-text-secondary">
                      {[
                        mission.sector,
                        mission.workMode,
                        mission.donorFunder,
                      ]
                        .filter(Boolean)
                        .join(" • ") || "—"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {mission.country || "—"}
                  </td>

                  <td className="px-6 py-4">
                    <CompanyTooltip companies={mission.recruiters} />
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getCompetitionBadgeClasses(
                        mission.recruiterCount
                      )}`}
                    >
                      {getCompetitionLabel(mission.recruiterCount)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getApplicationBadgeClasses(
                        mission.applicationCount
                      )}`}
                    >
                      {mission.applicationCount} application
                      {mission.applicationCount !== 1 ? "s" : ""}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClasses(
                        mission.primaryStatus
                      )}`}
                    >
                      {mission.primaryStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {formatRelativeDate(mission.createdAt)}
                  </td>
                </tr>
              ))}

              {groupedMissions.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-text-secondary"
                  >
                    No grouped missions found for the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}