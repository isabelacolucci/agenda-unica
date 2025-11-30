import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { updateScheduleSchema } from "@/lib/validations/schedule"

interface RouteParams {
  params: Promise<{ id: string }>
}

// PUT /api/schedules/[id] - Atualizar disponibilidade
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { id } = await params
    const scheduleId = parseInt(id)
    
    if (isNaN(scheduleId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = updateScheduleSchema.parse(body)

    const providerId = parseInt(session.user.id)

    // Verificar se a disponibilidade existe e pertence ao prestador
    const existingSchedule = await prisma.schedule.findFirst({
      where: {
        id: scheduleId,
        providerId
      }
    })

    if (!existingSchedule) {
      return NextResponse.json(
        { error: "Disponibilidade não encontrada" },
        { status: 404 }
      )
    }

    // Se está atualizando horários, verificar sobreposição
    if (validatedData.startTime || validatedData.endTime || validatedData.dayOfWeek) {
      const dayOfWeek = validatedData.dayOfWeek || existingSchedule.dayOfWeek
      const startTime = validatedData.startTime || existingSchedule.startTime
      const endTime = validatedData.endTime || existingSchedule.endTime

      // Validar que endTime > startTime
      const [startHour, startMin] = startTime.split(':').map(Number)
      const [endHour, endMin] = endTime.split(':').map(Number)
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin

      if (endMinutes <= startMinutes) {
        return NextResponse.json(
          { error: "Horário final deve ser posterior ao horário inicial" },
          { status: 400 }
        )
      }

      // Verificar sobreposição com outras disponibilidades
      const conflictingSchedules = await prisma.schedule.findMany({
        where: {
          providerId,
          dayOfWeek,
          id: { not: scheduleId } // Excluir a própria disponibilidade
        }
      })

      const hasOverlap = conflictingSchedules.some(schedule => {
        const [existingStartHour, existingStartMin] = schedule.startTime.split(':').map(Number)
        const [existingEndHour, existingEndMin] = schedule.endTime.split(':').map(Number)
        const existingStartMinutes = existingStartHour * 60 + existingStartMin
        const existingEndMinutes = existingEndHour * 60 + existingEndMin

        return (startMinutes < existingEndMinutes && endMinutes > existingStartMinutes)
      })

      if (hasOverlap) {
        return NextResponse.json(
          { error: "Já existe uma disponibilidade que conflita com este horário no mesmo dia da semana" },
          { status: 400 }
        )
      }
    }

    const updatedSchedule = await prisma.schedule.update({
      where: { id: scheduleId },
      data: validatedData
    })

    return NextResponse.json(updatedSchedule)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Dados inválidos", details: error },
        { status: 400 }
      )
    }

    console.error("Erro ao atualizar disponibilidade:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE /api/schedules/[id] - Excluir disponibilidade
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { id } = await params
    const scheduleId = parseInt(id)
    
    if (isNaN(scheduleId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      )
    }

    const providerId = parseInt(session.user.id)

    // Verificar se a disponibilidade existe e pertence ao prestador
    const existingSchedule = await prisma.schedule.findFirst({
      where: {
        id: scheduleId,
        providerId
      }
    })

    if (!existingSchedule) {
      return NextResponse.json(
        { error: "Disponibilidade não encontrada" },
        { status: 404 }
      )
    }

    await prisma.schedule.delete({
      where: { id: scheduleId }
    })

    return NextResponse.json({ message: "Disponibilidade excluída com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir disponibilidade:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
