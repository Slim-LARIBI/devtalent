// ─── Recruiter Types ──────────────────────────────────────────────────────────
import type { OrganizationType, Timestamps, PaginationParams } from "./common";

// ─── Organization ─────────────────────────────────────────────────────────────

export interface Organization extends Timestamps {
  id: string;
  name: string;
  type: OrganizationType;
  country: string | null;
  website: string | null;
  description: string | null;
  logoUrl: string | null;
  isVerified: boolean;
}

// ─── Recruiter Profile ────────────────────────────────────────────────────────

export interface RecruiterProfile extends Timestamps {
  id: string;
  userId: string;
  jobTitle: string | null;
  phone: string | null;
  organization: Organization | null;
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface UpdateRecruiterProfileDTO {
  jobTitle?: string;
  phone?: string;
  organizationId?: string;
}

export interface CreateOrganizationDTO {
  name: string;
  type: OrganizationType;
  country?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
}

export type UpdateOrganizationDTO = Partial<CreateOrganizationDTO>;

// ─── Recruiter Filters ────────────────────────────────────────────────────────

export interface RecruiterFilters extends PaginationParams {
  organizationType?: OrganizationType;
  country?: string;
  query?: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface RecruiterDashboardStats {
  totalMissions: number;
  publishedMissions: number;
  draftMissions: number;
  closedMissions: number;
  totalApplications: number;
  newApplications: number;
  shortlistedCandidates: number;
  hiredCandidates: number;
}
