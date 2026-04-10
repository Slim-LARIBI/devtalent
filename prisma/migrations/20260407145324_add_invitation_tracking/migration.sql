-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('EXPERT', 'RECRUITER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ExpertLevel" AS ENUM ('JUNIOR', 'MID', 'SENIOR', 'PRINCIPAL', 'DIRECTOR');

-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MissionType" AS ENUM ('SHORT_TERM', 'LONG_TERM');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('REMOTE', 'ON_SITE', 'HYBRID');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('CONSULTANT', 'EMPLOYEE', 'FREELANCE', 'FIXED_TERM');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NEW', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'HIRED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CV', 'COVER_LETTER', 'PORTFOLIO', 'CERTIFICATE', 'REFERENCE_LETTER', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('APPLICATION_RECEIVED', 'APPLICATION_STATUS_CHANGED', 'MISSION_PUBLISHED', 'MISSION_CLOSED', 'PROFILE_REVIEWED', 'SYSTEM');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('NGO', 'CONSULTING_FIRM', 'DONOR_AGENCY', 'INTERNATIONAL_ORGANIZATION', 'GOVERNMENT', 'BILATERAL_AGENCY', 'MULTILATERAL_BANK', 'THINK_TANK', 'FOUNDATION', 'OTHER');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('SENT', 'OPENED', 'CLICKED', 'APPLIED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "image" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'EXPERT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "expert_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT,
    "title" TEXT,
    "bio" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "level" "ExpertLevel",
    "yearsOfExperience" INTEGER,
    "availability" TEXT,
    "dailyRateMin" DECIMAL(10,2),
    "dailyRateMax" DECIMAL(10,2),
    "currency" TEXT DEFAULT 'EUR',
    "linkedinUrl" TEXT,
    "portfolioUrl" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "profileScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_to_expertise" (
    "expertId" TEXT NOT NULL,
    "expertiseId" TEXT NOT NULL,
    "level" TEXT,

    CONSTRAINT "expert_to_expertise_pkey" PRIMARY KEY ("expertId","expertiseId")
);

-- CreateTable
CREATE TABLE "sector_experiences" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "years" INTEGER,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sector_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "region_experiences" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,

    CONSTRAINT "region_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donor_experiences" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "donor" TEXT NOT NULL,
    "years" INTEGER,
    "role" TEXT,
    "projects" INTEGER,

    CONSTRAINT "donor_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_languages" (
    "expertId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "proficiency" TEXT NOT NULL,

    CONSTRAINT "expert_languages_pkey" PRIMARY KEY ("expertId","languageId")
);

-- CreateTable
CREATE TABLE "recruiter_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobTitle" TEXT,
    "organizationId" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recruiter_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL,
    "country" TEXT,
    "website" TEXT,
    "description" TEXT,
    "logoUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "organizationId" TEXT,
    "recruiterId" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "country" TEXT,
    "region" TEXT,
    "workMode" "WorkMode" NOT NULL,
    "contractType" "ContractType" NOT NULL,
    "missionType" "MissionType" NOT NULL,
    "duration" TEXT,
    "seniorityRequired" "ExpertLevel",
    "donorFunder" TEXT,
    "deadline" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "budgetMin" DECIMAL(12,2),
    "budgetMax" DECIMAL(12,2),
    "budgetCurrency" TEXT DEFAULT 'EUR',
    "status" "MissionStatus" NOT NULL DEFAULT 'DRAFT',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_to_expertise" (
    "missionId" TEXT NOT NULL,
    "expertiseId" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "mission_to_expertise_pkey" PRIMARY KEY ("missionId","expertiseId")
);

-- CreateTable
CREATE TABLE "mission_languages" (
    "missionId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "mission_languages_pkey" PRIMARY KEY ("missionId","languageId")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "coverNote" TEXT,
    "expectedRate" DECIMAL(10,2),
    "availability" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'NEW',
    "recruiterNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewedAt" TIMESTAMP(3),
    "shortlistedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_documents" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "application_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,
    "expertEmail" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'SENT',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstOpenedAt" TIMESTAMP(3),
    "lastOpenedAt" TIMESTAMP(3),
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "firstClickedAt" TIMESTAMP(3),
    "lastClickedAt" TIMESTAMP(3),
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "appliedAt" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expertise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT,

    CONSTRAINT "expertise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uploaded_documents" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL DEFAULT 'CV',
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "size" INTEGER,
    "mimeType" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "expert_profiles_userId_key" ON "expert_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "expert_profiles_slug_key" ON "expert_profiles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "recruiter_profiles_userId_key" ON "recruiter_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "missions_slug_key" ON "missions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "applications_expertId_missionId_key" ON "applications"("expertId", "missionId");

-- CreateIndex
CREATE UNIQUE INDEX "application_documents_applicationId_documentId_key" ON "application_documents"("applicationId", "documentId");

-- CreateIndex
CREATE INDEX "invitations_missionId_idx" ON "invitations"("missionId");

-- CreateIndex
CREATE INDEX "invitations_expertId_idx" ON "invitations"("expertId");

-- CreateIndex
CREATE INDEX "invitations_recruiterId_idx" ON "invitations"("recruiterId");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_missionId_expertId_key" ON "invitations"("missionId", "expertId");

-- CreateIndex
CREATE UNIQUE INDEX "expertise_name_key" ON "expertise"("name");

-- CreateIndex
CREATE UNIQUE INDEX "expertise_slug_key" ON "expertise"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "languages_name_key" ON "languages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "languages_code_key" ON "languages"("code");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_profiles" ADD CONSTRAINT "expert_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_to_expertise" ADD CONSTRAINT "expert_to_expertise_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_to_expertise" ADD CONSTRAINT "expert_to_expertise_expertiseId_fkey" FOREIGN KEY ("expertiseId") REFERENCES "expertise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sector_experiences" ADD CONSTRAINT "sector_experiences_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "region_experiences" ADD CONSTRAINT "region_experiences_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donor_experiences" ADD CONSTRAINT "donor_experiences_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_languages" ADD CONSTRAINT "expert_languages_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_languages" ADD CONSTRAINT "expert_languages_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recruiter_profiles" ADD CONSTRAINT "recruiter_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recruiter_profiles" ADD CONSTRAINT "recruiter_profiles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "recruiter_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_to_expertise" ADD CONSTRAINT "mission_to_expertise_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_to_expertise" ADD CONSTRAINT "mission_to_expertise_expertiseId_fkey" FOREIGN KEY ("expertiseId") REFERENCES "expertise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_languages" ADD CONSTRAINT "mission_languages_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_languages" ADD CONSTRAINT "mission_languages_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "uploaded_documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "recruiter_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploaded_documents" ADD CONSTRAINT "uploaded_documents_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
