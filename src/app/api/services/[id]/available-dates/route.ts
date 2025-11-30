import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const serviceIdNum = parseInt(id)
    
    if (isNaN(serviceIdNum)) {
      return NextResponse.json(
        { error: "ID do serviço inválido" },
        { status: 400 }
      )
    }

    // Verificar se o serviço existe e está ativo
    const service = await prisma.service.findFirst({
      where: {
        id: serviceIdNum,
        isActive: true
      },
      include: {
        provider: {
          include: {
            schedules: true
          }
        }
      }
    })

    if (!service) {
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 404 }
      )
    }

    // Obter os dias da semana que o prestador atende
    const schedules = service.provider.schedules
    const availableDays = schedules.map(schedule => schedule.dayOfWeek)
    
    // Gerar datas disponíveis para os próximos 30 dias
    const availableDates: string[] = []
    const today = new Date()
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
      
      if (availableDays.includes(dayOfWeek)) {
        availableDates.push(date.toISOString().split('T')[0]) // YYYY-MM-DD format
      }
    }

    return NextResponse.json({ availableDates })
  } catch (error) {
    console.error("Erro ao buscar datas disponíveis:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
