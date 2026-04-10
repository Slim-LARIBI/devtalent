import { z } from "zod";
import { ApplicationStatus } from "@/types/common";

export const createApplicationSchema = z.object({
  missionId: z.string().cuid("Invalid mission ID"),
  coverNote: z
    .string()
    .max(2000, "Cover note must be under 2000 characters")
    .optional()
    .or(z.literal("")),
  expectedRate: z.number().min(0).max(100000).optional(),
  availability: z.string().max(100).optional().or(z.literal("")),
  documentIds: z.array(z.string().cuid()).optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus, {
    errorMap: () => ({ message: "Invalid application status" }),
  }),
  recruiterNotes: z
    .string()
    .max(3000, "Notes must be under 3000 characters")
    .optional()
    .or(z.literal("")),
});

export const applicationFiltersSchema = z.object({
  status: z.nativeEnum(ApplicationStatus).optional(),
  missionId: z.string().cuid().optional(),
  expertId: z.string().cuid().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sortBy: z.enum(["createdAt", "status", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type ApplicationFiltersInput = z.infer<typeof applicationFiltersSchema>;
