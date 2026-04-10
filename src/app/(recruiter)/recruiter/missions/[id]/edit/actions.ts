"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateMissionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  shortDescription: z.string().optional(),
  description: z.string().min(10),
  sector: z.string().min(1),
  donorFunder: z.string().optional(),
  country: z.string().optional(),
  cityRegion: z.string().optional(),
  workMode: z.enum(["REMOTE", "ON_SITE", "HYBRID"]),
  missionType: z.enum(["SHORT_TERM", "LONG_TERM"]),
  contractType: z.enum(["CONSULTANT", "EMPLOYEE", "FREELANCE", "FIXED_TERM"]),
  seniorityRequired: z.enum(["JUNIOR", "MID", "SENIOR", "PRINCIPAL", "DIRECTOR"]),
  yearsOfExperience: z.string().optional(),
  duration: z.string().optional(),
  startDate: z.string().optional(),
  deadline: z.string().optional(),
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
  budgetCurrency: z.string().optional(),
  requiredExpertise: z.string().optional(),
  requiredLanguages: z.array(z.string()).optional(),
  donorExperienceRequired: z.string().optional(),
  cvRequired: z.boolean().optional(),
  coverLetterRequired: z.boolean().optional(),
  publishNow: z.boolean(),
});

type UpdateMissionInput = z.infer<typeof updateMissionSchema>;

export async function updateMissionAction(input: UpdateMissionInput) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = updateMissionSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: "Please fill all required fields correctly." };
  }

  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!recruiter) {
    return { ok: false, error: "Recruiter profile not found." };
  }

  const data = parsed.data;

  const existingMission = await prisma.mission.findFirst({
    where: {
      id: data.id,
      recruiterId: recruiter.id,
    },
    select: { id: true },
  });

  if (!existingMission) {
    return { ok: false, error: "Mission not found." };
  }

  await prisma.mission.update({
    where: { id: data.id },
    data: {
      title: data.title,
      description: data.shortDescription
        ? `${data.shortDescription}\n\n${data.description}`
        : data.description,
      sector: data.sector,
      donorFunder: data.donorFunder || null,
      country: data.country || null,
      region: data.cityRegion || null,
      workMode: data.workMode,
      missionType: data.missionType,
      contractType: data.contractType,
      seniorityRequired: data.seniorityRequired,
      duration: data.duration || null,
      startDate: data.startDate ? new Date(data.startDate) : null,
      deadline: data.deadline ? new Date(data.deadline) : null,
      budgetMin: data.budgetMin ? Number(data.budgetMin) : null,
      budgetMax: data.budgetMax ? Number(data.budgetMax) : null,
      budgetCurrency: data.budgetCurrency || "EUR",
      status: data.publishNow ? "PUBLISHED" : "DRAFT",
      publishedAt: data.publishNow ? new Date() : null,
    },
  });

  revalidatePath("/recruiter/dashboard");
  revalidatePath("/recruiter/missions");
  revalidatePath(`/recruiter/missions/${data.id}`);
  revalidatePath(`/recruiter/missions/${data.id}/edit`);

  return { ok: true };
}