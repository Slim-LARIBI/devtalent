import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatDuration(ms: number | null) {
  if (!ms || ms <= 0) return "—";

  const minutes = Math.floor(ms / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) return `${days}d`;
  if (hours >= 1) return `${hours}h`;
  if (minutes >= 1) return `${minutes}m`;
  return "<1m";
}

function formatDateTime(value: Date | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function getSignal(invitation: {
  openCount: number;
  clickCount: number;
  appliedAt: Date | null;
}) {
  if (invitation.appliedAt) return "🔥 Applied";
  if (invitation.clickCount > 0 && invitation.openCount >= 2) return "👀 High intent";
  if (invitation.clickCount > 0) return "👍 Clicked";
  if (invitation.openCount > 0) return "📩 Opened";
  return "❄️ No response";
}

export default async function MissionTrackingPage({ params }: PageProps) {
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

  const mission = await prisma.mission.findFirst({
    where: {
      id,
      recruiterId: recruiter.id,
    },
    select: {
      id: true,
      title: true,
      status: true,
      country: true,
      donorFunder: true,
      createdAt: true,
    },
  });

  if (!mission) {
    notFound();
  }

  const invitations = await prisma.invitation.findMany({
    where: {
      missionId: mission.id,
      recruiterId: recruiter.id,
    },
    include: {
      expert: {
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
    orderBy: { createdAt: "desc" },
  });

  const invited = invitations.length;
  const opened = invitations.filter((item) => item.openCount > 0).length;
  const clicked = invitations.filter((item) => item.clickCount > 0).length;
  const applied = invitations.filter((item) => item.appliedAt !== null).length;
  const noResponse = invitations.filter((item) => item.openCount === 0).length;

  const openRate = invited > 0 ? Math.round((opened / invited) * 100) : 0;
  const clickRate = invited > 0 ? Math.round((clicked / invited) * 100) : 0;
  const applyRate = invited > 0 ? Math.round((applied / invited) * 100) : 0;

  const openDurations = invitations
    .filter((item) => item.firstOpenedAt)
    .map((item) => item.firstOpenedAt!.getTime() - item.sentAt.getTime());

  const clickDurations = invitations
    .filter((item) => item.firstClickedAt)
    .map((item) => item.firstClickedAt!.getTime() - item.sentAt.getTime());

  const applyDurations = invitations
    .filter((item) => item.appliedAt)
    .map((item) => item.appliedAt!.getTime() - item.sentAt.getTime());

  const average = (values: number[]) => {
    if (values.length === 0) return null;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  };

  const avgTimeToOpen = average(openDurations);
  const avgTimeToClick = average(clickDurations);
  const avgTimeToApply = average(applyDurations);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-text-muted">Recruiter / Missions / Tracking</p>
          <h1 className="text-3xl font-semibold text-text-primary">{mission.title}</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Track invitation performance, expert engagement, and conversion to application.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {mission.country ? (
              <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
                {mission.country}
              </span>
            ) : null}
            {mission.donorFunder ? (
              <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs text-brand">
                {mission.donorFunder}
              </span>
            ) : null}
            <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
              {mission.status}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/recruiter/missions/${mission.id}`}
            className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-raised"
          >
            Back to mission
          </Link>

          <Link
            href={`/recruiter/experts?missionId=${mission.id}`}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition hover:opacity-95"
          >
            Invite more experts
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm text-text-secondary">Invited</p>
          <p className="mt-3 text-3xl font-semibold text-text-primary">{invited}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm text-text-secondary">Opened</p>
          <p className="mt-3 text-3xl font-semibold text-text-primary">{opened}</p>
          <p className="mt-1 text-xs text-text-muted">{openRate}% open rate</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm text-text-secondary">Clicked</p>
          <p className="mt-3 text-3xl font-semibold text-text-primary">{clicked}</p>
          <p className="mt-1 text-xs text-text-muted">{clickRate}% click rate</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm text-text-secondary">Applied</p>
          <p className="mt-3 text-3xl font-semibold text-text-primary">{applied}</p>
          <p className="mt-1 text-xs text-text-muted">{applyRate}% apply rate</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm text-text-secondary">No response</p>
          <p className="mt-3 text-3xl font-semibold text-text-primary">{noResponse}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-text-primary">Funnel</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Mission conversion from outreach to application.
          </p>

          <div className="mt-6 space-y-3">
            {[
              { label: "Invited", value: invited },
              { label: "Opened", value: opened },
              { label: "Clicked", value: clicked },
              { label: "Applied", value: applied },
            ].map((item, index) => (
              <div key={item.label}>
                <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                  <span className="text-sm text-text-secondary">{item.label}</span>
                  <span className="text-lg font-semibold text-text-primary">{item.value}</span>
                </div>
                {index < 3 ? (
                  <div className="flex justify-center py-2 text-text-muted">↓</div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-text-primary">Time to action</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Average delay between invitation and expert activity.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm text-text-secondary">Avg time to open</p>
              <p className="mt-2 text-2xl font-semibold text-text-primary">
                {formatDuration(avgTimeToOpen)}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm text-text-secondary">Avg time to click</p>
              <p className="mt-2 text-2xl font-semibold text-text-primary">
                {formatDuration(avgTimeToClick)}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm text-text-secondary">Avg time to apply</p>
              <p className="mt-2 text-2xl font-semibold text-text-primary">
                {formatDuration(avgTimeToApply)}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-background p-4">
            <p className="text-sm text-text-secondary">Recruiter performance</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Open rate</p>
                <p className="mt-1 text-lg font-semibold text-text-primary">{openRate}%</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Click rate</p>
                <p className="mt-1 text-lg font-semibold text-text-primary">{clickRate}%</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Apply rate</p>
                <p className="mt-1 text-lg font-semibold text-text-primary">{applyRate}%</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Expert engagement</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Open count, clicks, apply status, and engagement signal per invited expert.
            </p>
          </div>

          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
            {invitations.length} invitation(s)
          </span>
        </div>

        {invitations.length === 0 ? (
          <div className="mt-6 rounded-xl border border-border bg-background p-6 text-sm text-text-secondary">
            No invitations yet for this mission.
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-text-muted">
                  <th className="px-3 py-3 font-medium">Expert</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Opens</th>
                  <th className="px-3 py-3 font-medium">Clicks</th>
                  <th className="px-3 py-3 font-medium">Applied</th>
                  <th className="px-3 py-3 font-medium">Last activity</th>
                  <th className="px-3 py-3 font-medium">Signal</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((invitation) => (
                  <tr key={invitation.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-4">
                      <div>
                        <p className="font-medium text-text-primary">
                          {invitation.expert.user.name || "Unnamed expert"}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">{invitation.expertEmail}</p>
                      </div>
                    </td>

                    <td className="px-3 py-4 text-text-secondary">{invitation.status}</td>
                    <td className="px-3 py-4 text-text-secondary">{invitation.openCount}</td>
                    <td className="px-3 py-4 text-text-secondary">{invitation.clickCount}</td>
                    <td className="px-3 py-4 text-text-secondary">
                      {invitation.appliedAt ? "✅" : "—"}
                    </td>
                    <td className="px-3 py-4 text-text-secondary">
                      {formatDateTime(invitation.lastActivityAt || invitation.sentAt)}
                    </td>
                    <td className="px-3 py-4 text-text-secondary">
                      {getSignal(invitation)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}