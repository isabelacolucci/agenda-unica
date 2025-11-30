import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { serviceSchema } from "@/lib/validations/service"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const providerId = parseInt(session.user.id)

    const services = await prisma.service.findMany({
      where: {
        providerId: providerId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error("Erro ao buscar serviços:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const providerId = parseInt(session.user.id)
    const body = await request.json()

    // Validar dados do serviço
    const validatedData = serviceSchema.parse(body)

    // Criar serviço no banco de dados
    const service = await prisma.service.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        durationMinutes: validatedData.durationMinutes,
        price: validatedData.price,
        isActive: validatedData.isActive ?? true,
        providerId: providerId
      }
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar serviço:", error)

    // Erro de validação do Zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
