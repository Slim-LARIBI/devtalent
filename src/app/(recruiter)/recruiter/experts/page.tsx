import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  FindExpertsClient,
  type RecruiterExpertItem,
} from "@/components/recruiter/find-experts-client";
import { computeMatchWithDetails } from "@/lib/matching";

type PageProps = {
  searchParams: Promise<{
    missionId?: string;
  }>;
};

export default async function RecruiterExpertsPage({ searchParams }: PageProps) {
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

  const params = await searchParams;
  const missionId = params.missionId;

  const mission = missionId
    ? await prisma.mission.findFirst({
        where: {
          id: missionId,
          recruiterId: recruiter.id,
        },
        include: {
          requiredExpertise: {
            include: {
              expertise: {
                select: {
                  name: true,
                },
              },
            },
          },
          languages: {
            include: {
              language: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })
    : null;

  const experts = await prisma.expertProfile.findMany({
    where: {
      isPublic: true,
      user: {
        isActive: true,
      },
    },
    orderBy: [{ updatedAt: "desc" }],
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      languages: {
        include: {
          language: {
            select: {
              name: true,
            },
          },
        },
      },
      expertise: {
        include: {
          expertise: {
            select: {
              name: true,
            },
          },
        },
      },
      donorExperiences: true,
    },
  });

  const normalizedExperts: RecruiterExpertItem[] = experts
    .map((expert) => {
      const expertExpertise = expert.expertise.map((item) => item.expertise.name);
      const expertLanguages = expert.languages.map((item) => item.language.name);
      const expertDonors = expert.donorExperiences.map((item) => item.donor);

      const matchResult = mission
        ? computeMatchWithDetails({
            expert: {
              expertise: expertExpertise,
              donorExperience: expertDonors,
              languages: expertLanguages,
              level: expert.level || "MID",
              location: expert.location || "",
            },
            mission: {
              expertise: mission.requiredExpertise.map((item) => item.expertise.name),
              donor: mission.donorFunder,
              languages: mission.languages.map((item) => item.language.name),
              seniority: mission.seniorityRequired,
              country: mission.country,
            },
          })
        : {
            score: expert.profileScore || 0,
            reasons: [],
          };

      return {
        id: expert.id,
        name: expert.user.name || "Unnamed expert",
        email: expert.user.email,
        title: expert.title || "No title",
        location: expert.location || "Location not specified",
        level: expert.level || "MID",
        availability: expert.availability || "Availability not specified",
        profileScore: matchResult.score,
        reasons: matchResult.reasons,
        yearsOfExperience: expert.yearsOfExperience,
        isPublic: expert.isPublic,
        languages: expertLanguages,
        expertise: expertExpertise,
        donorExperience: expertDonors,
      };
    })
    .sort((a, b) => b.profileScore - a.profileScore);

  return <FindExpertsClient experts={normalizedExperts} missionId={missionId} />;
}