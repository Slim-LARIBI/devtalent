"use server";

import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const applySchema = z.object({
  missionId: z.string().min(1),
  coverNote: z.string().min(10, "Please write a short cover note."),
  availability: z.string().min(2, "Please add your availability."),
  expectedRate: z.string().optional(),
});

type ApplyInput = z.infer<typeof applySchema>;

export async function submitApplicationAction(input: ApplyInput) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "EXPERT") {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = applySchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Invalid form data.",
    };
  }

  const expert = await prisma.expertProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!expert) {
    return { ok: false, error: "Expert profile not found." };
  }

  const cvDocument = await prisma.uploadedDocument.findFirst({
    where: {
      expertId: expert.id,
      type: "CV",
    },
    orderBy: [
      { isPrimary: "desc" },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      name: true,
    },
  });

  if (!cvDocument) {
    return {
      ok: false,
      error: "Please upload your CV before applying to a mission.",
    };
  }

  const mission = await prisma.mission.findFirst({
    where: {
      id: parsed.data.missionId,
      status: "PUBLISHED",
    },
    select: { id: true, title: true },
  });

  if (!mission) {
    return { ok: false, error: "Mission not found." };
  }

  const existingApplication = await prisma.application.findUnique({
    where: {
      expertId_missionId: {
        expertId: expert.id,
        missionId: mission.id,
      },
    },
    select: { id: true },
  });

  if (existingApplication) {
    return { ok: false, error: "You have already applied to this mission." };
  }

  const application = await prisma.application.create({
    data: {
      expertId: expert.id,
      missionId: mission.id,
      coverNote: parsed.data.coverNote,
      availability: parsed.data.availability,
      expectedRate: parsed.data.expectedRate
        ? Number(parsed.data.expectedRate)
        : null,
      status: "NEW",
    },
    select: {
      id: true,
    },
  });

  await prisma.applicationDocument.create({
    data: {
      applicationId: application.id,
      documentId: cvDocument.id,
    },
  });

  await prisma.invitation.updateMany({
    where: {
      expertId: expert.id,
      missionId: mission.id,
    },
    data: {
      status: "APPLIED",
      appliedAt: new Date(),
      lastActivityAt: new Date(),
    },
  });

  await sendEmail({
    to: session.user.email!,
    subject: "Application received ✅",
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>Application sent 🚀</h2>
        <p>You successfully applied for:</p>
        <p><strong>${mission.title}</strong></p>
        <p>Attached CV used: <strong>${cvDocument.name}</strong></p>
        <br/>
        <p>We will notify you when the recruiter updates your status.</p>
        <br/>
        <p style="color:gray;font-size:12px">
          DevTalent Team
        </p>
      </div>
    `,
  });

  revalidatePath("/expert/dashboard");
  revalidatePath("/missions");
  revalidatePath(`/missions/${mission.id}`);
  revalidatePath("/expert/applications");
  revalidatePath("/recruiter/dashboard");
  revalidatePath("/recruiter/applications");

  return { ok: true };
}