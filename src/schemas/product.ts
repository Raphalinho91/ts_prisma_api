import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  reference: z.string().min(1, "Reference is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  tenantId: z.string().min(1, "Tenant ID is required"),
});
