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

    // Verificar se o prestador existe
    const provider = await prisma.provider.findUnique({
      where: {
        id: providerId
      }
    })

    if (!provider) {
      return NextResponse.json(
        { error: "Prestador não encontrado" },
        { status: 404 }
      )
    }

    // Calcular datas - últimos 30 dias
    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 29) // 30 dias incluindo hoje
    startDate.setHours(0, 0, 0, 0)

    // Buscar todos os agendamentos do período
    const appointments = await prisma.appointment.findMany({
      where: {
        providerId: providerId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        service: {
          select: {
            price: true,
            name: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Agrupar por dia
    const dailyData = new Map<string, {
      date: string
      realized: number
      predicted: number
      completed: number
      scheduled: number
      canceled: number
      noShow: number
      totalAppointments: number
    }>()

    // Inicializar todos os dias com zero
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateKey = date.toISOString().split('T')[0]
      
      dailyData.set(dateKey, {
        date: dateKey,
        realized: 0,
        predicted: 0,
        completed: 0,
        scheduled: 0,
        canceled: 0,
        noShow: 0,
        totalAppointments: 0
      })
    }

    // Processar agendamentos
    appointments.forEach(appointment => {
      const dateKey = appointment.date.toISOString().split('T')[0]
      const dayData = dailyData.get(dateKey)
      
      if (dayData) {
        const price = appointment.service.price
        
        dayData.totalAppointments++
        
        if (appointment.status === 'completed') {
          dayData.realized += price
          dayData.predicted += price
          dayData.completed++
        } else if (appointment.status === 'scheduled') {
          dayData.predicted += price
          dayData.scheduled++
        } else if (appointment.status === 'canceled') {
          dayData.canceled++
        } else if (appointment.status === 'no_show') {
          dayData.noShow++
        }
      }
    })

    // Converter para array
    const result = Array.from(dailyData.values())

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao buscar dados de faturamento diário:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
