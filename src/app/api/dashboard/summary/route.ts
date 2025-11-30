import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

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

    // Buscar as informações do prestador
    const provider = await prisma.provider.findUnique({
      where: {
        id: providerId
      },
      select: {
        publicUrl: true
      }
    })

    if (!provider) {
      return NextResponse.json(
        { error: "Prestador não encontrado" },
        { status: 404 }
      )
    }

    // Buscar estatísticas dos agendamentos
    const [total, completed, canceled, noShow] = await Promise.all([
      // Total de agendamentos
      prisma.appointment.count({
        where: {
          providerId: providerId
        }
      }),
      // Agendamentos concluídos
      prisma.appointment.count({
        where: {
          providerId: providerId,
          status: "completed"
        }
      }),
      // Agendamentos cancelados
      prisma.appointment.count({
        where: {
          providerId: providerId,
          status: "canceled"
        }
      }),
      // Agendamentos não comparecimento
      prisma.appointment.count({
        where: {
          providerId: providerId,
          status: "no_show"
        }
      })
    ])

    return NextResponse.json({
      publicUrl: provider.publicUrl,
      stats: {
        total,
        completed,
        canceled,
        noShow
      }
    })
  } catch (error) {
    console.error("Erro ao buscar resumo do dashboard:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
