import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organizations = await prisma.organization.findMany({
    include: {
      recruiters: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  console.log(`Found ${organizations.length} organization(s).`);

  for (const organization of organizations) {
    if (organization.recruiters.length === 0) continue;

    const [firstRecruiter, ...otherRecruiters] = organization.recruiters;

    await prisma.recruiterProfile.update({
      where: { id: firstRecruiter.id },
      data: {
        organizationRole: "OWNER",
      },
    });

    if (otherRecruiters.length > 0) {
      await prisma.recruiterProfile.updateMany({
        where: {
          id: {
            in: otherRecruiters.map((r) => r.id),
          },
        },
        data: {
          organizationRole: "MEMBER",
        },
      });
    }

    console.log(
      `Organization "${organization.name}" => OWNER: ${firstRecruiter.id}, MEMBERS: ${otherRecruiters.length}`
    );
  }

  console.log("Organization roles backfill complete ✅");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("BACKFILL_ORGANIZATION_ROLES_ERROR:", error);
    await prisma.$disconnect();
    process.exit(1);
  });