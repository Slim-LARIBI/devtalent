"use server";

import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { inviteExpertEmail } from "@/emails/invite-expert";
import { z } from "zod";

const inviteExpertsSchema = z.object({
  expertIds: z.array(z.string()).min(1, "Select at least one expert."),
  missionId: z.string().min(1, "Mission is required."),
});

type InviteExpertsInput = z.infer<typeof inviteExpertsSchema>;

function getBaseUrl() {
  return (
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  );
}

export async function inviteExpertsAction(input: InviteExpertsInput) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = inviteExpertsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Invalid request.",
    };
  }

  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      organization: {
        select: {
          name: true,
        },
      },
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
      title: true,
      country: true,
      sector: true,
      visibility: true,
    },
  });

  if (!mission) {
    return { ok: false, error: "Mission not found or access denied." };
  }

  const experts = await prisma.expertProfile.findMany({
    where: {
      id: { in: parsed.data.expertIds },
      isPublic: true,
      user: {
        isActive: true,
      },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (experts.length === 0) {
    return { ok: false, error: "No valid experts found." };
  }

  const baseUrl = getBaseUrl();

  let sentCount = 0;
  let skippedCount = 0;

  for (const expert of experts) {
    if (!expert.user.email) {
      skippedCount += 1;
      continue;
    }

    const existingInvitation = await prisma.invitation.findUnique({
      where: {
        missionId_expertId: {
          missionId: mission.id,
          expertId: expert.id,
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (existingInvitation) {
      skippedCount += 1;
      continue;
    }

    const invitation = await prisma.invitation.create({
      data: {
        missionId: mission.id,
        expertId: expert.id,
        recruiterId: recruiter.id,
        expertEmail: expert.user.email,
        status: "SENT",
        sentAt: new Date(),
        lastActivityAt: new Date(),
      },
      select: {
        id: true,
      },
    });

    const destinationMissionUrl = `${baseUrl}/missions/${mission.id}`;
    const missionLink = `${baseUrl}/api/invitations/${invitation.id}/click?url=${encodeURIComponent(
      destinationMissionUrl
    )}`;
    const openPixelUrl = `${baseUrl}/api/invitations/${invitation.id}/open`;

    await sendEmail({
      to: expert.user.email,
      subject: `New mission invitation: ${mission.title}`,
      html: inviteExpertEmail({
        expertName: expert.user.name || "Expert",
        missionTitle: mission.title,
        organizationName: recruiter.organization?.name || "DevTalent",
        missionLink,
      }).replace(
        "</body>",
        `<img src="${openPixelUrl}" alt="" width="1" height="1" style="display:none;" /></body>`
      ),
    });

    sentCount += 1;
  }

  if (sentCount === 0 && skippedCount > 0) {
    return {
      ok: false,
      error: "All selected experts were already invited or unavailable.",
      sentCount,
      skippedCount,
    };
  }

  return {
    ok: true,
    sentCount,
    skippedCount,
    message:
      skippedCount > 0
        ? `${sentCount} invitation(s) sent, ${skippedCount} skipped.`
        : `${sentCount} invitation(s) sent successfully.`,
  };
}