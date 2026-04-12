import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma, UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { updateUserRoleAction } from "./actions";

type SearchParams = Promise<{
  q?: string;
  role?: string;
}>;

const roleOptions: Array<"ALL" | UserRole> = [
  "ALL",
  "ADMIN",
  "RECRUITER",
  "EXPERT",
];

function getRoleBadgeClasses(role: UserRole) {
  switch (role) {
    case "ADMIN":
      return "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200";
    case "RECRUITER":
      return "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200";
    case "EXPERT":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200";
    default:
      return "bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-200";
  }
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

function getCompanyLabel(user: {
  role: UserRole;
  recruiterProfile: { organization: { name: string } | null } | null;
}) {
  if (user.role === "ADMIN") return "Platform Admin";
  if (user.role === "RECRUITER") {
    return user.recruiterProfile?.organization?.name || "No organization";
  }
  return "—";
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  const params = await searchParams;

  const query = params.q?.trim() || "";
  const selectedRole =
    params.role && ["ADMIN", "RECRUITER", "EXPERT"].includes(params.role)
      ? (params.role as UserRole)
      : "ALL";

  const where: Prisma.UserWhereInput = {
    ...(selectedRole !== "ALL" ? { role: selectedRole } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            {
              recruiterProfile: {
                organization: {
                  name: { contains: query, mode: "insensitive" },
                },
              },
            },
          ],
        }
      : {}),
  };

  const [users, totalUsers, totalAdmins, totalRecruiters, totalExperts] =
    await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          recruiterProfile: {
            select: {
              organization: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.user.count(),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { role: "RECRUITER" } }),
      prisma.user.count({ where: { role: "EXPERT" } }),
    ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
            Users
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage all platform users from one place.
          </p>
        </div>

        <div className="text-sm text-text-tertiary">
          Showing{" "}
          <span className="font-semibold text-text-primary">{users.length}</span>{" "}
          result{users.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={totalUsers} />
        <StatCard label="Admins" value={totalAdmins} />
        <StatCard label="Recruiters" value={totalRecruiters} />
        <StatCard label="Experts" value={totalExperts} />
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
              placeholder="Search by name, email or company..."
              className="w-full rounded-xl border border-border-primary bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              defaultValue={selectedRole}
              className="w-full rounded-xl border border-border-primary bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role === "ALL" ? "All roles" : role}
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
              href="/admin/users"
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
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-primary bg-white">
              {users.map((user) => {
                const isSelf = user.id === session?.user?.id;

                return (
                  <tr key={user.id} className="transition hover:bg-surface-secondary/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary">
                        {user.name || "—"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleBadgeClasses(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {getCompanyLabel(user)}
                    </td>

                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <form action={updateUserRoleAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="role" value="ADMIN" />
                          <button
                            type="submit"
                            disabled={user.role === "ADMIN"}
                            className="rounded-lg border border-border-primary px-3 py-1.5 text-xs font-semibold text-text-primary transition hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Make admin
                          </button>
                        </form>

                        <form action={updateUserRoleAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="role" value="RECRUITER" />
                          <button
                            type="submit"
                            disabled={user.role === "RECRUITER" || isSelf}
                            className="rounded-lg border border-border-primary px-3 py-1.5 text-xs font-semibold text-text-primary transition hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Set recruiter
                          </button>
                        </form>

                        <form action={updateUserRoleAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="role" value="EXPERT" />
                          <button
                            type="submit"
                            disabled={user.role === "EXPERT" || isSelf}
                            className="rounded-lg border border-border-primary px-3 py-1.5 text-xs font-semibold text-text-primary transition hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Set expert
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-text-secondary"
                  >
                    No users found for the current filters.
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