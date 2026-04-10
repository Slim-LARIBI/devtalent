import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { MissionForm } from "@/components/recruiter/mission-form";
import { updateMissionAction } from "./actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

function splitDescription(description: string | null) {
  if (!description) {
    return { shortDescription: "", fullDescription: "" };
  }

  const parts = description.split("\n\n");
  if (parts.length === 1) {
    return { shortDescription: "", fullDescription: description };
  }

  return {
    shortDescription: parts[0] || "",
    fullDescription: parts.slice(1).join("\n\n") || "",
  };
}

function formatDateInput(value: Date | null) {
  if (!value) return "";
  return new Date(value).toISOString().split("T")[0];
}

export default async function EditMissionPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    redirect("/login");
  }

  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!recruiter) {
    redirect("/recruiter/dashboard");
  }

  const { id } = await params;

  const mission = await prisma.mission.findFirst({
    where: {
      id,
      recruiterId: recruiter.id,
    },
  });

  if (!mission) {
    notFound();
  }

  const { shortDescription, fullDescription } = splitDescription(mission.description);

  return (
    <MissionForm
      mode="edit"
      onSubmitAction={updateMissionAction}
      initialValues={{
        id: mission.id,
        title: mission.title,
        shortDescription,
        description: fullDescription,
        sector: mission.sector || "",
        donorFunder: mission.donorFunder || "",
        country: mission.country || "",
        cityRegion: mission.region || "",
        workMode: mission.workMode,
        missionType: mission.missionType,
        contractType: mission.contractType,
        seniorityRequired: mission.seniorityRequired || "SENIOR",
        yearsOfExperience: "",
        duration: mission.duration || "",
        startDate: formatDateInput(mission.startDate),
        deadline: formatDateInput(mission.deadline),
        budgetMin: mission.budgetMin ? String(mission.budgetMin) : "",
        budgetMax: mission.budgetMax ? String(mission.budgetMax) : "",
        budgetCurrency: mission.budgetCurrency || "EUR",
        requiredExpertise: "",
        requiredLanguages: [],
        donorExperienceRequired: "",
        cvRequired: true,
        coverLetterRequired: false,
        publishNow: mission.status === "PUBLISHED",
      }}
    />
  );
}