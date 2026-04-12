"use server";

import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function updateUserRoleAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const userId = String(formData.get("userId") || "");
  const role = String(formData.get("role") || "") as UserRole;

  if (!userId) {
    throw new Error("Missing userId");
  }

  if (!["ADMIN", "RECRUITER", "EXPERT"].includes(role)) {
    throw new Error("Invalid role");
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });

  if (!targetUser) {
    throw new Error("User not found");
  }

  // Avoid removing admin rights from yourself by mistake
  if (targetUser.id === session.user.id && role !== "ADMIN") {
    throw new Error("You cannot remove your own admin role.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin/dashboard");
}