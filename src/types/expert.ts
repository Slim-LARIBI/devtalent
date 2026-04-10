// ─── Expert Types ─────────────────────────────────────────────────────────────
import type { ExpertLevel, DocumentType, Timestamps, PaginationParams } from "./common";

// ─── Value Objects ────────────────────────────────────────────────────────────

export interface ExpertiseItem {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  level?: string | null;
}

export interface SectorExperienceItem {
  id: string;
  sector: string;
  years: number | null;
  isPrimary: boolean;
}

export interface RegionExperienceItem {
  id: string;
  country: string;
  region: string | null;
}

export interface DonorExperienceItem {
  id: string;
  donor: string;
  years: number | null;
  role: string | null;
  projects: number | null;
}

export interface LanguageItem {
  languageId: string;
  languageName: string;
  languageCode: string;
  proficiency: string;
}

export interface DocumentItem {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  size: number | null;
  mimeType: string | null;
  isPrimary: boolean;
  createdAt: Date;
}

// ─── Expert Profile ───────────────────────────────────────────────────────────

export interface ExpertProfile extends Timestamps {
  id: string;
  userId: string;
  slug: string | null;
  title: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  level: ExpertLevel | null;
  yearsOfExperience: number | null;
  availability: string | null;
  dailyRateMin: number | null;
  dailyRateMax: number | null;
  currency: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  isPublic: boolean;
  isComplete: boolean;
  profileScore: number;
  // Populated relations
  expertise: ExpertiseItem[];
  sectorExperiences: SectorExperienceItem[];
  regionExperiences: RegionExperienceItem[];
  languages: LanguageItem[];
  donorExperiences: DonorExperienceItem[];
  documents: DocumentItem[];
  // User info
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
}

// ─── Expert DTOs ──────────────────────────────────────────────────────────────

export interface CreateExpertProfileDTO {
  title?: string;
  bio?: string;
  phone?: string;
  location?: string;
  level?: ExpertLevel;
  yearsOfExperience?: number;
  availability?: string;
  dailyRateMin?: number;
  dailyRateMax?: number;
  currency?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export type UpdateExpertProfileDTO = Partial<CreateExpertProfileDTO>;

export interface AddExpertiseDTO {
  expertiseId: string;
  level?: string;
}

export interface AddLanguageDTO {
  languageId: string;
  proficiency: string;
}

export interface AddSectorExperienceDTO {
  sector: string;
  years?: number;
  isPrimary?: boolean;
}

export interface AddRegionExperienceDTO {
  country: string;
  region?: string;
}

export interface AddDonorExperienceDTO {
  donor: string;
  years?: number;
  role?: string;
  projects?: number;
}

// ─── Expert Filters ───────────────────────────────────────────────────────────

export interface ExpertFilters extends PaginationParams {
  level?: ExpertLevel;
  sector?: string;
  country?: string;
  donor?: string;
  languageCode?: string;
  minYearsOfExperience?: number;
  query?: string; // full-text search
  isAvailable?: boolean;
}

// ─── Expert Summary (for listings, candidate search) ─────────────────────────

export interface ExpertSummary {
  id: string;
  slug: string | null;
  title: string | null;
  level: ExpertLevel | null;
  yearsOfExperience: number | null;
  location: string | null;
  availability: string | null;
  profileScore: number;
  primarySector: string | null;
  topExpertise: string[];
  topDonors: string[];
  languages: string[];
  user: {
    name: string | null;
    image: string | null;
  };
}
