// ─── Expert Dashboard Page ────────────────────────────────────────────────────
// Server component. Fetches real data, renders client components for UI.
// ─────────────────────────────────────────────────────────────────────────────

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, Briefcase, FileText, TrendingUp,
  AlertCircle, Clock, Globe2, Search,
} from "lucide-react";
import { prisma }         from "@/lib/prisma";
import { StatCard }       from "@/components/shared/stat-card";
import { EmptyState }     from "@/components/shared/empty-state";
import { SectionHeader }  from "@/components/shared/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge }          from "@/components/ui/badge";
import { Button }         from "@/components/ui/button";
import { Progress }       from "@/components/ui/progress";
import { formatDate, formatDeadline, truncate } from "@/lib/utils";
import { APPLICATION_STATUS_LABELS, EXPERT_LEVEL_LABELS, WORK_MODE_LABELS } from "@/lib/constants";

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getExpertDashboardData(userId: string) {
  const [profile, recentApplications, recentMissions] = await Promise.all([
    prisma.expertProfile.findUnique({
      where: { userId },
      include: {
        _count: {
          select: {
            expertise: true,
            languages: true,
            sectorExperiences: true,
            donorExperiences: true,
            documents: true,
            applications: true,
          },
        },
      },
    }),

    prisma.application.findMany({
      where: { expert: { userId } },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        mission: {
          select: {
            title: true,
            slug: true,
            sector: true,
            workMode: true,
            organization: { select: { name: true, logoUrl: true } },
          },
        },
      },
    }),

    prisma.mission.findMany({
      where: { status: "PUBLISHED" },
      take: 4,
      orderBy: { publishedAt: "desc" },
      include: {
        organization: { select: { name: true, isVerified: true } },
        languages: { include: { language: { select: { code: true, name: true } } } },
      },
    }),
  ]);

  const applicationStats = {
    total:       profile?._count.applications ?? 0,
    new:         await prisma.application.count({ where: { expert: { userId }, status: "NEW" } }),
    shortlisted: await prisma.application.count({ where: { expert: { userId }, status: "SHORTLISTED" } }),
  };

  return { profile, recentApplications, recentMissions, applicationStats };
}

// ─── Application status badge ─────────────────────────────────────────────────

function ApplicationStatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, "status-new" | "status-reviewed" | "status-shortlisted" | "status-rejected" | "status-hired"> = {
    NEW:         "status-new",
    REVIEWED:    "status-reviewed",
    SHORTLISTED: "status-shortlisted",
    REJECTED:    "status-rejected",
    HIRED:       "status-hired",
  };
  return (
    <Badge variant={variantMap[status] ?? "default"} dot>
      {APPLICATION_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ExpertDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { profile, recentApplications, recentMissions, applicationStats } =
    await getExpertDashboardData(session.user.id);

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ─── Welcome header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Good morning, {firstName}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Here&apos;s what&apos;s happening with your profile and applications.
          </p>
        </div>
          <Button variant="brand" size="default" asChild>
            <Link href="/missions">
              <Search className="h-4 w-4" />
              Browse missions
            </Link>
          </Button>
      </div>

      {/* ─── Profile completion alert ─── */}
      {profile && !profile.isComplete && (
        <div className="rounded-xl border border-warning/20 bg-warning-muted/20 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary">
              Complete your profile to get noticed by recruiters
            </p>
            <div className="mt-2 flex items-center gap-3">
              <Progress
                value={profile.profileScore}
                variant="warning"
                className="flex-1 h-1.5"
              />
              <span className="text-xs font-semibold text-warning shrink-0">
                {profile.profileScore}%
              </span>
            </div>
          </div>
          
<Button variant="ghost" size="sm" asChild className="shrink-0">
  <Link href="/expert/my-profile">
    Complete profile
    <ArrowRight className="h-3.5 w-3.5" />
  </Link>
</Button>


        </div>
      )}

      {/* ─── Stat cards ─── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Applications"
          value={applicationStats.total}
          icon={<FileText />}
          description="Total submitted"
          variant="default"
        />
        <StatCard
          title="Shortlisted"
          value={applicationStats.shortlisted}
          icon={<TrendingUp />}
          description="By recruiters"
          variant="success"
        />
        <StatCard
          title="Under Review"
          value={applicationStats.new}
          icon={<Clock />}
          description="Awaiting feedback"
          variant="default"
        />
        <StatCard
          title="Profile Score"
          value={`${profile?.profileScore ?? 0}%`}
          icon={<Globe2 />}
          description={profile?.isComplete ? "Profile complete" : "Keep improving"}
          variant={profile?.profileScore && profile.profileScore >= 70 ? "brand" : "default"}
        />
      </div>

      {/* ─── Main content grid ─── */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* ─── Recent applications (3/5) ─── */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <SectionHeader
              title="Recent Applications"
              size="sm"
              action={
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/expert/applications">
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              }
            />
          </CardHeader>
          <CardContent className="pt-0">
            {recentApplications.length === 0 ? (
              <EmptyState
                icon={<FileText />}
                title="No applications yet"
                description="Browse open missions and apply with your profile in one click."
                action={{ label: "Browse missions", href: "/missions" }}
                compact
              />
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 hover:border-border-strong hover:bg-surface-raised transition-all"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-muted/40 [&_svg]:size-4">
                      <Briefcase className="text-brand-light" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {truncate(app.mission.title, 48)}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        {app.mission.organization?.name ?? "Organization"} ·{" "}
                        {formatDate(app.createdAt)}
                      </p>
                    </div>
                    <ApplicationStatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ─── New missions (2/5) ─── */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <SectionHeader
              title="New Missions"
              size="sm"
              action={
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/missions">
                    All <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              }
            />
          </CardHeader>
          <CardContent className="pt-0">
            {recentMissions.length === 0 ? (
              <EmptyState
                icon={<Globe2 />}
                title="No missions available"
                description="Check back soon for new opportunities."
                compact
              />
            ) : (
              <div className="space-y-3">
                {recentMissions.map((mission) => (
                  <Link
                    key={mission.id}
                    href={`/missions/${mission.id}`}
                    className="block rounded-lg border border-border p-3 hover:border-border-strong hover:bg-surface-raised transition-all group"
                  >
                    <p className="text-sm font-medium text-text-primary group-hover:text-brand transition-colors truncate mb-1">
                      {truncate(mission.title, 44)}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-text-muted truncate">
                        {mission.organization?.name ?? "Organization"}
                      </p>
                      <span className="text-[10px] shrink-0 font-medium text-warning">
                        {formatDeadline(mission.deadline)}
                      </span>
                    </div>
                    <div className="mt-2 flex gap-1.5 flex-wrap">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-overlay text-text-muted border border-border">
                        {mission.sector}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-overlay text-text-muted border border-border">
                        {WORK_MODE_LABELS[mission.workMode]}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
