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

    if (!body.url) {
      return new NextResponse("Missing file url", { status: 400 });
    }

    // ✅ Replace old CV automatically:
    // remove previous CV records for this expert before saving the new one
    await prisma.uploadedDocument.deleteMany({
      where: {
        expertId: expert.id,
        type: "CV",
      },
    });

    await prisma.uploadedDocument.create({
      data: {
        expertId: expert.id,
        type: "CV",
        name: body.name || "CV",
        url: body.url,
        key: body.key || body.url,
        size: body.size || null,
        mimeType: body.mimeType || null,
        isPrimary: true,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("UPLOAD_CV_SAVE_ERROR:", error);
    return new NextResponse("Failed to save document.", { status: 500 });
  }
}