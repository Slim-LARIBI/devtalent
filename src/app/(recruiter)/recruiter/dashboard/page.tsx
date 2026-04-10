// ─── Recruiter Dashboard Page ─────────────────────────────────────────────────

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, Briefcase, Users, FileText, Plus,
  TrendingUp, Clock, CheckCircle, AlertCircle,
} from "lucide-react";
import { prisma }         from "@/lib/prisma";
import { StatCard }       from "@/components/shared/stat-card";
import { EmptyState }     from "@/components/shared/empty-state";
import { SectionHeader }  from "@/components/shared/section-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge }          from "@/components/ui/badge";
import { Button }         from "@/components/ui/button";
import { formatDate, formatDeadline, truncate } from "@/lib/utils";
import { APPLICATION_STATUS_LABELS, EXPERT_LEVEL_LABELS } from "@/lib/constants";

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getRecruiterDashboardData(userId: string) {
  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId },
    include: { organization: { select: { name: true, logoUrl: true } } },
  });

  if (!recruiter) return null;

  const [
    totalMissions, publishedMissions, draftMissions,
    totalApplications, newApplications, shortlisted,
    recentApplications, activeMissions,
  ] = await Promise.all([
    prisma.mission.count({ where: { recruiterId: recruiter.id } }),
    prisma.mission.count({ where: { recruiterId: recruiter.id, status: "PUBLISHED" } }),
    prisma.mission.count({ where: { recruiterId: recruiter.id, status: "DRAFT" } }),
    prisma.application.count({ where: { mission: { recruiterId: recruiter.id } } }),
    prisma.application.count({ where: { mission: { recruiterId: recruiter.id }, status: "NEW" } }),
    prisma.application.count({ where: { mission: { recruiterId: recruiter.id }, status: "SHORTLISTED" } }),

    // Recent applications across all missions
    prisma.application.findMany({
      where: { mission: { recruiterId: recruiter.id } },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        expert: {
          select: {
            title: true,
            level: true,
            slug: true,
            user: { select: { name: true, image: true } },
          },
        },
        mission: { select: { title: true, slug: true } },
      },
    }),

    // Active published missions
    prisma.mission.findMany({
      where: { recruiterId: recruiter.id, status: "PUBLISHED" },
      take: 4,
      orderBy: { publishedAt: "desc" },
      include: {
        _count: { select: { applications: true } },
      },
    }),
  ]);

  return {
    recruiter,
    stats: { totalMissions, publishedMissions, draftMissions, totalApplications, newApplications, shortlisted },
    recentApplications,
    activeMissions,
  };
}

// ─── Application status badge ─────────────────────────────────────────────────

function AppStatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, "status-new" | "status-reviewed" | "status-shortlisted" | "status-rejected" | "status-hired"> = {
    NEW: "status-new", REVIEWED: "status-reviewed",
    SHORTLISTED: "status-shortlisted", REJECTED: "status-rejected", HIRED: "status-hired",
  };
  return <Badge variant={variantMap[status] ?? "default"} dot>{APPLICATION_STATUS_LABELS[status] ?? status}</Badge>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function RecruiterDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const data = await getRecruiterDashboardData(session.user.id);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          icon={<AlertCircle />}
          title="Profile not found"
          description="Please complete your recruiter profile to get started."
          action={{ label: "Set up profile", href: "/recruiter/organization" }}
        />
      </div>
    );
  }

  const { recruiter, stats, recentApplications, activeMissions } = data;
  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ─── Welcome header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {recruiter.organization?.name
              ? `${recruiter.organization.name} · Recruiter Dashboard`
              : "Recruiter Dashboard"}
          </p>
        </div>
        <Button variant="brand" size="default" asChild>
          <Link href="/recruiter/missions/new">
            <Plus className="h-4 w-4" />
            Post a mission
          </Link>
        </Button>
      </div>

      {/* ─── New applications alert ─── */}
      {stats.newApplications > 0 && (
        <div className="rounded-xl border border-brand/20 bg-brand-muted/20 p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-muted/60 shrink-0">
            <Users className="h-4.5 w-4.5 text-brand-light" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">
              {stats.newApplications} new application{stats.newApplications > 1 ? "s" : ""} waiting for review
            </p>
            <p className="text-xs text-text-muted">Review candidates and update their status</p>
          </div>
          <Button variant="brand-outline" size="sm" asChild>
            <Link href="/recruiter/applications">
              Review now <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      )}

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Published Missions"
          value={stats.publishedMissions}
          icon={<Briefcase />}
          description={`${stats.draftMissions} in draft`}
          variant="brand"
        />
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={<FileText />}
          description="All time"
        />
        <StatCard
          title="New Applications"
          value={stats.newApplications}
          icon={<Clock />}
          description="Awaiting review"
          variant={stats.newApplications > 0 ? "warning" : "default"}
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlisted}
          icon={<CheckCircle />}
          description="Candidates"
          variant="success"
        />
      </div>

      {/* ─── Content grid ─── */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* ─── Recent applications (3/5) ─── */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <SectionHeader
              title="Recent Applications"
              size="sm"
              action={
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/recruiter/applications">
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              }
            />
          </CardHeader>
          <CardContent className="pt-0">
            {recentApplications.length === 0 ? (
              <EmptyState
                icon={<Users />}
                title="No applications yet"
                description="Publish a mission to start receiving expert applications."
                action={{ label: "Post a mission", href: "/recruiter/missions/new" }}
                compact
              />
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/recruiter/applications/${app.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 hover:border-border-strong hover:bg-surface-raised transition-all group"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand/50 to-accent/30 text-white text-xs font-bold">
                      {(app.expert.user.name ?? "?").split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate group-hover:text-brand transition-colors">
                        {app.expert.user.name ?? "Expert"}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        {app.expert.title ?? EXPERT_LEVEL_LABELS[app.expert.level ?? ""] ?? "Expert"} ·{" "}
                        {truncate(app.mission.title, 32)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <AppStatusBadge status={app.status} />
                      <span className="text-[10px] text-text-muted">{formatDate(app.createdAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ─── Active missions (2/5) ─── */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <SectionHeader
              title="Active Missions"
              size="sm"
              action={
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/recruiter/missions">
                    All <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              }
            />
          </CardHeader>
          <CardContent className="pt-0">
            {activeMissions.length === 0 ? (
              <EmptyState
                icon={<Briefcase />}
                title="No active missions"
                description="Post your first mission to find expert consultants."
                action={{ label: "Post mission", href: "/recruiter/missions/new" }}
                compact
              />
            ) : (
              <div className="space-y-3">
                {activeMissions.map((mission) => (
                  <Link
                    key={mission.id}
                    href={`/recruiter/missions/${mission.id}`}
                    className="block rounded-lg border border-border p-3 hover:border-border-strong hover:bg-surface-raised transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-medium text-text-primary group-hover:text-brand transition-colors line-clamp-2 leading-snug">
                        {mission.title}
                      </p>
                      <Badge variant="mission-published" className="shrink-0">Live</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {mission._count.applications} applicant{mission._count.applications !== 1 ? "s" : ""}
                      </span>
                      <span>{formatDeadline(mission.deadline)}</span>
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
