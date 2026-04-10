import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import OrganizationPageClient from "./OrganizationPageClient";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    redirect("/login");
  }

  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      organization: {
        include: {
          recruiters: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  });

  if (!recruiter?.organization) {
    redirect("/recruiter/dashboard");
  }

  return (
    <OrganizationPageClient
      organization={recruiter.organization}
      currentRecruiterRole={recruiter.organizationRole}
    />
  );
}