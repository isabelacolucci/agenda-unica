import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { appointmentSchema } from "@/lib/validations/appointment"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const date = searchParams.get('date')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

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

    // Construir filtros
    const where: {
      providerId: number
      status?: string
      date?: {
        gte: Date
        lte: Date
      }
    } = {
      providerId: provider.id
    }

    if (status) {
      where.status = status
    }

    if (date) {
      const startDate = new Date(date + 'T00:00:00')
      const endDate = new Date(date + 'T23:59:59')
      where.date = {
        gte: startDate,
        lte: endDate
      }
    }

    // Buscar agendamentos
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        service: {
          select: {
            name: true,
            price: true,
            durationMinutes: true
          }
        }
      },
      orderBy: [
        { date: 'desc' },
        { time: 'desc' }
      ],
      skip,
      take: limit
    })

    // Contar total para paginação
    const total = await prisma.appointment.count({ where })

    return NextResponse.json({
      appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados de entrada
    const validationResult = appointmentSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Dados inválidos", 
          details: validationResult.error.issues 
        },
        { status: 400 }
      )
    }

    const { serviceId, date, time, clientName, clientEmail, clientPhone, notes } = validationResult.data

    // Verificar se o serviço existe e está ativo
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        isActive: true
      },
      include: {
        provider: true
      }
    })

    if (!service) {
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 404 }
      )
    }

    // Validar se a data não é no passado
    const appointmentDate = new Date(date + 'T' + time + ':00')
    const now = new Date()
    
    if (appointmentDate <= now) {
      return NextResponse.json(
        { error: "Não é possível agendar para uma data/horário no passado" },
        { status: 400 }
      )
    }

    // Criar o agendamento
    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date + 'T00:00:00'),
        time,
        status: 'scheduled',
        clientName,
        clientEmail,
        clientPhone,
        notes: notes || null,
        providerId: service.providerId,
        serviceId
      },
      include: {
        service: {
          select: {
            name: true,
            price: true,
            durationMinutes: true
          }
        },
        provider: {
          select: {
            name: true,
            businessName: true,
            phone: true
          }
        }
      }
    })

    return NextResponse.json({
      message: "Agendamento criado com sucesso",
      appointment: {
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        clientName: appointment.clientName,
        clientEmail: appointment.clientEmail,
        clientPhone: appointment.clientPhone,
        notes: appointment.notes,
        service: appointment.service,
        provider: appointment.provider
      }
    }, { status: 201 })

  } catch (error) {
    console.error("Erro ao criar agendamento:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
