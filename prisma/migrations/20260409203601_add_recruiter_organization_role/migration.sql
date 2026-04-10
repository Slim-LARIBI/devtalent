-- CreateEnum
CREATE TYPE "RecruiterOrganizationRole" AS ENUM ('OWNER', 'MEMBER');

-- AlterTable
ALTER TABLE "recruiter_profiles" ADD COLUMN     "organizationRole" "RecruiterOrganizationRole" NOT NULL DEFAULT 'MEMBER';

-- CreateIndex
CREATE INDEX "recruiter_profiles_organizationRole_idx" ON "recruiter_profiles"("organizationRole");
