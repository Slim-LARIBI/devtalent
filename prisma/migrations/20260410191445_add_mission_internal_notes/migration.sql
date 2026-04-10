-- CreateTable
CREATE TABLE "mission_internal_notes" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mission_internal_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mission_internal_notes_missionId_createdAt_idx" ON "mission_internal_notes"("missionId", "createdAt");

-- CreateIndex
CREATE INDEX "mission_internal_notes_recruiterId_idx" ON "mission_internal_notes"("recruiterId");

-- AddForeignKey
ALTER TABLE "mission_internal_notes" ADD CONSTRAINT "mission_internal_notes_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_internal_notes" ADD CONSTRAINT "mission_internal_notes_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "recruiter_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
