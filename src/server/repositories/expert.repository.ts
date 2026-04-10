// ─── Expert Repository ────────────────────────────────────────────────────────
import { prisma } from "@/lib/prisma";
import { buildPrismaSkipTake, buildPaginationResult } from "./base.repository";
import type { ExpertFilters } from "@/types/expert";
import type { Prisma } from "@prisma/client";

// ─── Expert profile select (full) ────────────────────────────────────────────
// Centralised select object ensures consistent shape across all queries.

export const expertProfileFullSelect = {
  id: true,
  userId: true,
  slug: true,
  title: true,
  bio: true,
  phone: true,
  location: true,
  level: true,
  yearsOfExperience: true,
  availability: true,
  dailyRateMin: true,
  dailyRateMax: true,
  currency: true,
  linkedinUrl: true,
  portfolioUrl: true,
  isPublic: true,
  isComplete: true,
  profileScore: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: { name: true, email: true, image: true },
  },
  expertise: {
    select: {
      level: true,
      expertise: { select: { id: true, name: true, slug: true, category: true } },
    },
  },
  sectorExperiences: true,
  regionExperiences: true,
  languages: {
    select: {
      proficiency: true,
      language: { select: { id: true, name: true, code: true } },
    },
  },
  donorExperiences: true,
  documents: {
    where: { isPrimary: true },
    orderBy: { createdAt: "desc" as const },
    take: 1,
  },
} satisfies Prisma.ExpertProfileSelect;

export const expertProfileSummarySelect = {
  id: true,
  slug: true,
  title: true,
  level: true,
  yearsOfExperience: true,
  location: true,
  availability: true,
  profileScore: true,
  isPublic: true,
  user: { select: { name: true, image: true } },
  sectorExperiences: {
    where: { isPrimary: true },
    take: 1,
    select: { sector: true },
  },
  expertise: {
    take: 4,
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
} satisfies Prisma.ExpertProfileSelect;

// ─── Query functions ──────────────────────────────────────────────────────────

export async function findExpertProfileByUserId(userId: string) {
  return prisma.expertProfile.findUnique({
    where: { userId },
    select: expertProfileFullSelect,
  });
}

export async function findExpertProfileById(id: string) {
  return prisma.expertProfile.findUnique({
    where: { id },
    select: expertProfileFullSelect,
  });
}

export async function findExpertProfileBySlug(slug: string) {
  return prisma.expertProfile.findUnique({
    where: { slug },
    select: expertProfileFullSelect,
  });
}

export async function findManyExperts(filters: ExpertFilters) {
  const { skip, take } = buildPrismaSkipTake(filters.page, filters.limit);

  const where: Prisma.ExpertProfileWhereInput = {
    isPublic: true,
    ...(filters.level && { level: filters.level }),
    ...(filters.minYearsOfExperience && {
      yearsOfExperience: { gte: filters.minYearsOfExperience },
    }),
    ...(filters.sector && {
      sectorExperiences: { some: { sector: filters.sector } },
    }),
    ...(filters.country && {
      regionExperiences: { some: { country: filters.country } },
    }),
    ...(filters.donor && {
      donorExperiences: { some: { donor: filters.donor } },
    }),
    ...(filters.languageCode && {
      languages: {
        some: { language: { code: filters.languageCode } },
      },
    }),
    ...(filters.query && {
      OR: [
        { title: { contains: filters.query, mode: "insensitive" } },
        { bio: { contains: filters.query, mode: "insensitive" } },
        { user: { name: { contains: filters.query, mode: "insensitive" } } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.expertProfile.findMany({
      where,
      select: expertProfileSummarySelect,
      skip,
      take,
      orderBy:
        filters.sortBy === "profileScore"
          ? { profileScore: filters.sortOrder ?? "desc" }
          : { updatedAt: "desc" },
    }),
    prisma.expertProfile.count({ where }),
  ]);

  return buildPaginationResult(data, total, filters.page ?? 1, filters.limit ?? 20);
}

export async function createExpertProfile(data: {
  userId: string;
  slug?: string;
}) {
  return prisma.expertProfile.create({ data });
}

export async function updateExpertProfile(
  id: string,
  data: Prisma.ExpertProfileUpdateInput
) {
  return prisma.expertProfile.update({ where: { id }, data });
}

export async function upsertExpertLanguage(
  expertId: string,
  languageId: string,
  proficiency: string
) {
  return prisma.expertLanguage.upsert({
    where: { expertId_languageId: { expertId, languageId } },
    create: { expertId, languageId, proficiency },
    update: { proficiency },
  });
}

export async function removeExpertLanguage(
  expertId: string,
  languageId: string
) {
  return prisma.expertLanguage.delete({
    where: { expertId_languageId: { expertId, languageId } },
  });
}

export async function upsertExpertToExpertise(
  expertId: string,
  expertiseId: string,
  level?: string
) {
  return prisma.expertToExpertise.upsert({
    where: { expertId_expertiseId: { expertId, expertiseId } },
    create: { expertId, expertiseId, level },
    update: { level },
  });
}

export async function removeExpertToExpertise(
  expertId: string,
  expertiseId: string
) {
  return prisma.expertToExpertise.delete({
    where: { expertId_expertiseId: { expertId, expertiseId } },
  });
}

export async function countExperts(): Promise<number> {
  return prisma.expertProfile.count({ where: { isPublic: true } });
}
