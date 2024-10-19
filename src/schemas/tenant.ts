import { z } from "zod";

export const CreateTenantSchema = z.object({
  userId: z.string().min(1, "UserId is required"),
  name: z.string().min(1, "Name is required"),
  path: z.string().min(1, "Path is required"),
  url: z
    .string()
    .url()
    .min(1, "URL is required")
    .regex(/^https:\/\/koabuy\.onrender\.com\/v1\/[a-zA-Z]+\/[a-zA-Z]+$/, {
      message: "Invalid URL format",
    }),
  iban: z
    .string()
    .min(1, { message: "L'IBAN est requis" })
    .regex(/^FR \d{2}( \d{4}){5} \d{3}$/, {
      message: "IBAN invalide",
    }),
});

export const VerifyIfTenantcanBeUsedSchema = z.object({
  userId: z.string().optional(),
  tenantId: z.string().min(1, "TenantId is required"),
  tenantUrl: z
    .string()
    .min(1, "URL is required")
    .regex(/^https:\/\/koabuy\.onrender\.com\/v1\/[a-zA-Z]+\/[a-zA-Z]+$/, {
      message: "Invalid URL format",
    }),
});

export const EditTenantSchema = z.object({
  userId: z.string().min(1, "UserId is required"),
  id: z.string().min(1, "TenantId is required"),
  name: z.string().min(1, "Name is required"),
  path: z.string().min(1, "Path is required"),
  url: z
    .string()
    .url()
    .min(1, "URL is required")
    .regex(/^https:\/\/koabuy\.onrender\.com\/v1\/[a-zA-Z]+\/[a-zA-Z]+$/, {
      message: "Invalid URL format",
    }),
  iban: z
    .string()
    .min(1, { message: "L'IBAN est requis" })
    .regex(/^FR \d{2}( \d{4}){5} \d{3}$/, {
      message: "IBAN invalide",
    })
    .nullish(),
});

export const AddContactProTenantSchema = z
  .object({
    userId: z
      .string()
      .min(1, { message: "L'identifiant de l'utilisateur est requis" }),
    id: z
      .string()
      .min(1, { message: "L'identifiant de la boutique est requis" }),
    email: z.string().email("L'adresse e-mail est invalide").nullish(),
    phoneNumber: z
      .string()
      .regex(/^\d{2}( \d{2}){4}$/, {
        message:
          "Numéro de téléphone invalide. Le format attendu est : 00 00 00 00 00",
      })
      .nullish(),
  })
  .refine((data) => data.email || data.phoneNumber, {
    message: "Vous devez fournir au moins un e-mail ou un numéro de téléphone",
    path: ["email", "phoneNumber"],
  });
