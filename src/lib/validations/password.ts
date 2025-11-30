import { z } from "zod"

// Schema para atualização de senha
const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string()
    .min(6, "Nova senha deve ter pelo menos 6 caracteres")
    .max(100, "Nova senha deve ter no máximo 100 caracteres"),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
})

export const updatePasswordSchema = passwordUpdateSchema.refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "Nova senha e confirmação devem ser iguais",
    path: ["confirmPassword"],
  }
)

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
