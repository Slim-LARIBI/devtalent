-- CreateEnum
CREATE TYPE "MissionVisibility" AS ENUM ('PRIVATE', 'ORGANIZATION');

-- AlterTable
ALTER TABLE "missions" ADD COLUMN     "visibility" "MissionVisibility" NOT NULL DEFAULT 'PRIVATE';

-- CreateIndex
CREATE INDEX "missions_organizationId_idx" ON "missions"("organizationId");

-- CreateIndex
CREATE INDEX "missions_recruiterId_idx" ON "missions"("recruiterId");

-- CreateIndex
CREATE INDEX "missions_visibility_idx" ON "missions"("visibility");

-- CreateIndex
CREATE INDEX "recruiter_profiles_organizationId_idx" ON "recruiter_profiles"("organizationId");
