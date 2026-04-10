"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { z } from "zod";

const createMissionSchema = z.object({
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
  visibility: z.enum(["PRIVATE", "ORGANIZATION"]),
});

type CreateMissionInput = z.infer<typeof createMissionSchema>;

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function parseExpertiseInput(value?: string) {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function createMissionAction(input: CreateMissionInput) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = createMissionSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: "Please fill all required fields correctly." };
  }

  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      organizationId: true,
    },
  });

  if (!recruiter) {
    return { ok: false, error: "Recruiter profile not found." };
  }

  const data = parsed.data;

  if (data.visibility === "ORGANIZATION" && !recruiter.organizationId) {
    return {
      ok: false,
      error: "You must belong to an organization before sharing missions with your team.",
    };
  }

  const baseSlug = slugify(data.title, { lower: true, strict: true });
  const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-6)}`;

  try {
    const mission = await prisma.$transaction(async (tx) => {
      const createdMission = await tx.mission.create({
        data: {
          slug: uniqueSlug,
          title: data.title,
          description: data.shortDescription
            ? `${data.shortDescription}\n\n${data.description}`
            : data.description,
          organizationId: recruiter.organizationId ?? null,
          recruiterId: recruiter.id,
          sector: data.sector,
          country: data.country || null,
          region: data.cityRegion || null,
          workMode: data.workMode,
          contractType: data.contractType,
          missionType: data.missionType,
          visibility: data.visibility,
          duration: data.duration || null,
          seniorityRequired: data.seniorityRequired,
          donorFunder: data.donorFunder || null,
          deadline: data.deadline ? new Date(data.deadline) : null,
          startDate: data.startDate ? new Date(data.startDate) : null,
          budgetMin: data.budgetMin ? Number(data.budgetMin) : null,
          budgetMax: data.budgetMax ? Number(data.budgetMax) : null,
          budgetCurrency: data.budgetCurrency || "EUR",
          status: data.publishNow ? "PUBLISHED" : "DRAFT",
          publishedAt: data.publishNow ? new Date() : null,
        },
      });

      const expertiseNames = parseExpertiseInput(data.requiredExpertise);

      if (expertiseNames.length > 0) {
        const allExpertise = await tx.expertise.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
          },
        });

        const matchedExpertise = allExpertise.filter((item) => {
          const itemName = normalizeText(item.name);
          const itemSlug = normalizeText(item.slug);

          return expertiseNames.some((inputName) => {
            const normalizedInput = normalizeText(inputName);

            return (
              itemName === normalizedInput ||
              itemSlug === normalizedInput ||
              itemName.includes(normalizedInput) ||
              normalizedInput.includes(itemName)
            );
          });
        });

        if (matchedExpertise.length > 0) {
          await tx.missionToExpertise.createMany({
            data: matchedExpertise.map((item) => ({
              missionId: createdMission.id,
              expertiseId: item.id,
              isRequired: true,
            })),
            skipDuplicates: true,
          });
        }
      }

      if (data.requiredLanguages && data.requiredLanguages.length > 0) {
        const allLanguages = await tx.language.findMany({
          select: {
            id: true,
            name: true,
            code: true,
          },
        });

        const matchedLanguages = allLanguages.filter((item) => {
          const itemName = normalizeText(item.name);
          const itemCode = normalizeText(item.code);

          return data.requiredLanguages.some((inputLang) => {
            const normalizedInput = normalizeText(inputLang);

            return (
              itemName === normalizedInput ||
              itemCode === normalizedInput ||
              itemName.includes(normalizedInput) ||
              normalizedInput.includes(itemName)
            );
          });
        });

        if (matchedLanguages.length > 0) {
          await tx.missionLanguage.createMany({
            data: matchedLanguages.map((item) => ({
              missionId: createdMission.id,
              languageId: item.id,
              isRequired: true,
            })),
            skipDuplicates: true,
          });
        }
      }

      return createdMission;
    });

    revalidatePath("/recruiter/dashboard");
    revalidatePath("/recruiter/missions");
    revalidatePath("/recruiter/missions/new");
    revalidatePath(`/recruiter/missions/${mission.id}`);
    revalidatePath(`/recruiter/experts?missionId=${mission.id}`);

    return { ok: true, missionId: mission.id, slug: mission.slug };
  } catch (error) {
    console.error("CREATE_MISSION_ERROR", error);
    return { ok: false, error: "Unable to create mission." };
  }
}