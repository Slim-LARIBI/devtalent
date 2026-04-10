"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addMissionInternalNoteSchema = z.object({
  missionId: z.string().min(1),
  content: z.string().min(3, "Please write a more useful internal note.").max(2000),
});

type AddMissionInternalNoteInput = z.infer<typeof addMissionInternalNoteSchema>;

export async function addMissionInternalNoteAction(input: AddMissionInternalNoteInput) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = addMissionInternalNoteSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Invalid note.",
    };
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

  const mission = await prisma.mission.findFirst({
    where: {
      id: parsed.data.missionId,
      OR: [
        {
          recruiterId: recruiter.id,
        },
        {
          organizationId: recruiter.organizationId,
          visibility: "ORGANIZATION",
        },
      ],
    },
    select: {
      id: true,
    },
  });

  if (!mission) {
    return { ok: false, error: "Mission not found or access denied." };
  }

  await prisma.missionInternalNote.create({
    data: {
      missionId: mission.id,
      recruiterId: recruiter.id,
      content: parsed.data.content.trim(),
    },
  });

  revalidatePath(`/recruiter/missions/${mission.id}`);
  revalidatePath("/recruiter/missions");

  return { ok: true };
}