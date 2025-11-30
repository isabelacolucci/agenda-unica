import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addMoreAppointments() {
  // Buscar o provider de teste
  const testProvider = await prisma.provider.findFirst({
    where: { email: 'test@example.com' }
  })

  if (!testProvider) {
    console.log('Provider de teste não encontrado')
    return
  }

  // Buscar os serviços
  const services = await prisma.service.findMany({
    where: { providerId: testProvider.id }
  })

  if (services.length === 0) {
    console.log('Nenhum serviço encontrado')
    return
  }

  // Criar datas variadas
  const today = new Date()
  const dates = []
  
  // Adicionar algumas datas passadas e futuras
  for (let i = -10; i <= 10; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date)
  }

  const clients = [
    { name: 'João Silva', email: 'joao@example.com', phone: '(11) 99999-1001' },
    { name: 'Maria Santos', email: 'maria.santos@example.com', phone: '(11) 99999-1002' },
    { name: 'Pedro Costa', email: 'pedro.costa@example.com', phone: '(11) 99999-1003' },
    { name: 'Ana Oliveira', email: 'ana.oliveira@example.com', phone: '(11) 99999-1004' },
    { name: 'Carlos Ferreira', email: 'carlos.f@example.com', phone: '(11) 99999-1005' },
    { name: 'Lucia Martins', email: 'lucia.m@example.com', phone: '(11) 99999-1006' },
    { name: 'Roberto Souza', email: 'roberto.s@example.com', phone: '(11) 99999-1007' },
    { name: 'Fernanda Lima', email: 'fernanda.l@example.com', phone: '(11) 99999-1008' }
  ]

  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

  // Criar 20 agendamentos aleatórios
  const appointmentsToCreate = []
  for (let i = 0; i < 20; i++) {
    const randomDate = dates[Math.floor(Math.random() * dates.length)]
    const randomClient = clients[Math.floor(Math.random() * clients.length)]
    const randomService = services[Math.floor(Math.random() * services.length)]
    const randomTime = times[Math.floor(Math.random() * times.length)]
    
    // Status baseado na data (passado = maior chance de completed/no_show/canceled)
    let status = 'scheduled'
    if (randomDate < today) {
      const pastStatuses = ['completed', 'completed', 'completed', 'no_show', 'canceled'] // mais completed
      status = pastStatuses[Math.floor(Math.random() * pastStatuses.length)]
    } else {
      const futureStatuses = ['scheduled', 'scheduled', 'scheduled', 'canceled'] // mais scheduled
      status = futureStatuses[Math.floor(Math.random() * futureStatuses.length)]
    }

    appointmentsToCreate.push({
      date: randomDate,
      time: randomTime,
      status,
      clientName: randomClient.name,
      clientEmail: randomClient.email,
      clientPhone: randomClient.phone,
      notes: Math.random() > 0.5 ? `Agendamento ${i + 1} - ${status}` : null,
      providerId: testProvider.id,
      serviceId: randomService.id,
    })
  }

  // Verificar se já existem muitos agendamentos
  const existingCount = await prisma.appointment.count({
    where: { providerId: testProvider.id }
  })

  console.log(`Agendamentos existentes: ${existingCount}`)

  if (existingCount < 10) {
    const created = await prisma.appointment.createMany({
      data: appointmentsToCreate
    })
    console.log(`${created.count} novos agendamentos criados!`)
  } else {
    console.log('Já existem agendamentos suficientes para teste')
  }

  // Mostrar estatísticas atuais
  const [total, completed, canceled, noShow, scheduled] = await Promise.all([
    prisma.appointment.count({ where: { providerId: testProvider.id } }),
    prisma.appointment.count({ where: { providerId: testProvider.id, status: 'completed' } }),
    prisma.appointment.count({ where: { providerId: testProvider.id, status: 'canceled' } }),
    prisma.appointment.count({ where: { providerId: testProvider.id, status: 'no_show' } }),
    prisma.appointment.count({ where: { providerId: testProvider.id, status: 'scheduled' } })
  ])

  console.log('\n=== Estatísticas Atuais ===')
  console.log(`Total: ${total}`)
  console.log(`Agendados: ${scheduled}`)
  console.log(`Concluídos: ${completed}`)
  console.log(`Cancelados: ${canceled}`)
  console.log(`Não compareceram: ${noShow}`)
}

addMoreAppointments()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
