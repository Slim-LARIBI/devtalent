import { z } from "zod";
import { ExpertLevel, MissionType, WorkMode, ContractType } from "@/types/common";

export const createMissionSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be under 200 characters"),
  description: z
    .string()
    .min(100, "Description must be at least 100 characters")
    .max(10000, "Description must be under 10,000 characters"),
  sector: z.string().min(1, "Sector is required"),
  country: z.string().optional().or(z.literal("")),
  region: z.string().optional().or(z.literal("")),
  workMode: z.nativeEnum(WorkMode, {
    errorMap: () => ({ message: "Please select a work mode" }),
  }),
  contractType: z.nativeEnum(ContractType, {
    errorMap: () => ({ message: "Please select a contract type" }),
  }),
  missionType: z.nativeEnum(MissionType, {
    errorMap: () => ({ message: "Please select a mission type" }),
  }),
  duration: z.string().max(100).optional().or(z.literal("")),
  seniorityRequired: z.nativeEnum(ExpertLevel).optional(),
  donorFunder: z.string().optional().or(z.literal("")),
  deadline: z.coerce.date().optional(),
  startDate: z.coerce.date().optional(),
  budgetMin: z.number().min(0).optional(),
  budgetMax: z.number().min(0).optional(),
  budgetCurrency: z.string().length(3).optional(),
  organizationId: z.string().cuid().optional(),
  languageIds: z.array(z.string().cuid()).optional(),
  expertiseIds: z.array(z.string().cuid()).optional(),
});

export const updateMissionSchema = createMissionSchema.partial();

export const missionFiltersSchema = z.object({
  query: z.string().optional(),
  sector: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  missionType: z.nativeEnum(MissionType).optional(),
  workMode: z.nativeEnum(WorkMode).optional(),
  contractType: z.nativeEnum(ContractType).optional(),
  seniorityRequired: z.nativeEnum(ExpertLevel).optional(),
  donorFunder: z.string().optional(),
  languageCode: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sortBy: z.enum(["publishedAt", "deadline", "title", "viewCount"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type CreateMissionInput = z.infer<typeof createMissionSchema>;
export type UpdateMissionInput = z.infer<typeof updateMissionSchema>;
export type MissionFiltersInput = z.infer<typeof missionFiltersSchema>;
