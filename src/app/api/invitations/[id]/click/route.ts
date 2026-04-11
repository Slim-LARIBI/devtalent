import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteProps) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url") || "http://localhost:3000/missions";
  const now = new Date();

  const invitation = await prisma.invitation.findUnique({
    where: { id },
    select: {
      id: true,
      clickCount: true,
      firstClickedAt: true,
      appliedAt: true,
    },
  });

  if (invitation) {
    await prisma.invitation.update({
      where: { id },
      data: {
        status: invitation.appliedAt ? "APPLIED" : "CLICKED",
        clickCount: { increment: 1 },
        firstClickedAt: invitation.firstClickedAt ?? now,
        lastClickedAt: now,
        lastActivityAt: now,
      },
    });
  }

  return NextResponse.redirect(targetUrl);
}
