// ─── Service Contracts (Interfaces) ──────────────────────────────────────────
// These interfaces define what the service layer must do.
// Both the current Next.js implementations and future NestJS implementations
// must satisfy these contracts.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  ApiResponse,
  PaginatedResult,
  ExpertLevel,
  ApplicationStatus,
} from "@/types";
import type { ExpertProfile, ExpertSummary, ExpertFilters } from "@/types/expert";
import type { Mission, MissionSummary, MissionFilters, CreateMissionDTO, UpdateMissionDTO } from "@/types/mission";
import type { Application, ApplicationFilters, CreateApplicationDTO } from "@/types/application";
import type { RecruiterDashboardStats } from "@/types/recruiter";

// ─── IExpertService ───────────────────────────────────────────────────────────

export interface IExpertService {
  getProfileByUserId(userId: string): Promise<ExpertProfile | null>;
  updateBasicInfo(
    expertId: string,
    userId: string,
    data: Partial<ExpertProfile>
  ): Promise<ExpertProfile>;
  findMany(filters: ExpertFilters): Promise<PaginatedResult<ExpertSummary>>;
}

// ─── IMissionService ──────────────────────────────────────────────────────────

export interface IMissionService {
  findById(id: string): Promise<Mission | null>;
  findBySlug(slug: string): Promise<Mission | null>;
  findMany(filters: MissionFilters): Promise<PaginatedResult<MissionSummary>>;
  create(recruiterId: string, data: CreateMissionDTO): Promise<Mission>;
  update(missionId: string, recruiterId: string, data: UpdateMissionDTO): Promise<Mission>;
  publish(missionId: string, recruiterId: string): Promise<Mission>;
  close(missionId: string, recruiterId: string): Promise<Mission>;
}

// ─── IApplicationService ──────────────────────────────────────────────────────

export interface IApplicationService {
  apply(userId: string, data: CreateApplicationDTO): Promise<Application>;
  updateStatus(
    applicationId: string,
    recruiterId: string,
    status: ApplicationStatus,
    notes?: string
  ): Promise<Application>;
  findMany(filters: ApplicationFilters): Promise<PaginatedResult<Application>>;
}

// ─── IRecruiterService ────────────────────────────────────────────────────────

export interface IRecruiterService {
  getDashboardStats(recruiterId: string): Promise<RecruiterDashboardStats>;
}
