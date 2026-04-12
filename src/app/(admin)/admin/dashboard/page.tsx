import Link from "next/link";
import { prisma } from "@/lib/prisma";

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href?: string;
}) {
  const content = (
    <div className="rounded-2xl border border-border-primary bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-text-primary">{value}</p>
      {href ? (
        <p className="mt-3 text-sm font-medium text-brand">Open section →</p>
      ) : null}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function QuickLinkCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-border-primary bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-surface-secondary/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {description}
          </p>
        </div>
        <span className="text-brand">→</span>
      </div>
    </Link>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border-primary bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [
    totalUsers,
    totalExperts,
    totalRecruiters,
    totalMissions,
    publishedMissions,
    totalApplications,
    newApplications,
    recentUsers,
    recentMissions,
    recentApplications,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "EXPERT" } }),
    prisma.user.count({ where: { role: "RECRUITER" } }),
    prisma.mission.count(),
    prisma.mission.count({ where: { status: "PUBLISHED" } }),
    prisma.application.count(),
    prisma.application.count({ where: { status: "NEW" } }),

    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),

    prisma.mission.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        country: true,
        createdAt: true,
      },
    }),

    prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        status: true,
        createdAt: true,
        mission: {
          select: {
            title: true,
          },
        },
        expert: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Central control panel for the DevTalent platform.
          </p>
        </div>

        <div className="rounded-xl border border-border-primary bg-white px-4 py-3 text-sm text-text-secondary shadow-sm">
          Platform overview updated in real time
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value={totalUsers} href="/admin/users" />
        <StatCard label="Experts" value={totalExperts} href="/admin/users" />
        <StatCard
          label="Recruiters"
          value={totalRecruiters}
          href="/admin/users"
        />
        <StatCard
          label="Missions"
          value={totalMissions}
          href="/admin/missions"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Published missions"
          value={publishedMissions}
          href="/admin/missions"
        />
        <StatCard
          label="Applications"
          value={totalApplications}
          href="/admin/applications"
        />
        <StatCard
          label="New applications"
          value={newApplications}
          href="/admin/analytics"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <QuickLinkCard
          title="Users"
          description="Search, filter, and review all platform accounts."
          href="/admin/users"
        />
        <QuickLinkCard
          title="Missions"
          description="Monitor mission creation, publication status, and ownership."
          href="/admin/missions"
        />
        <QuickLinkCard
          title="Applications"
          description="Track expert applications and platform activity."
          href="/admin/applications"
        />
        <QuickLinkCard
          title="Analytics"
          description="Review platform KPIs and operational insights."
          href="/admin/analytics"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          title="Recent users"
          description="Latest accounts created on the platform."
        >
          <div className="space-y-4">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-text-secondary">No users found.</p>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-border-primary p-4"
                >
                  <div>
                    <p className="font-medium text-text-primary">
                      {user.name || "Unnamed user"}
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {user.email}
                    </p>
                  </div>
                  <span className="rounded-full bg-surface-secondary px-2.5 py-1 text-xs font-semibold text-text-primary">
                    {user.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Recent missions"
          description="Latest missions added to the platform."
        >
          <div className="space-y-4">
            {recentMissions.length === 0 ? (
              <p className="text-sm text-text-secondary">No missions found.</p>
            ) : (
              recentMissions.map((mission) => (
                <div
                  key={mission.id}
                  className="rounded-xl border border-border-primary p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-text-primary">
                        {mission.title}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        {mission.country || "No country specified"}
                      </p>
                    </div>
                    <span className="rounded-full bg-surface-secondary px-2.5 py-1 text-xs font-semibold text-text-primary">
                      {mission.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Recent applications"
          description="Latest expert applications submitted."
        >
          <div className="space-y-4">
            {recentApplications.length === 0 ? (
              <p className="text-sm text-text-secondary">
                No applications found.
              </p>
            ) : (
              recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-xl border border-border-primary p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-text-primary">
                        {application.expert.user?.name || "Unknown expert"}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        {application.mission.title}
                      </p>
                    </div>
                    <span className="rounded-full bg-surface-secondary px-2.5 py-1 text-xs font-semibold text-text-primary">
                      {application.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}