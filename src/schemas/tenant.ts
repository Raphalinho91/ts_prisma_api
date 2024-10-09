import { z } from "zod";

export const CreateTenantSchema = z.object({
  userId: z.string().min(1, "UserId is required"),
  name: z.string().min(1, "Name is required"),
  path: z.string().min(1, "Path is required"),
  url: z
    .string()
    .min(1, "URL is required")
    .regex(/^https:\/\/[a-zA-Z]+\.koabuy\.fr\/v1\/[a-zA-Z]+$/, {
      message: "Invalid URL format",
    }),
  iban: z
    .string()
    .min(1, { message: "L'iban est requis" })
    .regex(/^[A-Z]{2} \d{2}( \d{4})*$/, {
      message: "IBAN invalide",
    }),
});

export const VerifyIfTenantcanBeUsedSchema = z.object({
  tenant: z.string(),
});
