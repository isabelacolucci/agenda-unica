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

    // Calcular data de 30 dias atrás
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Buscar agendamentos dos últimos 30 dias agrupados por data e status
    const appointments = await prisma.appointment.findMany({
      where: {
        providerId: providerId,
        date: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        date: true,
        status: true
      }
    })

    // Criar mapa de dados dos últimos 30 dias
    const dailySummaryMap = new Map<string, {
      date: string
      totalCompleted: number
      totalCanceled: number
      totalNoShow: number
      total: number
    }>()

    // Inicializar todos os dias dos últimos 30 dias com zero
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      // Usar formatação local para evitar problemas de timezone
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}` // YYYY-MM-DD
      
      dailySummaryMap.set(dateStr, {
        date: dateStr,
        totalCompleted: 0,
        totalCanceled: 0,
        totalNoShow: 0,
        total: 0
      })
    }

    // Processar agendamentos e contar por data e status
    appointments.forEach(appointment => {
      // Usar formatação local para a data do agendamento também
      const appointmentDate = new Date(appointment.date)
      const year = appointmentDate.getFullYear()
      const month = String(appointmentDate.getMonth() + 1).padStart(2, '0')
      const day = String(appointmentDate.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}` // YYYY-MM-DD
      
      const summary = dailySummaryMap.get(dateStr)
      
      if (summary) {
        summary.total++
        
        switch (appointment.status) {
          case 'completed':
            summary.totalCompleted++
            break
          case 'canceled':
            summary.totalCanceled++
            break
          case 'no_show':
            summary.totalNoShow++
            break
        }
      }
    })

    // Converter mapa para array e ordenar por data (mais antigo primeiro)
    const dailySummary = Array.from(dailySummaryMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json(dailySummary)
  } catch (error) {
    console.error("Erro ao buscar resumo diário do dashboard:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
