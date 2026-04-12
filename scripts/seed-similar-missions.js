const {
  PrismaClient,
  WorkMode,
  ContractType,
  MissionType,
  MissionStatus,
  MissionVisibility,
} = require("@prisma/client");

const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function main() {
  const companies = [
    {
      orgName: "CCM Consulting Group",
      orgType: "CONSULTING_FIRM",
      recruiterName: "Aline Moreau",
      recruiterEmail: "aline.moreau+ccm@devtalent.io",
      slugSuffix: "ccm",
    },
    {
      orgName: "WorldBridge Advisory",
      orgType: "CONSULTING_FIRM",
      recruiterName: "Samuel Otieno",
      recruiterEmail: "samuel.otieno+wb@devtalent.io",
      slugSuffix: "worldbridge",
    },
    {
      orgName: "Global Impact Partners",
      orgType: "INTERNATIONAL_ORGANIZATION",
      recruiterName: "Nadia El Amrani",
      recruiterEmail: "nadia.elamrani+gip@devtalent.io",
      slugSuffix: "gip",
    },
    {
      orgName: "DevAfrica Consulting",
      orgType: "NGO",
      recruiterName: "David Mwangi",
      recruiterEmail: "david.mwangi+dac@devtalent.io",
      slugSuffix: "devafrica",
    },
  ];

  const recruiterProfiles = [];

  // Use real enum values from Prisma client to avoid schema guessing
  const defaultWorkMode = Object.values(WorkMode)[0];
  const defaultContractType = Object.values(ContractType)[0];
  const defaultMissionType = Object.values(MissionType)[0];
  const defaultMissionStatus = MissionStatus.PUBLISHED || Object.values(MissionStatus)[0];
  const defaultVisibility =
    MissionVisibility.PRIVATE || Object.values(MissionVisibility)[0];

  for (const company of companies) {
    const user = await prisma.user.upsert({
      where: { email: company.recruiterEmail },
      update: {
        name: company.recruiterName,
        role: "RECRUITER",
      },
      create: {
        email: company.recruiterEmail,
        name: company.recruiterName,
        role: "RECRUITER",
      },
    });

    let organization = await prisma.organization.findFirst({
      where: { name: company.orgName },
      select: { id: true, name: true },
    });

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          name: company.orgName,
          type: company.orgType,
        },
        select: { id: true, name: true },
      });
    }

    let recruiterProfile = await prisma.recruiterProfile.findUnique({
      where: { userId: user.id },
      select: { id: true, userId: true, organizationId: true },
    });

    if (!recruiterProfile) {
      recruiterProfile = await prisma.recruiterProfile.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
        },
        select: { id: true, userId: true, organizationId: true },
      });
    }

    recruiterProfiles.push({
      id: recruiterProfile.id,
      organizationId: organization.id,
      organizationName: organization.name,
      slugSuffix: company.slugSuffix,
    });
  }

  for (const recruiter of recruiterProfiles) {
    const missionTitle = "Senior Monitoring & Evaluation Expert";
    const missionCountry = "Kenya";
    const missionSlug = `${slugify(missionTitle)}-${slugify(
      missionCountry
    )}-${recruiter.slugSuffix}`;

    const existingMission = await prisma.mission.findFirst({
      where: {
        recruiterId: recruiter.id,
        title: missionTitle,
        country: missionCountry,
      },
      select: { id: true },
    });

    if (!existingMission) {
      await prisma.mission.create({
        data: {
          title: missionTitle,
          slug: missionSlug,
          description:
            "Lead monitoring and evaluation design, indicator framework development, field data quality assurance, and final performance reporting for a major donor-funded programme in Kenya.",
          organizationId: recruiter.organizationId,
          recruiterId: recruiter.id,
          sector: "Monitoring & Evaluation",
          country: missionCountry,
          workMode: defaultWorkMode,
          contractType: defaultContractType,
          missionType: defaultMissionType,
          visibility: defaultVisibility,
          status: defaultMissionStatus,
          donorFunder: "Multiple consulting firms competing on the same opportunity",
        },
      });
    }
  }

  console.log("✅ Similar missions seed complete");
  console.log(
    "Expected grouped result: Senior Monitoring & Evaluation Expert / Kenya / 4 companies"
  );
  console.log("Enums used:", {
    defaultWorkMode,
    defaultContractType,
    defaultMissionType,
    defaultMissionStatus,
    defaultVisibility,
  });
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });