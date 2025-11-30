import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const providerId = parseInt(session.user.id)

    if (isNaN(serviceId)) {
      return NextResponse.json(
        { error: "ID do serviço inválido" },
        { status: 400 }
      )
    }

    // Verificar se o serviço existe e pertence ao usuário autenticado
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        providerId: providerId
      }
    })

    if (!service) {
      return NextResponse.json(
        { error: "Serviço não encontrado ou não autorizado" },
        { status: 404 }
      )
    }

    // Alternar o status do serviço
    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        isActive: !service.isActive
      }
    })

    return NextResponse.json({
      id: updatedService.id,
      isActive: updatedService.isActive,
      message: `Serviço ${updatedService.isActive ? 'ativado' : 'desativado'} com sucesso`
    })
  } catch (error) {
    console.error("Erro ao alternar status do serviço:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
