import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { updateServiceSchema } from "@/lib/validations/service"
import { NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { id } = await params
    const serviceId = parseInt(id)
    
    if (isNaN(serviceId)) {
      return NextResponse.json(
        { error: "ID do serviço inválido" },
        { status: 400 }
      )
    }

    const providerId = parseInt(session.user.id)

    // Verificar se o serviço existe e pertence ao provider
    const existingService = await prisma.service.findFirst({
      where: {
        id: serviceId,
        providerId: providerId
      }
    })

    if (!existingService) {
      return NextResponse.json(
        { error: "Serviço não encontrado ou você não tem permissão para editá-lo" },
        { status: 404 }
      )
    }

    const body = await request.json()

    // Validar dados de entrada
    const validationResult = updateServiceSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Dados inválidos",
          details: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      )
    }

    const updateData = validationResult.data

    // Atualizar o serviço no banco
    const updatedService = await prisma.service.update({
      where: {
        id: serviceId
      },
      data: updateData
    })

    return NextResponse.json(updatedService)
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
