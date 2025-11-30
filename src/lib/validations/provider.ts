import { z } from "zod";

export const registerProviderSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  
  businessName: z
    .string()
    .min(2, "Nome do negócio deve ter pelo menos 2 caracteres")
    .max(100, "Nome do negócio deve ter no máximo 100 caracteres"),
  
  email: z
    .string()
    .email("E-mail deve ter um formato válido")
    .max(255, "E-mail deve ter no máximo 255 caracteres"),
  
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres"),
  
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .refine((phone) => {
      // Remove todos os caracteres não numéricos para validação
      const numbersOnly = phone.replace(/\D/g, "");
      return numbersOnly.length >= 10 && numbersOnly.length <= 11;
    }, "Telefone deve ter 10 ou 11 dígitos")
    .refine((phone) => {
      // Validar formato brasileiro (com ou sem máscara)
      const numbersOnly = phone.replace(/\D/g, "");
      return /^[0-9]+$/.test(numbersOnly);
    }, "Telefone deve conter apenas números"),
  
  address: z
    .string()
    .min(10, "Endereço deve ter pelo menos 10 caracteres")
    .max(255, "Endereço deve ter no máximo 255 caracteres"),
});

export type RegisterProviderInput = z.infer<typeof registerProviderSchema>;
