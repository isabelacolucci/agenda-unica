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

    // Calcular datas
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    // Mês anterior
    let previousMonthYear = currentYear
    let previousMonth = currentMonth - 1
    if (previousMonth < 0) {
      previousMonth = 11
      previousMonthYear = currentYear - 1
    }
    
    const previousMonthStart = new Date(previousMonthYear, previousMonth, 1)
    const previousMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999)

    // Mês atual
    const currentMonthStart = new Date(currentYear, currentMonth, 1)
    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999)

    // Buscar agendamentos com seus serviços
    const [previousMonthCompleted, currentMonthCompleted, currentMonthScheduled] = await Promise.all([
      // Faturamento mês anterior (apenas completed)
      prisma.appointment.findMany({
        where: {
          providerId: providerId,
          status: "completed",
          date: {
            gte: previousMonthStart,
            lte: previousMonthEnd
          }
        },
        include: {
          service: {
            select: {
              price: true
            }
          }
        }
      }),
      // Faturamento mês atual realizado (apenas completed)
      prisma.appointment.findMany({
        where: {
          providerId: providerId,
          status: "completed",
          date: {
            gte: currentMonthStart,
            lte: currentMonthEnd
          }
        },
        include: {
          service: {
            select: {
              price: true
            }
          }
        }
      }),
      // Faturamento previsto mês atual (scheduled + completed)
      prisma.appointment.findMany({
        where: {
          providerId: providerId,
          status: {
            in: ["scheduled", "completed"]
          },
          date: {
            gte: currentMonthStart,
            lte: currentMonthEnd
          }
        },
        include: {
          service: {
            select: {
              price: true
            }
          }
        }
      })
    ])

    // Calcular valores
    const previousMonthBilling = previousMonthCompleted.reduce((sum, appointment) => {
      return sum + appointment.service.price
    }, 0)

    const currentMonthRealizedBilling = currentMonthCompleted.reduce((sum, appointment) => {
      return sum + appointment.service.price
    }, 0)

    const currentMonthPredictedBilling = currentMonthScheduled.reduce((sum, appointment) => {
      return sum + appointment.service.price
    }, 0)

    // Calcular porcentagem de previsão
    let predictionPercentage = 0
    if (previousMonthBilling > 0) {
      predictionPercentage = (currentMonthPredictedBilling / previousMonthBilling) * 100
    }

    return NextResponse.json({
      previousMonth: previousMonthBilling,
      currentMonthRealized: currentMonthRealizedBilling,
      currentMonthPredicted: currentMonthPredictedBilling,
      predictionPercentage: predictionPercentage
    })
  } catch (error) {
    console.error("Erro ao buscar dados de faturamento:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
