import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

function formatStatus(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function ExpertApplicationsPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "EXPERT") {
    redirect("/login");
  }

  const expert = await prisma.expertProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!expert) {
    redirect("/expert/dashboard");
  }

  const applications = await prisma.application.findMany({
    where: {
      expertId: expert.id,
    },
    orderBy: { createdAt: "desc" },
    include: {
      mission: {
        select: {
          id: true,
          title: true,
          country: true,
          organization: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <p className="text-sm text-text-muted">Expert / Applications</p>
        <h1 className="text-2xl font-semibold text-text-primary">
          My Applications
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Track the status of all your submitted applications.
        </p>
      </div>

      {/* EMPTY */}
      {applications.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-text-secondary">
          You have not submitted any applications yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-border bg-surface p-5 transition hover:border-border-strong"
            >
              <div className="flex justify-between items-start">
                {/* LEFT */}
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {app.mission.title}
                  </h3>

                  <p className="text-sm text-text-secondary mt-1">
                    {app.mission.organization?.name || "Organization"} ·{" "}
                    {app.mission.country || "International"}
                  </p>

                  <p className="text-xs text-text-muted mt-2">
                    Applied on{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="text-right space-y-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      app.status === "NEW"
                        ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        : app.status === "REVIEWED"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : app.status === "SHORTLISTED" || app.status === "HIRED"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-red-500/10 text-red-600 border-red-500/20"
                    }`}
                  >
                    {formatStatus(app.status)}
                  </span>

                  <Link
                    href={`/missions/${app.mission.id}`}
                    className="block text-sm text-brand hover:underline"
                  >
                    View mission →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
