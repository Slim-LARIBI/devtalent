// ─── Expert Service ───────────────────────────────────────────────────────────
// Business logic for expert profile management.
// No Next.js-specific imports.
// ─────────────────────────────────────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import {
  findExpertProfileByUserId,
  findExpertProfileById,
  updateExpertProfile,
  upsertExpertLanguage,
  upsertExpertToExpertise,
  removeExpertLanguage,
  removeExpertToExpertise,
} from "@/server/repositories/expert.repository";
import { calculateProfileScore } from "@/lib/utils";
import type {
  CreateExpertProfileDTO,
  UpdateExpertProfileDTO,
  AddLanguageDTO,
  AddExpertiseDTO,
  AddSectorExperienceDTO,
  AddRegionExperienceDTO,
  AddDonorExperienceDTO,
} from "@/types/expert";

export class ExpertNotFoundError extends Error {
  constructor() {
    super("Expert profile not found");
    this.name = "ExpertNotFoundError";
  }
}

export class ExpertAuthorizationError extends Error {
  constructor() {
    super("You are not authorized to modify this expert profile");
    this.name = "ExpertAuthorizationError";
  }
}

// ─── Profile management ───────────────────────────────────────────────────────

export async function getExpertProfileByUserId(userId: string) {
  return findExpertProfileByUserId(userId);
}

export async function updateExpertBasicInfo(
  expertId: string,
  userId: string,
  data: UpdateExpertProfileDTO
) {
  const profile = await findExpertProfileById(expertId);
  if (!profile) throw new ExpertNotFoundError();
  if (profile.userId !== userId) throw new ExpertAuthorizationError();

  const updated = await updateExpertProfile(expertId, {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.bio !== undefined && { bio: data.bio }),
    ...(data.phone !== undefined && { phone: data.phone }),
    ...(data.location !== undefined && { location: data.location }),
    ...(data.level !== undefined && { level: data.level }),
    ...(data.yearsOfExperience !== undefined && {
      yearsOfExperience: data.yearsOfExperience,
    }),
    ...(data.availability !== undefined && { availability: data.availability }),
    ...(data.dailyRateMin !== undefined && { dailyRateMin: data.dailyRateMin }),
    ...(data.dailyRateMax !== undefined && { dailyRateMax: data.dailyRateMax }),
    ...(data.currency !== undefined && { currency: data.currency }),
    ...(data.linkedinUrl !== undefined && { linkedinUrl: data.linkedinUrl }),
    ...(data.portfolioUrl !== undefined && {
      portfolioUrl: data.portfolioUrl,
    }),
  });

  // Recalculate profile score
  await recalculateProfileScore(expertId);

  return updated;
}

export async function addLanguageToExpert(
  expertId: string,
  userId: string,
  data: AddLanguageDTO
) {
  const profile = await findExpertProfileById(expertId);
  if (!profile) throw new ExpertNotFoundError();
  if (profile.userId !== userId) throw new ExpertAuthorizationError();

  await upsertExpertLanguage(expertId, data.languageId, data.proficiency);
  await recalculateProfileScore(expertId);
}

export async function removeLanguageFromExpert(
  expertId: string,
  userId: string,
  languageId: string
) {
  const profile = await findExpertProfileById(expertId);
  if (!profile) throw new ExpertNotFoundError();
  if (profile.userId !== userId) throw new ExpertAuthorizationError();

  await removeExpertLanguage(expertId, languageId);
  await recalculateProfileScore(expertId);
}

export async function addExpertiseToExpert(
  expertId: string,
  userId: string,
  data: AddExpertiseDTO
) {
  const profile = await findExpertProfileById(expertId);
  if (!profile) throw new ExpertNotFoundError();
  if (profile.userId !== userId) throw new ExpertAuthorizationError();

  await upsertExpertToExpertise(expertId, data.expertiseId, data.level);
  await recalculateProfileScore(expertId);
}

export async function removeExpertiseFromExpert(
  expertId: string,
  userId: string,
  expertiseId: string
) {
  const profile = await findExpertProfileById(expertId);
  if (!profile) throw new ExpertNotFoundError();
  if (profile.userId !== userId) throw new ExpertAuthorizationError();

  await removeExpertToExpertise(expertId, expertiseId);
  await recalculateProfileScore(expertId);
}

export async function addSectorExperience(
  expertId: string,
  userId: string,
  data: AddSectorExperienceDTO
) {
  const profile = await findExpertProfileById(expertId);
  if (!profile) throw new ExpertNotFoundError();
  if (profile.userId !== userId) throw new ExpertAuthorizationError();

  const created = await prisma.sectorExperience.create({
    data: { expertId, ...data },
  });
  await recalculateProfileScore(expertId);
  return created;
}

export async function removeSectorExperience(
  sectorExperienceId: string,
  userId: string
) {
  const record = await prisma.sectorExperience.findUnique({
    where: { id: sectorExperienceId },
    include: { expert: { select: { userId: true } } },
  });

  if (!record) throw new Error("Sector experience not found");
  if (record.expert.userId !== userId) throw new ExpertAuthorizationError();

  await prisma.sectorExperience.delete({ where: { id: sectorExperienceId } });
  await recalculateProfileScore(record.expertId);
}

export async function addRegionExperience(
  expertId: string,
  userId: string,
  data: AddRegionExperienceDTO
) {
  const profile = await findExpertProfileById(expertId);
  if (!profile) throw new ExpertNotFoundError();
  if (profile.userId !== userId) throw new ExpertAuthorizationError();

  const created = await prisma.regionExperience.create({
    data: { expertId, ...data },
  });
  await recalculateProfileScore(expertId);
  return created;
}

export async function addDonorExperience(
  expertId: string,
  userId: string,
  data: AddDonorExperienceDTO
) {
  const profile = await findExpertProfileById(expertId);
  if (!profile) throw new ExpertNotFoundError();
  if (profile.userId !== userId) throw new ExpertAuthorizationError();

  const created = await prisma.donorExperience.create({
    data: { expertId, ...data },
  });
  await recalculateProfileScore(expertId);
  return created;
}

// ─── Profile score ────────────────────────────────────────────────────────────

async function recalculateProfileScore(expertId: string): Promise<void> {
  const profile = await prisma.expertProfile.findUnique({
    where: { id: expertId },
    include: {
      _count: {
        select: {
          expertise: true,
          languages: true,
          sectorExperiences: true,
          regionExperiences: true,
          donorExperiences: true,
          documents: true,
        },
      },
    },
  });

  if (!profile) return;

  const score = calculateProfileScore({
    title: profile.title,
    bio: profile.bio,
    level: profile.level,
    yearsOfExperience: profile.yearsOfExperience,
    linkedinUrl: profile.linkedinUrl,
    expertiseCount: profile._count.expertise,
    languageCount: profile._count.languages,
    sectorCount: profile._count.sectorExperiences,
    regionCount: profile._count.regionExperiences,
    donorCount: profile._count.donorExperiences,
    documentCount: profile._count.documents,
  });

  const isComplete = score >= 70;

  await prisma.expertProfile.update({
    where: { id: expertId },
    data: { profileScore: score, isComplete },
  });
}
