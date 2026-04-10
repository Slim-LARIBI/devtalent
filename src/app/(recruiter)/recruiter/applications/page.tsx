import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, FileText, Users, CheckCircle2, Clock3 } from "lucide-react";

function formatStatus(value: string) {
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

type PageProps = {
  searchParams: Promise<{
    status?: string;
    sort?: string;
  }>;
};

const ALLOWED_STATUSES = ["ALL", "NEW", "REVIEWED", "SHORTLISTED", "REJECTED", "HIRED"] as const;
const ALLOWED_SORTS = ["newest", "oldest"] as const;

export default async function RecruiterApplicationsPage({ searchParams }: PageProps) {
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

  const params = await searchParams;
  const currentStatus =
    ALLOWED_STATUSES.find((s) => s === (params.status || "ALL")) || "ALL";
  const currentSort =
    ALLOWED_SORTS.find((s) => s === (params.sort || "newest")) || "newest";

  const applications = await prisma.application.findMany({
    where: {
      mission: {
        recruiterId: recruiter.id,
      },
      ...(currentStatus !== "ALL" ? { status: currentStatus } : {}),
    },
    orderBy: { createdAt: currentSort === "oldest" ? "asc" : "desc" },
    include: {
      expert: {
        include: {
          user: true,
        },
      },
      mission: {
        select: {
          id: true,
          title: true,
          country: true,
          sector: true,
        },
      },
    },
  });

  const allApplications = await prisma.application.findMany({
    where: {
      mission: {
        recruiterId: recruiter.id,
      },
    },
    select: {
      status: true,
    },
  });

  const totalCount = allApplications.length;
  const newCount = allApplications.filter((a) => a.status === "NEW").length;
  const shortlistedCount = allApplications.filter((a) => a.status === "SHORTLISTED").length;
  const hiredCount = allApplications.filter((a) => a.status === "HIRED").length;

  const statusLinks = [
    { label: "All", value: "ALL" },
    { label: "New", value: "NEW" },
    { label: "Reviewed", value: "REVIEWED" },
    { label: "Shortlisted", value: "SHORTLISTED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Hired", value: "HIRED" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-text-muted">Recruiter / Applications</p>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
            Applications
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">
            Review candidate applications, monitor progress, and move the best profiles through your hiring pipeline.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">Total applications</p>
            <div className="rounded-lg bg-brand/10 p-2 text-brand">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold text-text-primary">{totalCount}</p>
          <p className="mt-1 text-sm text-text-muted">Across all recruiter missions</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">New</p>
            <div className="rounded-lg bg-sky-500/10 p-2 text-sky-300">
              <Clock3 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold text-text-primary">{newCount}</p>
          <p className="mt-1 text-sm text-text-muted">Awaiting first review</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">Shortlisted</p>
            <div className="rounded-lg bg-violet-500/10 p-2 text-violet-300">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold text-text-primary">{shortlistedCount}</p>
          <p className="mt-1 text-sm text-text-muted">Strong candidates retained</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">Hired</p>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold text-text-primary">{hiredCount}</p>
          <p className="mt-1 text-sm text-text-muted">Successfully converted</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusLinks.map((item) => {
              const active = currentStatus === item.value;
              return (
                <Link
                  key={item.value}
                  href={`/recruiter/applications?status=${item.value}&sort=${currentSort}`}
                  className={`rounded-full border px-3 py-2 text-sm transition ${
                    active
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-border bg-background text-text-secondary hover:border-brand/40 hover:text-text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">Sort</span>
            <Link
              href={`/recruiter/applications?status=${currentStatus}&sort=newest`}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                currentSort === "newest"
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border bg-background text-text-secondary hover:border-brand/40"
              }`}
            >
              Newest
            </Link>
            <Link
              href={`/recruiter/applications?status=${currentStatus}&sort=oldest`}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                currentSort === "oldest"
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border bg-background text-text-secondary hover:border-brand/40"
              }`}
            >
              Oldest
            </Link>
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <FileText className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-text-primary">
            No applications found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
            Try another status filter or wait for new experts to apply.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <Link
              key={application.id}
              href={`/recruiter/applications/${application.id}`}
              className="group rounded-2xl border border-border bg-surface p-5 transition hover:border-border-strong hover:bg-surface-raised"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-text-primary transition group-hover:text-brand">
                      {application.expert.user.name || "Unnamed candidate"}
                    </h2>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusClasses(
                        application.status
                      )}`}
                    >
                      {formatStatus(application.status)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-text-secondary">
                    {application.expert.title || "No title"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
                      {application.mission.title}
                    </span>

                    {application.mission.sector ? (
                      <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs text-brand">
                        {application.mission.sector}
                      </span>
                    ) : null}

                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
                      {application.mission.country || "International"}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                  <div className="text-sm text-text-muted lg:text-right">
                    <p>Submitted on</p>
                    <p className="mt-1 font-medium text-text-primary">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 text-sm font-medium text-brand">
                    View application
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}