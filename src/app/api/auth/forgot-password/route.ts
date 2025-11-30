import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { forgotPasswordSchema } from "@/lib/validations/auth"
import { sendResetPasswordEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar entrada
    const validation = forgotPasswordSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    const { email } = validation.data

    // Buscar usuário pelo e-mail
    const provider = await prisma.provider.findUnique({
      where: { email },
    })

    // Por segurança, não informamos se o e-mail existe ou não
    // Sempre retornamos sucesso para não vazar informações
    if (!provider) {
      return NextResponse.json({
        message: "Se o e-mail estiver cadastrado, você receberá as instruções para recuperação de senha.",
      })
    }

    // Gerar token seguro
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    // Salvar token no banco
    await prisma.provider.update({
      where: { id: provider.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // Enviar e-mail
    await sendResetPasswordEmail({
      to: provider.email,
      name: provider.name,
      resetToken,
    })

    return NextResponse.json({
      message: "Se o e-mail estiver cadastrado, você receberá as instruções para recuperação de senha.",
    })
  } catch (error) {
    console.error("Erro ao processar solicitação de recuperação:", error)
    return NextResponse.json(
      { error: "Erro ao processar solicitação. Tente novamente." },
      { status: 500 }
    )
  }
}
