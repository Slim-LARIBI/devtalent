// ─── Mission Service ──────────────────────────────────────────────────────────
// Business logic for mission lifecycle management.
// ─────────────────────────────────────────────────────────────────────────────

import {
  findMissionById,
  createMission,
  updateMission,
  deleteMission,
} from "@/server/repositories/mission.repository";
import { generateMissionSlug } from "@/lib/utils";
import type { CreateMissionDTO, UpdateMissionDTO } from "@/types/mission";
import type { Prisma } from "@prisma/client";

export class MissionNotFoundError extends Error {
  constructor() {
    super("Mission not found");
    this.name = "MissionNotFoundError";
  }
}

export class MissionAuthorizationError extends Error {
  constructor() {
    super("You are not authorized to manage this mission");
    this.name = "MissionAuthorizationError";
  }
}

export class MissionStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissionStateError";
  }
}

// ─── Mission CRUD ─────────────────────────────────────────────────────────────

export async function createNewMission(
  recruiterId: string,
  data: CreateMissionDTO
) {
  // Generate a temporary ID for the slug — we'll update after creation
  const tempId = Math.random().toString(36).slice(2, 8);
  const slug = generateMissionSlug(data.title, tempId);

  const { languageIds, expertiseIds, organizationId, ...rest } = data;

  const missionData: Prisma.MissionCreateInput = {
    ...rest,
    slug,
    status: "DRAFT",
    recruiter: { connect: { id: recruiterId } },
    ...(organizationId && { organization: { connect: { id: organizationId } } }),
    ...(languageIds?.length && {
      languages: {
        create: languageIds.map((languageId) => ({
          language: { connect: { id: languageId } },
          isRequired: true,
        })),
      },
    }),
    ...(expertiseIds?.length && {
      requiredExpertise: {
        create: expertiseIds.map((expertiseId) => ({
          expertise: { connect: { id: expertiseId } },
          isRequired: true,
        })),
      },
    }),
    budgetMin: data.budgetMin ? data.budgetMin : undefined,
    budgetMax: data.budgetMax ? data.budgetMax : undefined,
  };

  const mission = await createMission(missionData);

  // Update slug with real ID
  const finalSlug = generateMissionSlug(data.title, mission.id);
  return updateMission(mission.id, { slug: finalSlug });
}

export async function updateExistingMission(
  missionId: string,
  recruiterId: string,
  data: UpdateMissionDTO
) {
  const mission = await findMissionById(missionId);
  if (!mission) throw new MissionNotFoundError();
  if (mission.recruiter.id !== recruiterId) throw new MissionAuthorizationError();

  if (mission.status === "CLOSED" || mission.status === "ARCHIVED") {
    throw new MissionStateError("Cannot edit a closed or archived mission");
  }

  const { languageIds, expertiseIds, organizationId, ...rest } = data;

  const updateData: Prisma.MissionUpdateInput = {
    ...rest,
    ...(organizationId !== undefined && {
      organization: organizationId
        ? { connect: { id: organizationId } }
        : { disconnect: true },
    }),
    ...(languageIds && {
      languages: {
        deleteMany: {},
        create: languageIds.map((languageId) => ({
          language: { connect: { id: languageId } },
          isRequired: true,
        })),
      },
    }),
    ...(expertiseIds && {
      requiredExpertise: {
        deleteMany: {},
        create: expertiseIds.map((expertiseId) => ({
          expertise: { connect: { id: expertiseId } },
          isRequired: true,
        })),
      },
    }),
  };

  return updateMission(missionId, updateData);
}

export async function publishMission(missionId: string, recruiterId: string) {
  const mission = await findMissionById(missionId);
  if (!mission) throw new MissionNotFoundError();
  if (mission.recruiter.id !== recruiterId) throw new MissionAuthorizationError();

  if (mission.status !== "DRAFT") {
    throw new MissionStateError("Only draft missions can be published");
  }

  return updateMission(missionId, {
    status: "PUBLISHED",
    publishedAt: new Date(),
  });
}

export async function closeMission(missionId: string, recruiterId: string) {
  const mission = await findMissionById(missionId);
  if (!mission) throw new MissionNotFoundError();
  if (mission.recruiter.id !== recruiterId) throw new MissionAuthorizationError();

  if (mission.status !== "PUBLISHED") {
    throw new MissionStateError("Only published missions can be closed");
  }

  return updateMission(missionId, {
    status: "CLOSED",
    closedAt: new Date(),
  });
}

export async function archiveMission(missionId: string, recruiterId: string) {
  const mission = await findMissionById(missionId);
  if (!mission) throw new MissionNotFoundError();
  if (mission.recruiter.id !== recruiterId) throw new MissionAuthorizationError();

  return updateMission(missionId, { status: "ARCHIVED" });
}

export async function deleteDraftMission(missionId: string, recruiterId: string) {
  const mission = await findMissionById(missionId);
  if (!mission) throw new MissionNotFoundError();
  if (mission.recruiter.id !== recruiterId) throw new MissionAuthorizationError();

  if (mission.status !== "DRAFT") {
    throw new MissionStateError("Only draft missions can be deleted");
  }

  await deleteMission(missionId);
}
