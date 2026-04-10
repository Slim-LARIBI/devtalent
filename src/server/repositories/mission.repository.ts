// ─── Mission Repository ───────────────────────────────────────────────────────
import { prisma } from "@/lib/prisma";
import { buildPrismaSkipTake, buildPaginationResult } from "./base.repository";
import type { MissionFilters } from "@/types/mission";
import type { Prisma, MissionStatus } from "@prisma/client";

// ─── Centralised select objects ───────────────────────────────────────────────

export const missionFullSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  sector: true,
  country: true,
  region: true,
  workMode: true,
  contractType: true,
  missionType: true,
  duration: true,
  seniorityRequired: true,
  donorFunder: true,
  deadline: true,
  startDate: true,
  budgetMin: true,
  budgetMax: true,
  budgetCurrency: true,
  status: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  closedAt: true,
  organization: {
    select: {
      id: true,
      name: true,
      type: true,
      logoUrl: true,
      country: true,
      isVerified: true,
    },
  },
  recruiter: {
    select: {
      id: true,
      jobTitle: true,
      user: { select: { name: true, image: true } },
    },
  },
  languages: {
    select: {
      isRequired: true,
      language: { select: { id: true, name: true, code: true } },
    },
  },
  requiredExpertise: {
    select: {
      isRequired: true,
      expertise: { select: { id: true, name: true } },
    },
  },
  _count: {
    select: { applications: true },
  },
} satisfies Prisma.MissionSelect;

export const missionSummarySelect = {
  id: true,
  slug: true,
  title: true,
  sector: true,
  country: true,
  region: true,
  workMode: true,
  missionType: true,
  seniorityRequired: true,
  donorFunder: true,
  deadline: true,
  publishedAt: true,
  status: true,
  organization: {
    select: {
      id: true,
      name: true,
      type: true,
      logoUrl: true,
      country: true,
      isVerified: true,
    },
  },
  languages: {
    select: { language: { select: { name: true, code: true } } },
  },
  _count: {
    select: { applications: true },
  },
} satisfies Prisma.MissionSelect;

// ─── Query functions ──────────────────────────────────────────────────────────

export async function findMissionById(id: string) {
  return prisma.mission.findUnique({
    where: { id },
    select: missionFullSelect,
  });
}

export async function findMissionBySlug(slug: string) {
  return prisma.mission.findUnique({
    where: { slug },
    select: missionFullSelect,
  });
}

export async function findManyMissions(filters: MissionFilters) {
  const { skip, take } = buildPrismaSkipTake(filters.page, filters.limit);

  const where: Prisma.MissionWhereInput = {
    ...(filters.status
      ? { status: filters.status }
      : { status: "PUBLISHED" }), // default to published
    ...(filters.missionType && { missionType: filters.missionType }),
    ...(filters.workMode && { workMode: filters.workMode }),
    ...(filters.contractType && { contractType: filters.contractType }),
    ...(filters.sector && { sector: filters.sector }),
    ...(filters.country && { country: filters.country }),
    ...(filters.region && { region: filters.region }),
    ...(filters.donorFunder && { donorFunder: filters.donorFunder }),
    ...(filters.seniorityRequired && {
      seniorityRequired: filters.seniorityRequired,
    }),
    ...(filters.languageCode && {
      languages: {
        some: { language: { code: filters.languageCode } },
      },
    }),
    ...(filters.deadlineAfter && {
      deadline: { gte: filters.deadlineAfter },
    }),
    ...(filters.query && {
      OR: [
        { title: { contains: filters.query, mode: "insensitive" } },
        { description: { contains: filters.query, mode: "insensitive" } },
        {
          organization: {
            name: { contains: filters.query, mode: "insensitive" },
          },
        },
      ],
    }),
  };

  const orderByMap: Record<string, Prisma.MissionOrderByWithRelationInput> = {
    publishedAt: { publishedAt: filters.sortOrder ?? "desc" },
    deadline: { deadline: filters.sortOrder ?? "asc" },
    title: { title: filters.sortOrder ?? "asc" },
    viewCount: { viewCount: filters.sortOrder ?? "desc" },
  };

  const orderBy =
    filters.sortBy && orderByMap[filters.sortBy]
      ? orderByMap[filters.sortBy]!
      : { publishedAt: "desc" as const };

  const [data, total] = await Promise.all([
    prisma.mission.findMany({
      where,
      select: missionSummarySelect,
      skip,
      take,
      orderBy,
    }),
    prisma.mission.count({ where }),
  ]);

  return buildPaginationResult(data, total, filters.page ?? 1, filters.limit ?? 20);
}

export async function findMissionsByRecruiter(
  recruiterId: string,
  opts?: { status?: MissionStatus; page?: number; limit?: number }
) {
  const { skip, take } = buildPrismaSkipTake(opts?.page, opts?.limit);

  const where: Prisma.MissionWhereInput = {
    recruiterId,
    ...(opts?.status && { status: opts.status }),
  };

  const [data, total] = await Promise.all([
    prisma.mission.findMany({
      where,
      select: missionSummarySelect,
      skip,
      take,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.mission.count({ where }),
  ]);

  return buildPaginationResult(data, total, opts?.page ?? 1, opts?.limit ?? 20);
}

export async function createMission(data: Prisma.MissionCreateInput) {
  return prisma.mission.create({ data, select: missionFullSelect });
}

export async function updateMission(
  id: string,
  data: Prisma.MissionUpdateInput
) {
  return prisma.mission.update({
    where: { id },
    data,
    select: missionFullSelect,
  });
}

export async function incrementMissionViewCount(id: string) {
  return prisma.mission.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
    select: { id: true, viewCount: true },
  });
}

export async function deleteMission(id: string) {
  return prisma.mission.delete({ where: { id } });
}

export async function countMissions(opts?: {
  status?: MissionStatus;
  recruiterId?: string;
}): Promise<number> {
  return prisma.mission.count({
    where: {
      ...(opts?.status && { status: opts.status }),
      ...(opts?.recruiterId && { recruiterId: opts.recruiterId }),
    },
  });
}
