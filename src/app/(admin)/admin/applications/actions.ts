"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ApplicationStatus } from "@prisma/client";

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
  await prisma.application.update({
    where: { id: applicationId },
    data: {
      status,
      ...(status === "SHORTLISTED" && { shortlistedAt: new Date() }),
      ...(status === "HIRED" && { closedAt: new Date() }),
    },
  });

  revalidatePath("/admin/applications");
}