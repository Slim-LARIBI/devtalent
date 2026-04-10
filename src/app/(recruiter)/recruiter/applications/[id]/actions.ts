"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateApplicationStatusSchema = z.object({
  applicationId: z.string().min(1),
  status: z.enum(["NEW", "REVIEWED", "SHORTLISTED", "REJECTED", "HIRED"]),
});

type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;

export async function updateApplicationStatusAction(
  input: UpdateApplicationStatusInput
) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = updateApplicationStatusSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: "Invalid status update." };
  }

  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!recruiter) {
    return { ok: false, error: "Recruiter profile not found." };
  }

  const application = await prisma.application.findFirst({
    where: {
      id: parsed.data.applicationId,
      mission: {
        recruiterId: recruiter.id,
      },
    },
    include: {
      expert: {
        select: {
          userId: true,
        },
      },
      mission: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!application) {
    return { ok: false, error: "Application not found." };
  }

  const now = new Date();

  const existing = await prisma.application.findUnique({
    where: { id: application.id },
    select: {
      reviewedAt: true,
    },
  });

  await prisma.application.update({
    where: { id: application.id },
    data: {
      status: parsed.data.status,
      reviewedAt:
        parsed.data.status === "REVIEWED" ||
        parsed.data.status === "SHORTLISTED" ||
        parsed.data.status === "REJECTED" ||
        parsed.data.status === "HIRED"
          ? existing?.reviewedAt || now
          : null,
      shortlistedAt: parsed.data.status === "SHORTLISTED" ? now : null,
      closedAt:
        parsed.data.status === "REJECTED" || parsed.data.status === "HIRED"
          ? now
          : null,
    },
  });

  const notificationTitleMap: Record<string, string> = {
    NEW: "Application updated",
    REVIEWED: "Your application was reviewed",
    SHORTLISTED: "You were shortlisted",
    REJECTED: "Application update",
    HIRED: "Congratulations, you were selected",
  };

  const notificationMessageMap: Record<string, string> = {
    NEW: `Your application for ${application.mission.title} is now marked as new.`,
    REVIEWED: `A recruiter reviewed your application for ${application.mission.title}.`,
    SHORTLISTED: `You have been shortlisted for ${application.mission.title}.`,
    REJECTED: `Your application for ${application.mission.title} was not selected.`,
    HIRED: `You have been selected for ${application.mission.title}.`,
  };

  await prisma.notification.create({
    data: {
      userId: application.expert.userId,
      type: "APPLICATION_STATUS_CHANGED",
      title: notificationTitleMap[parsed.data.status],
      message: notificationMessageMap[parsed.data.status],
      link: "/expert/applications",
      metadata: {
        applicationId: application.id,
        missionId: application.mission.id,
        status: parsed.data.status,
      },
    },
  });

  revalidatePath("/recruiter/dashboard");
  revalidatePath("/recruiter/applications");
  revalidatePath(`/recruiter/applications/${application.id}`);
  revalidatePath(`/recruiter/missions/${application.mission.id}`);
  revalidatePath("/expert/dashboard");
  revalidatePath("/expert/applications");

  return { ok: true };
}