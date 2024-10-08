import { z } from "zod";

export const SignUpSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  acceptTermsOfUse: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions d'utilisation",
  }),
});

export const LogInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const InfoUserSchema = z.object({
  id: z.string().min(1, "L'identifiant est requis"),
});

export const EditUserLocationSchema = z.object({
  id: z.string().min(1, "L'identifiant est requis"),
  country: z.string().optional(),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  addressOne: z.string().optional(),
  addressTwo: z.string().optional(),
});
