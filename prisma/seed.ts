// ─── Database Seed Script ─────────────────────────────────────────────────────
// Creates reference data + realistic sample users, missions, and applications.
// Run: pnpm db:seed
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { LANGUAGES } from "../src/lib/constants/languages";
import { EXPERTISE_AREAS } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─── 1. Languages ───────────────────────────────────────────────────────────
  console.log("  ↳ Seeding languages...");
  await Promise.all(
    LANGUAGES.map((lang) =>
      prisma.language.upsert({
        where: { code: lang.code },
        create: { name: lang.name, code: lang.code },
        update: { name: lang.name },
      })
    )
  );

  // ─── 2. Expertise ───────────────────────────────────────────────────────────
  console.log("  ↳ Seeding expertise areas...");
  await Promise.all(
    EXPERTISE_AREAS.map((exp) =>
      prisma.expertise.upsert({
        where: { slug: exp.slug },
        create: { name: exp.name, slug: exp.slug, category: exp.category },
        update: { name: exp.name, category: exp.category },
      })
    )
  );

  // ─── 3. Admin user ──────────────────────────────────────────────────────────
  console.log("  ↳ Creating admin user...");
  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD ?? "Admin@123!",
    12
  );
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? "admin@devtalent.io" },
    create: {
      email: process.env.ADMIN_EMAIL ?? "admin@devtalent.io",
      name: "Platform Admin",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
    update: {},
  });

  // ─── 4. Sample Organization ─────────────────────────────────────────────────
  console.log("  ↳ Creating sample organization...");
  const org = await prisma.organization.upsert({
    where: { id: "seed-org-01" },
    create: {
      id: "seed-org-01",
      name: "EuroDev Consulting",
      type: "CONSULTING_FIRM",
      country: "BE",
      website: "https://eurodev-consulting.example.com",
      description:
        "A leading EU-funded project management and technical assistance firm specializing in governance, public finance, and institutional reform across Africa, MENA, and Eastern Europe.",
      isVerified: true,
    },
    update: {},
  });

  // ─── 5. Sample Recruiter ────────────────────────────────────────────────────
  console.log("  ↳ Creating sample recruiter...");
  const recruiterPassword = await bcrypt.hash("Recruiter@123!", 12);
  const recruiterUser = await prisma.user.upsert({
    where: { email: "recruiter@devtalent.io" },
    create: {
      email: "recruiter@devtalent.io",
      name: "Sophie Delacroix",
      password: recruiterPassword,
      role: "RECRUITER",
      emailVerified: new Date(),
    },
    update: {},
  });

  await prisma.recruiterProfile.upsert({
    where: { userId: recruiterUser.id },
    create: {
      userId: recruiterUser.id,
      jobTitle: "Senior Recruitment Manager",
      organizationId: org.id,
    },
    update: { organizationId: org.id },
  });

  const recruiterProfile = await prisma.recruiterProfile.findUnique({
    where: { userId: recruiterUser.id },
  });

  // ─── 6. Sample Expert ───────────────────────────────────────────────────────
  console.log("  ↳ Creating sample expert...");
  const expertPassword = await bcrypt.hash("Expert@123!", 12);
  const expertUser = await prisma.user.upsert({
    where: { email: "expert@devtalent.io" },
    create: {
      email: "expert@devtalent.io",
      name: "Karim Mansour",
      password: expertPassword,
      role: "EXPERT",
      emailVerified: new Date(),
    },
    update: {},
  });

  const expertProfile = await prisma.expertProfile.upsert({
    where: { userId: expertUser.id },
    create: {
      userId: expertUser.id,
      slug: "karim-mansour",
      title: "Senior M&E Expert | Governance & PFM Specialist",
      bio: "Over 15 years of experience in monitoring and evaluation, public finance management, and institutional reform across Sub-Saharan Africa and the MENA region. Extensive donor exposure with EU, World Bank, and AfDB-funded programmes. Strong background in logframe design, results frameworks, and impact evaluation.",
      level: "SENIOR",
      yearsOfExperience: 15,
      availability: "Available in 2 weeks",
      dailyRateMin: 650,
      dailyRateMax: 850,
      currency: "EUR",
      linkedinUrl: "https://linkedin.com/in/karim-mansour-example",
      isPublic: true,
      isComplete: true,
      profileScore: 92,
    },
    update: {},
  });

  // Add expertise
  const meExpertise = await prisma.expertise.findUnique({
    where: { slug: "monitoring-evaluation" },
  });
  const pfmExpertise = await prisma.expertise.findUnique({
    where: { slug: "public-finance-management" },
  });

  if (meExpertise) {
    await prisma.expertToExpertise.upsert({
      where: { expertId_expertiseId: { expertId: expertProfile.id, expertiseId: meExpertise.id } },
      create: { expertId: expertProfile.id, expertiseId: meExpertise.id, level: "Expert" },
      update: {},
    });
  }

  if (pfmExpertise) {
    await prisma.expertToExpertise.upsert({
      where: { expertId_expertiseId: { expertId: expertProfile.id, expertiseId: pfmExpertise.id } },
      create: { expertId: expertProfile.id, expertiseId: pfmExpertise.id, level: "Expert" },
      update: {},
    });
  }

  // Add sector experiences
  await prisma.sectorExperience.deleteMany({ where: { expertId: expertProfile.id } });
  await prisma.sectorExperience.createMany({
    data: [
      { expertId: expertProfile.id, sector: "governance", years: 15, isPrimary: true },
      { expertId: expertProfile.id, sector: "public-finance", years: 12, isPrimary: false },
      { expertId: expertProfile.id, sector: "monitoring-evaluation", years: 15, isPrimary: false },
    ],
  });

  // Add region experiences
  await prisma.regionExperience.deleteMany({ where: { expertId: expertProfile.id } });
  await prisma.regionExperience.createMany({
    data: [
      { expertId: expertProfile.id, country: "MA", region: "north-africa-middle-east" },
      { expertId: expertProfile.id, country: "TN", region: "north-africa-middle-east" },
      { expertId: expertProfile.id, country: "SN", region: "sub-saharan-africa" },
      { expertId: expertProfile.id, country: "KE", region: "sub-saharan-africa" },
    ],
  });

  // Add donor experiences
  await prisma.donorExperience.deleteMany({ where: { expertId: expertProfile.id } });
  await prisma.donorExperience.createMany({
    data: [
      { expertId: expertProfile.id, donor: "eu", years: 10, role: "Key Expert", projects: 8 },
      { expertId: expertProfile.id, donor: "world-bank", years: 6, role: "Consultant", projects: 4 },
      { expertId: expertProfile.id, donor: "afdb", years: 4, role: "Team Leader", projects: 3 },
    ],
  });

  // Add languages
  const english = await prisma.language.findUnique({ where: { code: "en" } });
  const french = await prisma.language.findUnique({ where: { code: "fr" } });
  const arabic = await prisma.language.findUnique({ where: { code: "ar" } });

  if (english) {
    await prisma.expertLanguage.upsert({
      where: { expertId_languageId: { expertId: expertProfile.id, languageId: english.id } },
      create: { expertId: expertProfile.id, languageId: english.id, proficiency: "Fluent" },
      update: {},
    });
  }
  if (french) {
    await prisma.expertLanguage.upsert({
      where: { expertId_languageId: { expertId: expertProfile.id, languageId: french.id } },
      create: { expertId: expertProfile.id, languageId: french.id, proficiency: "Native" },
      update: {},
    });
  }
  if (arabic) {
    await prisma.expertLanguage.upsert({
      where: { expertId_languageId: { expertId: expertProfile.id, languageId: arabic.id } },
      create: { expertId: expertProfile.id, languageId: arabic.id, proficiency: "Native" },
      update: {},
    });
  }

  // ─── 7. Sample Missions ─────────────────────────────────────────────────────
  console.log("  ↳ Creating sample missions...");

  if (!recruiterProfile) throw new Error("Recruiter profile not created");

  const mission1 = await prisma.mission.upsert({
    where: { slug: "senior-me-expert-governance-reform-morocco" },
    create: {
      slug: "senior-me-expert-governance-reform-morocco",
      title: "Senior M&E Expert — Governance Reform Programme, Morocco",
      description: `## Overview
EuroDev Consulting is recruiting a Senior M&E Expert to support a major EU-funded governance reform programme in Morocco. The expert will be responsible for designing and operationalizing the programme's M&E framework, including the results chain, indicators, data collection tools, and reporting templates.

## Key Responsibilities
- Design and finalize the programme's logframe and M&E framework
- Develop data collection instruments and protocols
- Train local M&E staff and beneficiary institutions
- Conduct baseline, mid-term, and final evaluations
- Prepare quality M&E reports for the EU Delegation

## Requirements
- At least 10 years of experience in M&E for governance or PFM programmes
- Proven experience with EU-funded projects
- Strong knowledge of results-based management (RBM)
- Experience in the MENA region is an asset
- Excellent written and verbal communication in French and English`,
      sector: "governance",
      country: "MA",
      region: "north-africa-middle-east",
      workMode: "HYBRID",
      contractType: "CONSULTANT",
      missionType: "LONG_TERM",
      duration: "24 months",
      seniorityRequired: "SENIOR",
      donorFunder: "eu",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      budgetMin: 600,
      budgetMax: 900,
      budgetCurrency: "EUR",
      status: "PUBLISHED",
      publishedAt: new Date(),
      organizationId: org.id,
      recruiterId: recruiterProfile.id,
    },
    update: {},
  });

  // Link languages to mission 1
  if (french && english) {
    await prisma.missionLanguage.upsert({
      where: { missionId_languageId: { missionId: mission1.id, languageId: french.id } },
      create: { missionId: mission1.id, languageId: french.id, isRequired: true },
      update: {},
    });
    await prisma.missionLanguage.upsert({
      where: { missionId_languageId: { missionId: mission1.id, languageId: english.id } },
      create: { missionId: mission1.id, languageId: english.id, isRequired: true },
      update: {},
    });
  }

  const mission2 = await prisma.mission.upsert({
    where: { slug: "wash-engineer-somalia-remote" },
    create: {
      slug: "wash-engineer-somalia-remote",
      title: "WASH Engineer (Junior) — Emergency Response, Somalia",
      description: `## Mission Context
UNHCR-funded emergency WASH response in displacement-affected communities in southern Somalia. The WASH Engineer will support the technical implementation of water and sanitation infrastructure in IDP camps.

## Key Tasks
- Support site assessments and technical surveys
- Supervise construction of water points, latrines, and hygiene facilities
- Coordinate with camp management and community representatives
- Ensure compliance with SPHERE standards
- Report on progress and challenges

## Profile Required
- Degree in civil engineering, environmental engineering, or related field
- 2–5 years of experience in WASH programmes in humanitarian contexts
- Experience in East Africa is an advantage
- Ability to work in challenging environments`,
      sector: "wash",
      country: "SO",
      region: "sub-saharan-africa",
      workMode: "ON_SITE",
      contractType: "CONSULTANT",
      missionType: "SHORT_TERM",
      duration: "6 months",
      seniorityRequired: "JUNIOR",
      donorFunder: "unhcr",
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: "PUBLISHED",
      publishedAt: new Date(),
      organizationId: org.id,
      recruiterId: recruiterProfile.id,
    },
    update: {},
  });

  if (english) {
    await prisma.missionLanguage.upsert({
      where: { missionId_languageId: { missionId: mission2.id, languageId: english.id } },
      create: { missionId: mission2.id, languageId: english.id, isRequired: true },
      update: {},
    });
  }

  // ─── 8. Sample Application ──────────────────────────────────────────────────
  console.log("  ↳ Creating sample application...");
  await prisma.application.upsert({
    where: { expertId_missionId: { expertId: expertProfile.id, missionId: mission1.id } },
    create: {
      expertId: expertProfile.id,
      missionId: mission1.id,
      coverNote:
        "I am very interested in this mission. My 15 years of M&E experience in governance and PFM programmes, combined with extensive work in the MENA region and strong EU donor exposure, make me an ideal fit. I am immediately available and fluent in both French and Arabic.",
      expectedRate: 750,
      availability: "Available in 2 weeks",
      status: "NEW",
    },
    update: {},
  });

  console.log("\n✅ Seed complete!\n");
  console.log("─────────────────────────────────────");
  console.log("Test accounts:");
  console.log("  Admin:     admin@devtalent.io     / Admin@123!");
  console.log("  Recruiter: recruiter@devtalent.io / Recruiter@123!");
  console.log("  Expert:    expert@devtalent.io    / Expert@123!");
  console.log("─────────────────────────────────────\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
