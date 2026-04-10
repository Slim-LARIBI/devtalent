import { z } from "zod";
import { OrganizationType } from "@/types/common";

export const updateRecruiterProfileSchema = z.object({
  jobTitle: z.string().max(150).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  organizationId: z.string().cuid().optional(),
});

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, "Organization name must be at least 2 characters")
    .max(200, "Organization name is too long"),
  type: z.nativeEnum(OrganizationType, {
    errorMap: () => ({ message: "Please select an organization type" }),
  }),
  country: z.string().optional().or(z.literal("")),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  description: z
    .string()
    .max(2000, "Description must be under 2000 characters")
    .optional()
    .or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export type UpdateRecruiterProfileInput = z.infer<typeof updateRecruiterProfileSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
