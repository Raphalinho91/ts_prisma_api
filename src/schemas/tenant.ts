import { z } from "zod";

export const CreateTenantSchema = z.object({
  name: z.string(),
  path: z.string(),
});

export const VerifyIfTenantcanBeUsedSchema = z.object({
  tenant: z.string(),
});
