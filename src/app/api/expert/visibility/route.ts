import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "EXPERT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const isPublic = Boolean(body.isPublic);

    const expert = await prisma.expertProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!expert) {
      return new NextResponse("Expert not found", { status: 404 });
    }

    let slug = expert.slug;

    if (!slug) {
      const base = slugify(
        expert.user.name || expert.title || `expert-${expert.id.slice(-6)}`,
        { lower: true, strict: true }
      );

      slug = `${base || "expert"}-${expert.id.slice(-6)}`;
    }

    await prisma.expertProfile.update({
      where: { id: expert.id },
      data: {
        isPublic,
        slug,
      },
    });

    return NextResponse.json({
      ok: true,
      slug,
      isPublic,
      publicUrl: `/experts/${slug}`,
    });
  } catch (error) {
    console.error("EXPERT_VISIBILITY_ERROR:", error);
    return new NextResponse("Failed to update visibility.", { status: 500 });
  }
}