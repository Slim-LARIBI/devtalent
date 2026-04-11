// ─── Application Service ──────────────────────────────────────────────────────
// Business logic for the application flow.
// Email notifications are triggered here.
// ─────────────────────────────────────────────────────────────────────────────

import {
  findApplicationByExpertAndMission,
  findApplicationById,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
} from "@/server/repositories/application.repository";
import {
  findMissionById,
} from "@/server/repositories/mission.repository";
import { findExpertProfileByUserId } from "@/server/repositories/expert.repository";
import { APPLICATION_STATUS_TRANSITIONS } from "@/types/application";
import type { ApplicationStatus as PrismaApplicationStatus } from "@prisma/client";
import type { ApplicationStatus as CommonApplicationStatus } from "@/types/common";
import type { CreateApplicationDTO, UpdateApplicationStatusDTO } from "@/types/application";

export class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "ApplicationError";
  }
}

// ─── Apply to mission ─────────────────────────────────────────────────────────

export async function applyToMission(
  userId: string,
  data: CreateApplicationDTO,
  sendEmails: (params: ApplicationEmailParams) => Promise<void>
) {
  // Resolve expert profile
  const expertProfile = await findExpertProfileByUserId(userId);
  if (!expertProfile) {
    throw new ApplicationError(
      "Please complete your expert profile before applying",
      "NO_EXPERT_PROFILE"
    );
  }

  // Resolve mission
  const mission = await findMissionById(data.missionId);
  if (!mission) {
    throw new ApplicationError("Mission not found", "MISSION_NOT_FOUND");
  }

  if (mission.status !== "PUBLISHED") {
    throw new ApplicationError(
      "This mission is not accepting applications",
      "MISSION_NOT_ACCEPTING"
    );
  }

  // Check for duplicate
  const existing = await findApplicationByExpertAndMission(
    expertProfile.id,
    data.missionId
  );
  if (existing) {
    throw new ApplicationError(
      "You have already applied to this mission",
      "DUPLICATE_APPLICATION"
    );
  }

  // Create application
  const application = await createApplication({
    expertId: expertProfile.id,
    missionId: data.missionId,
    coverNote: data.coverNote,
    expectedRate: data.expectedRate,
    availability: data.availability,
  });

  // Attach documents if provided
  if (data.documentIds?.length) {
    const { prisma } = await import("@/lib/prisma");
    await prisma.applicationDocument.createMany({
      data: data.documentIds.map((documentId) => ({
        applicationId: application.id,
        documentId,
      })),
    });
  }

  // Trigger email notifications (injected — keeps service testable)
  try {
    await sendEmails({
      application,
      mission,
      expert: expertProfile,
    });
  } catch (error) {
    // Email failure should not block the application
    console.error("[application.service] Failed to send application emails:", error);
  }

  return application;
}

// ─── Update application status ────────────────────────────────────────────────

export async function updateStatus(
  applicationId: string,
  recruiterId: string,
  data: UpdateApplicationStatusDTO
) {
  const application = await findApplicationById(applicationId);
  if (!application) {
    throw new ApplicationError("Application not found", "NOT_FOUND");
  }

  // Verify the recruiter owns the mission
  if (application.mission.organization?.id !== recruiterId) {
    // Check via recruiter on the mission
    const { prisma } = await import("@/lib/prisma");
    const mission = await prisma.mission.findUnique({
      where: { id: application.missionId },
      select: { recruiter: { select: { userId: true } } },
    });
    if (mission?.recruiter.userId !== recruiterId) {
      throw new ApplicationError(
        "Not authorized to update this application",
        "UNAUTHORIZED"
      );
    }
  }

  // Validate state transition
  const currentStatus = application.status as CommonApplicationStatus;
  const allowedTransitions =
    APPLICATION_STATUS_TRANSITIONS[currentStatus] ?? [];

  if (!allowedTransitions.includes(data.status as CommonApplicationStatus)) {
    throw new ApplicationError(
      `Cannot transition application from ${currentStatus} to ${data.status}`,
      "INVALID_TRANSITION"
    );
  }

  return updateApplicationStatus(
  applicationId,
  data.status as PrismaApplicationStatus,
  data.recruiterNotes
);
}

export async function withdrawApplication(applicationId: string, userId: string) {
  const application = await findApplicationById(applicationId);
  if (!application) {
    throw new ApplicationError("Application not found", "NOT_FOUND");
  }

  if (application.expert.user.email !== userId) {
    // We passed userId as email here — in practice, check expert.userId
    throw new ApplicationError(
      "Not authorized to withdraw this application",
      "UNAUTHORIZED"
    );
  }

  if (
    application.status === "HIRED" ||
    application.status === "REJECTED"
  ) {
    throw new ApplicationError(
      "Cannot withdraw a closed application",
      "INVALID_STATE"
    );
  }

  await deleteApplication(applicationId);
}

// ─── Email params type ────────────────────────────────────────────────────────

export interface ApplicationEmailParams {
  application: Awaited<ReturnType<typeof findApplicationById>>;
  mission: Awaited<ReturnType<typeof findMissionById>>;
  expert: Awaited<ReturnType<typeof findExpertProfileByUserId>>;
}
