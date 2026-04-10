// ─── Mission Types ────────────────────────────────────────────────────────────
import type {
  MissionStatus,
  MissionType,
  WorkMode,
  ContractType,
  ExpertLevel,
  OrganizationType,
  Timestamps,
  PaginationParams,
} from "./common";

// ─── Mission ──────────────────────────────────────────────────────────────────

export interface Mission extends Timestamps {
  id: string;
  slug: string;
  title: string;
  description: string;
  sector: string;
  country: string | null;
  region: string | null;
  workMode: WorkMode;
  contractType: ContractType;
  missionType: MissionType;
  duration: string | null;
  seniorityRequired: ExpertLevel | null;
  donorFunder: string | null;
  deadline: Date | null;
  startDate: Date | null;
  budgetMin: number | null;
  budgetMax: number | null;
  budgetCurrency: string | null;
  status: MissionStatus;
  viewCount: number;
  publishedAt: Date | null;
  closedAt: Date | null;
  // Relations
  organization: MissionOrganization | null;
  recruiter: MissionRecruiter;
  languages: MissionLanguageItem[];
  requiredExpertise: MissionExpertiseItem[];
  _count?: { applications: number };
}

export interface MissionOrganization {
  id: string;
  name: string;
  type: OrganizationType;
  logoUrl: string | null;
  country: string | null;
  isVerified: boolean;
}

export interface MissionRecruiter {
  id: string;
  jobTitle: string | null;
  user: {
    name: string | null;
    image: string | null;
  };
}

export interface MissionLanguageItem {
  languageId: string;
  languageName: string;
  languageCode: string;
  isRequired: boolean;
}

export interface MissionExpertiseItem {
  expertiseId: string;
  expertiseName: string;
  isRequired: boolean;
}

// ─── Mission DTOs ─────────────────────────────────────────────────────────────

export interface CreateMissionDTO {
  title: string;
  description: string;
  sector: string;
  country?: string;
  region?: string;
  workMode: WorkMode;
  contractType: ContractType;
  missionType: MissionType;
  duration?: string;
  seniorityRequired?: ExpertLevel;
  donorFunder?: string;
  deadline?: Date;
  startDate?: Date;
  budgetMin?: number;
  budgetMax?: number;
  budgetCurrency?: string;
  organizationId?: string;
  languageIds?: string[];
  expertiseIds?: string[];
}

export type UpdateMissionDTO = Partial<CreateMissionDTO>;

export interface PublishMissionDTO {
  missionId: string;
}

// ─── Mission Filters ──────────────────────────────────────────────────────────

export interface MissionFilters extends PaginationParams {
  status?: MissionStatus;
  missionType?: MissionType;
  workMode?: WorkMode;
  contractType?: ContractType;
  sector?: string;
  country?: string;
  region?: string;
  donorFunder?: string;
  seniorityRequired?: ExpertLevel;
  languageCode?: string;
  query?: string; // full-text search
  deadlineAfter?: Date;
}

// ─── Mission Summary (for listings) ──────────────────────────────────────────

export interface MissionSummary {
  id: string;
  slug: string;
  title: string;
  sector: string;
  country: string | null;
  region: string | null;
  workMode: WorkMode;
  missionType: MissionType;
  seniorityRequired: ExpertLevel | null;
  donorFunder: string | null;
  deadline: Date | null;
  publishedAt: Date | null;
  status: MissionStatus;
  organization: MissionOrganization | null;
  languages: string[]; // language names
  applicationsCount?: number;
}
