import { prisma } from "@/lib/prisma";
import Link from "next/link";

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
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

function getStatusBadge(status: string) {
  switch (status) {
    case "NEW":
      return "bg-blue-50 text-blue-700";
    case "SHORTLISTED":
      return "bg-amber-50 text-amber-700";
    case "HIRED":
      return "bg-emerald-50 text-emerald-700";
    case "REJECTED":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default async function AdminApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      expert: {
        include: {
          user: true,
        },
      },
      mission: {
        include: {
          organization: true,
          recruiter: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  const total = applications.length;
  const newCount = applications.filter(a => a.status === "NEW").length;
  const shortlisted = applications.filter(a => a.status === "SHORTLISTED").length;
  const hired = applications.filter(a => a.status === "HIRED").length;

  const hireRate = total > 0 ? Math.round((hired / total) * 100) : 0;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">
          Applications
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Monitor platform activity (read-only). Recruiters manage hiring decisions.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total" value={total} />
        <StatCard label="New" value={newCount} />
        <StatCard label="Shortlisted" value={shortlisted} />
        <StatCard label="Hired" value={hired} />
        <StatCard label="Hire rate" value={`${hireRate}%`} />
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-border-primary bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-primary">

            <thead className="bg-surface-secondary">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-text-tertiary">
                  Expert
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-text-tertiary">
                  Mission
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-text-tertiary">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-text-tertiary">
                  Recruiter
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-text-tertiary">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-text-tertiary">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-text-tertiary">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-primary bg-white">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-surface-secondary/40">

                  {/* EXPERT */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-text-primary">
                      {app.expert.user.name}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {app.expert.user.email}
                    </div>
                  </td>

                  {/* MISSION */}
                  <td className="px-6 py-4 text-sm text-text-primary">
                    {app.mission.title}
                  </td>

                  {/* COMPANY */}
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {app.mission.organization?.name || "—"}
                  </td>

                  {/* RECRUITER */}
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {app.mission.recruiter.user.name}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>

                  {/* ACTIONS (READ ONLY) */}
                  <td className="px-6 py-4 text-sm">
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="text-brand font-medium hover:underline"
                    >
                      View
                    </Link>
                  </td>

                </tr>
              ))}

              {applications.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-text-secondary"
                  >
                    No applications found.
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