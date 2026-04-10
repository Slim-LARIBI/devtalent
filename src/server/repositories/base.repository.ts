// ─── Base Repository Interface ────────────────────────────────────────────────
// Defines the standard contract for all data access objects.
// When migrating to NestJS, concrete implementations use @Injectable()
// and inject PrismaService, but this interface remains unchanged.
// ─────────────────────────────────────────────────────────────────────────────

import type { PaginatedResult, PaginationParams } from "@/types/common";

export interface IBaseRepository<T, CreateDTO, UpdateDTO, Filters> {
  findById(id: string): Promise<T | null>;
  findAll(params?: PaginationParams): Promise<PaginatedResult<T>>;
  findMany(filters: Filters): Promise<PaginatedResult<T>>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

// ─── Pagination helper ────────────────────────────────────────────────────────

export function buildPaginationResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export function buildPrismaSkipTake(
  page: number = 1,
  limit: number = 20
): { skip: number; take: number } {
  return {
    skip: (Math.max(1, page) - 1) * limit,
    take: Math.min(limit, 100), // hard cap at 100
  };
}
