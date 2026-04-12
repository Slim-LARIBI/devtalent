import { prisma } from "@/lib/prisma";

function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: number;
  sublabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-border-primary bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-text-primary">{value}</p>
      {sublabel ? (
        <p className="mt-2 text-sm text-text-secondary">{sublabel}</p>
      ) : null}
    </div>
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

export default async function AdminAnalyticsPage() {
  const [
    totalUsers,
    totalExperts,
    totalRecruiters,
    totalAdmins,
    totalMissions,
    publishedMissions,
    draftMissions,
    closedMissions,
    totalApplications,
    newApplications,
    shortlistedApplications,
    hiredApplications,
    rejectedApplications,
    latestApplications,
    recruitersByMissionCount,
    missionsWithApplications,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "EXPERT" } }),
    prisma.user.count({ where: { role: "RECRUITER" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),

    prisma.mission.count(),
    prisma.mission.count({ where: { status: "PUBLISHED" } }),
    prisma.mission.count({ where: { status: "DRAFT" } }),
    prisma.mission.count({ where: { status: "CLOSED" } }),

    prisma.application.count(),
    prisma.application.count({ where: { status: "NEW" } }),
    prisma.application.count({ where: { status: "SHORTLISTED" } }),
    prisma.application.count({ where: { status: "HIRED" } }),
    prisma.application.count({ where: { status: "REJECTED" } }),

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

    prisma.recruiterProfile.findMany({
      take: 5,
      orderBy: {
        missions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            missions: true,
          },
        },
      },
    }),

    prisma.mission.findMany({
      take: 5,
      orderBy: {
        applications: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        title: true,
        status: true,
        _count: {
          select: {
            applications: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Platform performance overview for users, missions, and applications.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={totalUsers} />
        <StatCard label="Experts" value={totalExperts} />
        <StatCard label="Recruiters" value={totalRecruiters} />
        <StatCard label="Admins" value={totalAdmins} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total missions" value={totalMissions} />
        <StatCard label="Published missions" value={publishedMissions} />
        <StatCard label="Draft missions" value={draftMissions} />
        <StatCard label="Closed missions" value={closedMissions} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total applications" value={totalApplications} />
        <StatCard label="New applications" value={newApplications} />
        <StatCard label="Shortlisted" value={shortlistedApplications} />
        <StatCard label="Hired" value={hiredApplications} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Application status overview"
          description="Current pipeline health across the platform."
        >
          <div className="space-y-4">
            {[
              { label: "New", value: newApplications },
              { label: "Shortlisted", value: shortlistedApplications },
              { label: "Hired", value: hiredApplications },
              { label: "Rejected", value: rejectedApplications },
            ].map((item) => {
              const percentage =
                totalApplications > 0
                  ? Math.round((item.value / totalApplications) * 100)
                  : 0;

              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-text-primary">
                      {item.label}
                    </span>
                    <span className="text-text-secondary">
                      {item.value} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-secondary">
                    <div
                      className="h-2 rounded-full bg-brand"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          title="Mission status overview"
          description="Publication health of all missions."
        >
          <div className="space-y-4">
            {[
              { label: "Published", value: publishedMissions },
              { label: "Draft", value: draftMissions },
              { label: "Closed", value: closedMissions },
            ].map((item) => {
              const percentage =
                totalMissions > 0
                  ? Math.round((item.value / totalMissions) * 100)
                  : 0;

              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-text-primary">
                      {item.label}
                    </span>
                    <span className="text-text-secondary">
                      {item.value} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-secondary">
                    <div
                      className="h-2 rounded-full bg-brand"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Latest applications"
          description="Most recent application activity."
        >
          <div className="space-y-4">
            {latestApplications.length === 0 ? (
              <p className="text-sm text-text-secondary">
                No applications yet.
              </p>
            ) : (
              latestApplications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-xl border border-border-primary p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-text-primary">
                        {application.expert.user?.name || "Unknown expert"}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {application.expert.user?.email || "—"}
                      </p>
                      <p className="mt-2 text-sm text-text-primary">
                        Applied to{" "}
                        <span className="font-medium">
                          {application.mission.title}
                        </span>
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

        <SectionCard
          title="Top recruiters"
          description="Recruiters with the highest number of posted missions."
        >
          <div className="space-y-4">
            {recruitersByMissionCount.length === 0 ? (
              <p className="text-sm text-text-secondary">
                No recruiters found.
              </p>
            ) : (
              recruitersByMissionCount.map((recruiter) => (
                <div
                  key={recruiter.id}
                  className="flex items-center justify-between rounded-xl border border-border-primary p-4"
                >
                  <div>
                    <p className="font-medium text-text-primary">
                      {recruiter.user?.name || "Unnamed recruiter"}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {recruiter.user?.email || "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-text-primary">
                      {recruiter._count.missions}
                    </p>
                    <p className="text-xs uppercase tracking-[0.12em] text-text-tertiary">
                      Missions
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Top missions by applications"
        description="Most attractive missions on the platform."
      >
        <div className="space-y-4">
          {missionsWithApplications.length === 0 ? (
            <p className="text-sm text-text-secondary">No missions found.</p>
          ) : (
            missionsWithApplications.map((mission) => (
              <div
                key={mission.id}
                className="flex items-center justify-between rounded-xl border border-border-primary p-4"
              >
                <div>
                  <p className="font-medium text-text-primary">
                    {mission.title}
                  </p>
                  <p className="text-sm text-text-secondary">{mission.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-text-primary">
                    {mission._count.applications}
                  </p>
                  <p className="text-xs uppercase tracking-[0.12em] text-text-tertiary">
                    Applications
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </SectionCard>
    </div>
  );
}