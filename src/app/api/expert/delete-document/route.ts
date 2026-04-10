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
    const documentId = body.documentId as string | undefined;

    if (!documentId) {
      return new NextResponse("Missing documentId", { status: 400 });
    }

    const expert = await prisma.expertProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!expert) {
      return new NextResponse("Expert not found", { status: 404 });
    }

    const document = await prisma.uploadedDocument.findFirst({
      where: {
        id: documentId,
        expertId: expert.id,
      },
      select: {
        id: true,
      },
    });

    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    await prisma.uploadedDocument.delete({
      where: { id: document.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE_DOCUMENT_ERROR:", error);
    return new NextResponse("Failed to delete document.", { status: 500 });
  }
}