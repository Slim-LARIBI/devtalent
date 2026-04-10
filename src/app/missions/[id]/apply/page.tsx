import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ApplyForm } from "@/components/expert/apply-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ApplyMissionPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "EXPERT") {
    redirect("/login");
  }

  const { id } = await params;

  const mission = await prisma.mission.findFirst({
    where: {
      id,
      status: "PUBLISHED",
    },
    include: {
      organization: true,
    },
  });

  if (!mission) {
    notFound();
  }

  const expert = await prisma.expertProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!expert) {
    redirect("/expert/my-profile");
  }

  const hasCv = await prisma.uploadedDocument.findFirst({
    where: {
      expertId: expert.id,
      type: "CV",
    },
    select: { id: true, name: true },
  });

  return (
    <ApplyForm
      missionId={mission.id}
      missionTitle={mission.title}
      organizationName={mission.organization?.name || "the organization"}
      hasCv={Boolean(hasCv)}
      cvName={hasCv?.name || null}
    />
  );
}