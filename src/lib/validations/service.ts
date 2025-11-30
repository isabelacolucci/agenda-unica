import { z } from "zod"

export const serviceSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
  durationMinutes: z
    .number()
    .min(1, "Duração deve ser pelo menos 1 minuto")
    .max(600, "Duração deve ser no máximo 10 horas"),
  price: z
    .number()
    .min(0.01, "Preço deve ser maior que zero"),
  isActive: z.boolean().optional().default(true)
})

export const updateServiceSchema = serviceSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Pelo menos um campo deve ser fornecido para atualização",
  }
)

export type ServiceInput = z.infer<typeof serviceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>
