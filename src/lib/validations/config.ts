import { z } from "zod";

export const updateProviderConfigSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  
  businessName: z
    .string()
    .min(2, "Nome do negócio deve ter pelo menos 2 caracteres")
    .max(100, "Nome do negócio deve ter no máximo 100 caracteres"),
  
  publicUrl: z
    .string()
    .min(3, "URL pública deve ter pelo menos 3 caracteres")
    .max(50, "URL pública deve ter no máximo 50 caracteres")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "URL pública deve conter apenas letras, números, hífens e underscores"
    ),
  
  email: z
    .string()
    .email("E-mail deve ter um formato válido")
    .max(255, "E-mail deve ter no máximo 255 caracteres"),
  
  address: z
    .string()
    .min(10, "Endereço deve ter pelo menos 10 caracteres")
    .max(255, "Endereço deve ter no máximo 255 caracteres"),
});

export type UpdateProviderConfigInput = z.infer<typeof updateProviderConfigSchema>;
