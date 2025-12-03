import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanDuplicateAppointments() {
  console.log('🔍 Buscando agendamentos duplicados...')

  // Buscar todos os agendamentos
  const appointments = await prisma.appointment.findMany({
    orderBy: [
      { providerId: 'asc' },
      { date: 'asc' },
      { time: 'asc' },
      { createdAt: 'asc' }
    ]
  })

  const seen = new Map<string, number>()
  const toDelete: number[] = []

  for (const appointment of appointments) {
    const key = `${appointment.providerId}-${appointment.date.toISOString()}-${appointment.time}`
    
    if (seen.has(key)) {
      // Este é um duplicado, marcar para deleção
      toDelete.push(appointment.id)
      console.log(`❌ Duplicado encontrado: ID ${appointment.id} (${appointment.clientName} - ${appointment.date.toISOString().split('T')[0]} ${appointment.time})`)
    } else {
      // Primeira ocorrência, manter
      seen.set(key, appointment.id)
    }
  }

  if (toDelete.length === 0) {
    console.log('✅ Nenhum agendamento duplicado encontrado!')
    return
  }

  console.log(`\n🗑️  Removendo ${toDelete.length} agendamento(s) duplicado(s)...`)
  
  const result = await prisma.appointment.deleteMany({
    where: {
      id: {
        in: toDelete
      }
    }
  })

  console.log(`✅ ${result.count} agendamento(s) removido(s) com sucesso!`)
}

cleanDuplicateAppointments()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
