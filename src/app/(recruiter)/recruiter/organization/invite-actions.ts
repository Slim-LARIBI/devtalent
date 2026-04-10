"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function createInvitationAction(email: string) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    return { ok: false, error: "Unauthorized" };
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      organizationId: true,
      organizationRole: true,
    },
  });

  if (!recruiter?.organizationId) {
    return { ok: false, error: "No organization found." };
  }

  if (recruiter.organizationRole !== "OWNER") {
    return { ok: false, error: "Only organization owners can invite recruiters." };
  }

  const existingRecruiterUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      recruiterProfile: {
        select: {
          organizationId: true,
        },
      },
    },
  });

  if (existingRecruiterUser?.recruiterProfile?.organizationId === recruiter.organizationId) {
    return { ok: false, error: "This recruiter is already part of your organization." };
  }

  const existingPendingInvitation = await prisma.organizationInvitation.findFirst({
    where: {
      email: normalizedEmail,
      organizationId: recruiter.organizationId,
      status: "PENDING",
    },
    select: {
      id: true,
      token: true,
      expiresAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const now = new Date();

  if (existingPendingInvitation && existingPendingInvitation.expiresAt > now) {
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    return {
      ok: true,
      inviteLink: `${baseUrl}/join-organization/${existingPendingInvitation.token}`,
    };
  }

  const token = randomBytes(32).toString("hex");

  const invitation = await prisma.organizationInvitation.create({
    data: {
      email: normalizedEmail,
      organizationId: recruiter.organizationId,
      role: "MEMBER",
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  return {
    ok: true,
    inviteLink: `${baseUrl}/join-organization/${invitation.token}`,
  };
}