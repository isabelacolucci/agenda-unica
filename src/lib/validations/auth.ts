import { z } from "zod"

export const signInSchema = z.object({
  email: z.string({ message: "Email é obrigatório" })
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z.string({ message: "Senha é obrigatória" })
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres"),
})

export type SignInInput = z.infer<typeof signInSchema>

export const forgotPasswordSchema = z.object({
  email: z.string({ message: "Email é obrigatório" })
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
  token: z.string({ message: "Token é obrigatório" })
    .min(1, "Token é obrigatório"),
  password: z.string({ message: "Nova senha é obrigatória" })
    .min(1, "Nova senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres"),
  confirmPassword: z.string({ message: "Confirmação de senha é obrigatória" })
    .min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
