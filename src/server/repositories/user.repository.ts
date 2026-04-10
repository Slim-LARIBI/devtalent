// ─── User Repository ──────────────────────────────────────────────────────────
import { prisma } from "@/lib/prisma";
import type { User, UserRole } from "@prisma/client";

export interface CreateUserData {
  email: string;
  name: string;
  password?: string;
  role: UserRole;
  image?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  image?: string;
  isActive?: boolean;
}

// All methods are pure async functions.
// This makes them easy to test and extract to NestJS services later.

export async function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(data: CreateUserData): Promise<User> {
  return prisma.user.create({ data });
}

export async function updateUser(
  id: string,
  data: UpdateUserData
): Promise<User> {
  return prisma.user.update({ where: { id }, data });
}

export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({ where: { id } });
}

export async function countUsers(): Promise<number> {
  return prisma.user.count();
}

export async function findAllUsers(opts?: {
  page?: number;
  limit?: number;
  role?: UserRole;
}) {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 20;
  const skip = (page - 1) * limit;

  const where = opts?.role ? { role: opts.role } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            expertProfile: true,
            recruiterProfile: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, limit };
}
