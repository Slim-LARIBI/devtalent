import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteProps = {
  params: Promise<{ id: string }>;
};

const PIXEL_BASE64 =
  "R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

export async function GET(_: Request, { params }: RouteProps) {
  const { id } = await params;
  const now = new Date();

  const invitation = await prisma.invitation.findUnique({
    where: { id },
    select: {
      id: true,
      openCount: true,
      firstOpenedAt: true,
      clickCount: true,
      appliedAt: true,
    },
  });

  if (invitation) {
    await prisma.invitation.update({
      where: { id },
      data: {
        status: invitation.appliedAt
          ? "APPLIED"
          : invitation.clickCount > 0
          ? "CLICKED"
          : "OPENED",
        openCount: { increment: 1 },
        firstOpenedAt: invitation.firstOpenedAt ?? now,
        lastOpenedAt: now,
        lastActivityAt: now,
      },
    });
  }

  const buffer = Buffer.from(PIXEL_BASE64, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/gif",
      "Content-Length": String(buffer.length),
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}