import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { token: string };
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const invitation = await prisma.organizationInvitation.findUnique({
    where: { token: params.token },
    include: {
      organization: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!invitation || invitation.status !== "PENDING") {
    return <div className="p-10">Invalid or expired invitation.</div>;
  }

  if (new Date() > invitation.expiresAt) {
    return <div className="p-10">Invitation expired.</div>;
  }

  const sessionEmail = session.user.email?.trim().toLowerCase();
  const invitedEmail = invitation.email.trim().toLowerCase();

  if (!sessionEmail || sessionEmail !== invitedEmail) {
    return (
      <div className="p-10">
        This invitation was sent to <strong>{invitation.email}</strong>. Please sign in with that email address to join{" "}
        <strong>{invitation.organization.name}</strong>.
      </div>
    );
  }

  const recruiterProfile = await prisma.recruiterProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      organizationId: true,
    },
  });

  if (!recruiterProfile) {
    return <div className="p-10">Recruiter profile not found.</div>;
  }

  if (
    recruiterProfile.organizationId &&
    recruiterProfile.organizationId === invitation.organizationId
  ) {
    await prisma.organizationInvitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED" },
    });

    redirect("/recruiter/organization");
  }

  await prisma.recruiterProfile.update({
    where: { userId: session.user.id },
    data: {
      organizationId: invitation.organizationId,
      organizationRole: invitation.role,
    },
  });

  await prisma.organizationInvitation.update({
    where: { id: invitation.id },
    data: { status: "ACCEPTED" },
  });

  redirect("/recruiter/dashboard");
}