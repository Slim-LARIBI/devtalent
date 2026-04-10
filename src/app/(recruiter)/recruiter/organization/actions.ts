"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  type: z.string().min(2),
  country: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export async function updateOrganizationAction(input: {
  name: string;
  type: string;
  country?: string;
  logoUrl?: string;
}) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: "Invalid data" };
  }

  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      organizationId: true,
      organizationRole: true,
    },
  });

  if (!recruiter?.organizationId) {
    return { ok: false, error: "No organization found" };
  }

  if (recruiter.organizationRole !== "OWNER") {
    return { ok: false, error: "Only organization owners can update company settings." };
  }

  await prisma.organization.update({
    where: { id: recruiter.organizationId },
    data: {
      name: parsed.data.name,
      type: parsed.data.type as any,
      country: parsed.data.country || null,
      logoUrl: parsed.data.logoUrl || null,
    },
  });

  revalidatePath("/recruiter/organization");

  return { ok: true };
}