// ─── Common Types ─────────────────────────────────────────────────────────────
// Framework-agnostic shared types used across all features.
// These can be imported in a future NestJS backend without modification.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Enums (mirrors Prisma enums, but decoupled) ──────────────────────────────

export enum UserRole {
  EXPERT = "EXPERT",
  RECRUITER = "RECRUITER",
  ADMIN = "ADMIN",
}

export enum ExpertLevel {
  JUNIOR = "JUNIOR",
  MID = "MID",
  SENIOR = "SENIOR",
  PRINCIPAL = "PRINCIPAL",
  DIRECTOR = "DIRECTOR",
}

export enum MissionStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CLOSED = "CLOSED",
  ARCHIVED = "ARCHIVED",
}

export enum MissionType {
  SHORT_TERM = "SHORT_TERM",
  LONG_TERM = "LONG_TERM",
}

export enum WorkMode {
  REMOTE = "REMOTE",
  ON_SITE = "ON_SITE",
  HYBRID = "HYBRID",
}

export enum ContractType {
  CONSULTANT = "CONSULTANT",
  EMPLOYEE = "EMPLOYEE",
  FREELANCE = "FREELANCE",
  FIXED_TERM = "FIXED_TERM",
}

export enum ApplicationStatus {
  NEW = "NEW",
  REVIEWED = "REVIEWED",
  SHORTLISTED = "SHORTLISTED",
  REJECTED = "REJECTED",
  HIRED = "HIRED",
}

export enum DocumentType {
  CV = "CV",
  COVER_LETTER = "COVER_LETTER",
  PORTFOLIO = "PORTFOLIO",
  CERTIFICATE = "CERTIFICATE",
  REFERENCE_LETTER = "REFERENCE_LETTER",
  OTHER = "OTHER",
}

export enum NotificationType {
  APPLICATION_RECEIVED = "APPLICATION_RECEIVED",
  APPLICATION_STATUS_CHANGED = "APPLICATION_STATUS_CHANGED",
  MISSION_PUBLISHED = "MISSION_PUBLISHED",
  MISSION_CLOSED = "MISSION_CLOSED",
  PROFILE_REVIEWED = "PROFILE_REVIEWED",
  SYSTEM = "SYSTEM",
}

export enum OrganizationType {
  NGO = "NGO",
  CONSULTING_FIRM = "CONSULTING_FIRM",
  DONOR_AGENCY = "DONOR_AGENCY",
  INTERNATIONAL_ORGANIZATION = "INTERNATIONAL_ORGANIZATION",
  GOVERNMENT = "GOVERNMENT",
  BILATERAL_AGENCY = "BILATERAL_AGENCY",
  MULTILATERAL_BANK = "MULTILATERAL_BANK",
  THINK_TANK = "THINK_TANK",
  FOUNDATION = "FOUNDATION",
  OTHER = "OTHER",
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ─── API Response ─────────────────────────────────────────────────────────────

export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiError = {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, string[]>;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Generic helpers ──────────────────────────────────────────────────────────

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

/** Makes specific keys of T required */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/** Makes specific keys of T optional */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Extract the resolved type from a Promise */
export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

/** ID-only reference to an entity */
export type EntityRef = { id: string };

/** Audit timestamps */
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}
