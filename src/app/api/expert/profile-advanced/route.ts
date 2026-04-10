import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "EXPERT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const expertiseIds = Array.isArray(body.expertiseIds) ? body.expertiseIds : [];
    const languageIds = Array.isArray(body.languageIds) ? body.languageIds : [];

    const expert = await prisma.expertProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!expert) {
      return new NextResponse("Expert not found", { status: 404 });
    }

    await prisma.$transaction([
      prisma.expertToExpertise.deleteMany({
        where: { expertId: expert.id },
      }),
      prisma.expertLanguage.deleteMany({
        where: { expertId: expert.id },
      }),
      prisma.expertToExpertise.createMany({
        data: expertiseIds.map((expertiseId: string) => ({
          expertId: expert.id,
          expertiseId,
          level: "Expert",
        })),
        skipDuplicates: true,
      }),
      prisma.expertLanguage.createMany({
        data: languageIds.map((languageId: string) => ({
          expertId: expert.id,
          languageId,
          proficiency: "Professional Working Proficiency",
        })),
        skipDuplicates: true,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("EXPERT_PROFILE_ADVANCED_ERROR:", error);
    return new NextResponse("Failed to update expertise and languages.", {
      status: 500,
    });
  }
}