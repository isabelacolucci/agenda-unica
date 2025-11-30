import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { z } from "zod"

const updateAppointmentSchema = z.object({
  status: z.enum(['scheduled', 'completed', 'canceled', 'no_show'])
})

export async function GET(
  request: NextRequest, 
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

    const resolvedParams = await params
    const appointmentId = parseInt(resolvedParams.id)
    
    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "ID do agendamento inválido" },
        { status: 400 }
      )
    }

    // Buscar o provider logado
    const provider = await prisma.provider.findUnique({
      where: { email: session.user.email! }
    })

    if (!provider) {
      return NextResponse.json(
        { error: "Provider não encontrado" },
        { status: 404 }
      )
    }

    // Buscar agendamento
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        providerId: provider.id
      },
      include: {
        service: {
          select: {
            name: true,
            description: true,
            price: true,
            durationMinutes: true
          }
        }
      }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({ appointment })

  } catch (error) {
    console.error("Erro ao buscar agendamento:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest, 
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

    const resolvedParams = await params
    const appointmentId = parseInt(resolvedParams.id)
    
    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "ID do agendamento inválido" },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Validar dados de entrada
    const validationResult = updateAppointmentSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Dados inválidos", 
          details: validationResult.error.issues 
        },
        { status: 400 }
      )
    }

    const { status } = validationResult.data

    // Buscar o provider logado
    const provider = await prisma.provider.findUnique({
      where: { email: session.user.email! }
    })

    if (!provider) {
      return NextResponse.json(
        { error: "Provider não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se o agendamento existe e pertence ao provider
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        providerId: provider.id
      }
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      )
    }

    // Atualizar o agendamento
    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointmentId
      },
      data: {
        status,
        updatedAt: new Date()
      },
      include: {
        service: {
          select: {
            name: true,
            price: true,
            durationMinutes: true
          }
        }
      }
    })

    return NextResponse.json({
      message: "Status do agendamento atualizado com sucesso",
      appointment: updatedAppointment
    })

  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
