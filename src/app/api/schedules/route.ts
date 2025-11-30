import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { scheduleSchema } from "@/lib/validations/schedule"

// GET /api/schedules - Listar todas as disponibilidades do prestador
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        providerId: parseInt(session.user.id)
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    })

    return NextResponse.json(schedules)
  } catch (error) {
    console.error("Erro ao buscar disponibilidades:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST /api/schedules - Criar nova disponibilidade
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = scheduleSchema.parse(body)

    const providerId = parseInt(session.user.id)

    // Verificar se já existe uma disponibilidade que sobrepõe no mesmo dia
    const existingSchedules = await prisma.schedule.findMany({
      where: {
        providerId,
        dayOfWeek: validatedData.dayOfWeek
      }
    })

    const [newStartHour, newStartMin] = validatedData.startTime.split(':').map(Number)
    const [newEndHour, newEndMin] = validatedData.endTime.split(':').map(Number)
    const newStartMinutes = newStartHour * 60 + newStartMin
    const newEndMinutes = newEndHour * 60 + newEndMin

    const hasOverlap = existingSchedules.some(schedule => {
      const [existingStartHour, existingStartMin] = schedule.startTime.split(':').map(Number)
      const [existingEndHour, existingEndMin] = schedule.endTime.split(':').map(Number)
      const existingStartMinutes = existingStartHour * 60 + existingStartMin
      const existingEndMinutes = existingEndHour * 60 + existingEndMin

      // Verifica se há sobreposição
      return (newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes)
    })

    if (hasOverlap) {
      return NextResponse.json(
        { error: "Já existe uma disponibilidade que conflita com este horário no mesmo dia da semana" },
        { status: 400 }
      )
    }

    const schedule = await prisma.schedule.create({
      data: {
        ...validatedData,
        providerId
      }
    })

    return NextResponse.json(schedule, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Dados inválidos", details: error },
        { status: 400 }
      )
    }

    console.error("Erro ao criar disponibilidade:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
