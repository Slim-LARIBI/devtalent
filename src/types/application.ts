// ─── Application Types ────────────────────────────────────────────────────────
import { ApplicationStatus } from "./common";
import type { PaginationParams } from "./common";
import type { ExpertSummary } from "./expert";
import type { MissionSummary } from "./mission";

// ─── Application ──────────────────────────────────────────────────────────────

export interface Application {
  id: string;
  expertId: string;
  missionId: string;
  coverNote: string | null;
  expectedRate: number | null;
  availability: string | null;
  status: ApplicationStatus;
  recruiterNotes: string | null;
  reviewedAt: Date | null;
  shortlistedAt: Date | null;
  closedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  expert: ExpertSummary;
  mission: MissionSummary;
  documents: ApplicationDocumentItem[];
}

export interface ApplicationDocumentItem {
  id: string;
  documentId: string;
  documentName: string;
  documentUrl: string;
  documentType: string;
}

// ─── Application DTOs ─────────────────────────────────────────────────────────

export interface CreateApplicationDTO {
  missionId: string;
  coverNote?: string;
  expectedRate?: number;
  availability?: string;
  documentIds?: string[]; // UploadedDocument IDs to attach
}

export interface UpdateApplicationStatusDTO {
  status: ApplicationStatus;
  recruiterNotes?: string;
}

// ─── Application Filters ──────────────────────────────────────────────────────

export interface ApplicationFilters extends PaginationParams {
  status?: ApplicationStatus;
  missionId?: string;
  expertId?: string;
  recruiterId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// ─── Status transition rules ──────────────────────────────────────────────────
// Defines valid next states for each current state

export const APPLICATION_STATUS_TRANSITIONS: Record<
  ApplicationStatus,
  ApplicationStatus[]
> = {
  [ApplicationStatus.NEW]: [
    ApplicationStatus.REVIEWED,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.REVIEWED]: [
    ApplicationStatus.SHORTLISTED,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.SHORTLISTED]: [
    ApplicationStatus.HIRED,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.REJECTED]: [], // terminal
  [ApplicationStatus.HIRED]: [],    // terminal
};
