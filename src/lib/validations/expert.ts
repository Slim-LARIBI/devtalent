import { z } from "zod";
import { ExpertLevel } from "@/types/common";

export const expertProfileSchema = z.object({
  title: z
    .string()
    .max(150, "Title must be under 150 characters")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(2000, "Bio must be under 2000 characters")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(30, "Phone number too long")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .max(100, "Location must be under 100 characters")
    .optional()
    .or(z.literal("")),
  level: z.nativeEnum(ExpertLevel).optional(),
  yearsOfExperience: z
    .number()
    .int()
    .min(0, "Years of experience cannot be negative")
    .max(60, "Invalid years of experience")
    .optional(),
  availability: z.string().max(100).optional().or(z.literal("")),
  dailyRateMin: z
    .number()
    .min(0, "Rate cannot be negative")
    .max(100000, "Rate seems too high")
    .optional(),
  dailyRateMax: z
    .number()
    .min(0, "Rate cannot be negative")
    .max(100000, "Rate seems too high")
    .optional(),
  currency: z.string().length(3, "Currency must be a 3-letter code").optional(),
  linkedinUrl: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  portfolioUrl: z
    .string()
    .url("Please enter a valid portfolio URL")
    .optional()
    .or(z.literal("")),
  isPublic: z.boolean().optional(),
});

export const addExpertiseSchema = z.object({
  expertiseId: z.string().cuid("Invalid expertise ID"),
  level: z
    .enum(["Expert", "Proficient", "Familiar"])
    .optional(),
});

export const addLanguageSchema = z.object({
  languageId: z.string().cuid("Invalid language ID"),
  proficiency: z.enum(["Native", "Fluent", "Professional", "Basic"], {
    errorMap: () => ({ message: "Please select a proficiency level" }),
  }),
});

export const addSectorExperienceSchema = z.object({
  sector: z.string().min(1, "Sector is required"),
  years: z.number().int().min(0).max(60).optional(),
  isPrimary: z.boolean().optional(),
});

export const addRegionExperienceSchema = z.object({
  country: z.string().min(2, "Country code is required").max(10),
  region: z.string().optional(),
});

export const addDonorExperienceSchema = z.object({
  donor: z.string().min(1, "Donor is required"),
  years: z.number().int().min(0).max(60).optional(),
  role: z.string().max(100).optional().or(z.literal("")),
  projects: z.number().int().min(0).optional(),
});

export type ExpertProfileInput = z.infer<typeof expertProfileSchema>;
export type AddExpertiseInput = z.infer<typeof addExpertiseSchema>;
export type AddLanguageInput = z.infer<typeof addLanguageSchema>;
export type AddSectorInput = z.infer<typeof addSectorExperienceSchema>;
export type AddRegionInput = z.infer<typeof addRegionExperienceSchema>;
export type AddDonorInput = z.infer<typeof addDonorExperienceSchema>;
