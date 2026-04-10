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

    const expert = await prisma.expertProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!expert) {
      return new NextResponse("Expert not found", { status: 404 });
    }

    await prisma.expertProfile.update({
      where: { id: expert.id },
      data: {
        title: body.title || null,
        bio: body.bio || null,
        location: body.location || null,
        level: body.level || null,
        yearsOfExperience: body.yearsOfExperience
          ? Number(body.yearsOfExperience)
          : null,
        availability: body.availability || null,
        linkedinUrl: body.linkedinUrl || null,
        portfolioUrl: body.portfolioUrl || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("EXPERT_PROFILE_UPDATE_ERROR:", error);
    return new NextResponse("Failed to update profile.", { status: 500 });
  }
}