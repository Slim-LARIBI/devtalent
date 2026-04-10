// ─── Application Repository ───────────────────────────────────────────────────
import { prisma } from "@/lib/prisma";
import { buildPrismaSkipTake, buildPaginationResult } from "./base.repository";
import type { ApplicationFilters } from "@/types/application";
import type { Prisma, ApplicationStatus } from "@prisma/client";

// ─── Select objects ───────────────────────────────────────────────────────────

export const applicationFullSelect = {
  id: true,
  expertId: true,
  missionId: true,
  coverNote: true,
  expectedRate: true,
  availability: true,
  status: true,
  recruiterNotes: true,
  createdAt: true,
  updatedAt: true,
  reviewedAt: true,
  shortlistedAt: true,
  closedAt: true,
  expert: {
    select: {
      id: true,
      slug: true,
      title: true,
      level: true,
      yearsOfExperience: true,
      location: true,
      availability: true,
      profileScore: true,
      isPublic: true,
      user: { select: { name: true, image: true, email: true } },
      sectorExperiences: {
        where: { isPrimary: true },
        take: 1,
        select: { sector: true },
      },
      expertise: {
        take: 3,
        select: { expertise: { select: { name: true } } },
      },
      donorExperiences: {
        take: 3,
        select: { donor: true },
      },
      languages: {
        where: { proficiency: { in: ["Native", "Fluent"] } },
        take: 3,
        select: { language: { select: { name: true, code: true } } },
      },
      documents: {
        where: { isPrimary: true, type: "CV" },
        take: 1,
        select: { id: true, name: true, url: true, type: true },
      },
    },
  },
  mission: {
    select: {
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
      _count: { select: { applications: true } },
    },
  },
  documents: {
    select: {
      id: true,
      documentId: true,
      document: { select: { name: true, url: true, type: true } },
    },
  },
} satisfies Prisma.ApplicationSelect;

// ─── Query functions ──────────────────────────────────────────────────────────

export async function findApplicationById(id: string) {
  return prisma.application.findUnique({
    where: { id },
    select: applicationFullSelect,
  });
}

export async function findApplicationByExpertAndMission(
  expertId: string,
  missionId: string
) {
  return prisma.application.findUnique({
    where: { expertId_missionId: { expertId, missionId } },
    select: applicationFullSelect,
  });
}

export async function findManyApplications(filters: ApplicationFilters) {
  const { skip, take } = buildPrismaSkipTake(filters.page, filters.limit);

  const where: Prisma.ApplicationWhereInput = {
    ...(filters.status && { status: filters.status }),
    ...(filters.missionId && { missionId: filters.missionId }),
    ...(filters.expertId && { expertId: filters.expertId }),
    ...(filters.recruiterId && {
      mission: { recruiterId: filters.recruiterId },
    }),
    ...(filters.dateFrom && { createdAt: { gte: filters.dateFrom } }),
    ...(filters.dateTo && { createdAt: { lte: filters.dateTo } }),
  };

  const orderByMap: Record<string, Prisma.ApplicationOrderByWithRelationInput> =
    {
      createdAt: { createdAt: filters.sortOrder ?? "desc" },
      status: { status: filters.sortOrder ?? "asc" },
      updatedAt: { updatedAt: filters.sortOrder ?? "desc" },
    };

  const orderBy =
    filters.sortBy && orderByMap[filters.sortBy]
      ? orderByMap[filters.sortBy]!
      : { createdAt: "desc" as const };

  const [data, total] = await Promise.all([
    prisma.application.findMany({
      where,
      select: applicationFullSelect,
      skip,
      take,
      orderBy,
    }),
    prisma.application.count({ where }),
  ]);

  return buildPaginationResult(data, total, filters.page ?? 1, filters.limit ?? 20);
}

export async function createApplication(data: {
  expertId: string;
  missionId: string;
  coverNote?: string;
  expectedRate?: number;
  availability?: string;
}) {
  return prisma.application.create({
    data,
    select: applicationFullSelect,
  });
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  recruiterNotes?: string
) {
  const now = new Date();
  const timestamps: Prisma.ApplicationUpdateInput = {
    status,
    ...(recruiterNotes !== undefined && { recruiterNotes }),
    ...(status === "REVIEWED" && { reviewedAt: now }),
    ...(status === "SHORTLISTED" && { shortlistedAt: now }),
    ...((status === "REJECTED" || status === "HIRED") && { closedAt: now }),
  };

  return prisma.application.update({
    where: { id },
    data: timestamps,
    select: applicationFullSelect,
  });
}

export async function deleteApplication(id: string) {
  return prisma.application.delete({ where: { id } });
}

export async function countApplications(opts?: {
  missionId?: string;
  expertId?: string;
  recruiterId?: string;
  status?: ApplicationStatus;
}): Promise<number> {
  return prisma.application.count({
    where: {
      ...(opts?.status && { status: opts.status }),
      ...(opts?.missionId && { missionId: opts.missionId }),
      ...(opts?.expertId && { expertId: opts.expertId }),
      ...(opts?.recruiterId && {
        mission: { recruiterId: opts.recruiterId },
      }),
    },
  });
}

export async function getRecruiterDashboardStats(recruiterId: string) {
  const [
    totalMissions,
    publishedMissions,
    draftMissions,
    closedMissions,
    totalApplications,
    newApplications,
    shortlistedCandidates,
    hiredCandidates,
  ] = await Promise.all([
    prisma.mission.count({ where: { recruiterId } }),
    prisma.mission.count({ where: { recruiterId, status: "PUBLISHED" } }),
    prisma.mission.count({ where: { recruiterId, status: "DRAFT" } }),
    prisma.mission.count({ where: { recruiterId, status: "CLOSED" } }),
    prisma.application.count({ where: { mission: { recruiterId } } }),
    prisma.application.count({
      where: { mission: { recruiterId }, status: "NEW" },
    }),
    prisma.application.count({
      where: { mission: { recruiterId }, status: "SHORTLISTED" },
    }),
    prisma.application.count({
      where: { mission: { recruiterId }, status: "HIRED" },
    }),
  ]);

  return {
    totalMissions,
    publishedMissions,
    draftMissions,
    closedMissions,
    totalApplications,
    newApplications,
    shortlistedCandidates,
    hiredCandidates,
  };
}
