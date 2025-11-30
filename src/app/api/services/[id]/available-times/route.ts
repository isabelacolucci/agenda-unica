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

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    
    if (!dateParam) {
      return NextResponse.json(
        { error: "Data é obrigatória" },
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

    // Verificar qual dia da semana é a data selecionada
    const selectedDate = new Date(dateParam + 'T00:00:00')
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
    
    // Encontrar os horários de funcionamento para este dia
    const daySchedules = service.provider.schedules.filter(
      schedule => schedule.dayOfWeek === dayOfWeek
    )

    if (daySchedules.length === 0) {
      return NextResponse.json({ availableTimes: [] })
    }

    // Gerar horários disponíveis baseado nos turnos de trabalho
    const availableTimes: string[] = []
    
    for (const schedule of daySchedules) {
      const startTime = schedule.startTime
      const endTime = schedule.endTime
      
      // Gerar horários de 30 em 30 minutos
      const start = timeToMinutes(startTime)
      const end = timeToMinutes(endTime)
      
      for (let minutes = start; minutes < end; minutes += 30) {
        const timeString = minutesToTime(minutes)
        availableTimes.push(timeString)
      }
    }

    // Remover horários duplicados e ordenar
    const uniqueTimes = [...new Set(availableTimes)].sort()

    return NextResponse.json({ availableTimes: uniqueTimes })
  } catch (error) {
    console.error("Erro ao buscar horários disponíveis:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// Função auxiliar para converter horário em minutos
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Função auxiliar para converter minutos em horário
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}
