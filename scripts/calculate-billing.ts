import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function calculateBilling() {
  console.log('📊 Calculando métricas de faturamento...\n');

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Mês anterior
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Data inicial e final do mês anterior
  const previousMonthStart = new Date(previousYear, previousMonth, 1);
  const previousMonthEnd = new Date(previousYear, previousMonth + 1, 0, 23, 59, 59);

  // Data inicial e final do mês atual
  const currentMonthStart = new Date(currentYear, currentMonth, 1);
  const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

  // Buscar agendamentos do mês anterior
  const previousMonthAppointments = await prisma.appointment.findMany({
    where: {
      date: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
    include: {
      service: true,
    },
  });

  // Buscar agendamentos do mês atual
  const currentMonthAppointments = await prisma.appointment.findMany({
    where: {
      date: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
    include: {
      service: true,
    },
  });

  // Calcular faturamento do mês anterior (apenas agendamentos completados)
  const previousMonthBilling = previousMonthAppointments
    .filter(appointment => appointment.status === 'completed')
    .reduce((total, appointment) => total + appointment.service.price, 0);

  // Calcular faturamento atual (apenas agendamentos completados)
  const currentMonthBillingRealized = currentMonthAppointments
    .filter(appointment => appointment.status === 'completed')
    .reduce((total, appointment) => total + appointment.service.price, 0);

  // Calcular faturamento previsto para o mês atual (todos os agendamentos não cancelados e não no_show)
  const currentMonthBillingPredicted = currentMonthAppointments
    .filter(appointment => appointment.status === 'scheduled' || appointment.status === 'completed')
    .reduce((total, appointment) => total + appointment.service.price, 0);

  // Calcular porcentagem de crescimento (baseado no faturamento realizado vs mês anterior)
  const growthPercentage = previousMonthBilling > 0 
    ? ((currentMonthBillingRealized - previousMonthBilling) / previousMonthBilling) * 100
    : 0;

  // Calcular porcentagem de crescimento previsto (baseado no faturamento previsto vs mês anterior)
  const predictedGrowthPercentage = previousMonthBilling > 0 
    ? ((currentMonthBillingPredicted - previousMonthBilling) / previousMonthBilling) * 100
    : 0;

  // Relatório detalhado
  console.log('📅 RELATÓRIO DE FATURAMENTO');
  console.log('=' .repeat(50));
  
  console.log(`\n📊 MÊS ANTERIOR (${getMonthName(previousMonth)}/${previousYear}):`);
  console.log(`   Agendamentos totais: ${previousMonthAppointments.length}`);
  console.log(`   Agendamentos completados: ${previousMonthAppointments.filter(a => a.status === 'completed').length}`);
  console.log(`   Faturamento realizado: R$ ${previousMonthBilling.toFixed(2)}`);

  console.log(`\n📊 MÊS ATUAL (${getMonthName(currentMonth)}/${currentYear}):`);
  console.log(`   Agendamentos totais: ${currentMonthAppointments.length}`);
  console.log(`   Agendamentos completados: ${currentMonthAppointments.filter(a => a.status === 'completed').length}`);
  console.log(`   Agendamentos agendados: ${currentMonthAppointments.filter(a => a.status === 'scheduled').length}`);
  console.log(`   Faturamento realizado: R$ ${currentMonthBillingRealized.toFixed(2)}`);
  console.log(`   Faturamento previsto: R$ ${currentMonthBillingPredicted.toFixed(2)}`);

  console.log(`\n📈 CRESCIMENTO:`);
  console.log(`   Crescimento realizado: ${growthPercentage > 0 ? '+' : ''}${growthPercentage.toFixed(1)}%`);
  console.log(`   Crescimento previsto: ${predictedGrowthPercentage > 0 ? '+' : ''}${predictedGrowthPercentage.toFixed(1)}%`);

  // Breakdown por status
  console.log(`\n📋 BREAKDOWN POR STATUS (Mês Atual):`);
  const statusBreakdown = currentMonthAppointments.reduce((acc, appointment) => {
    const status = appointment.status;
    if (!acc[status]) {
      acc[status] = { count: 0, revenue: 0 };
    }
    acc[status].count++;
    acc[status].revenue += appointment.service.price;
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  Object.entries(statusBreakdown).forEach(([status, data]) => {
    const statusName = getStatusName(status);
    console.log(`   ${statusName}: ${data.count} agendamentos - R$ ${data.revenue.toFixed(2)}`);
  });

  // Breakdown por serviço (mês atual)
  console.log(`\n💼 BREAKDOWN POR SERVIÇO (Mês Atual):`);
  const serviceBreakdown = currentMonthAppointments.reduce((acc, appointment) => {
    const serviceName = appointment.service.name;
    if (!acc[serviceName]) {
      acc[serviceName] = { count: 0, revenue: 0, price: appointment.service.price };
    }
    acc[serviceName].count++;
    if (appointment.status === 'completed' || appointment.status === 'scheduled') {
      acc[serviceName].revenue += appointment.service.price;
    }
    return acc;
  }, {} as Record<string, { count: number; revenue: number; price: number }>);

  Object.entries(serviceBreakdown)
    .sort(([,a], [,b]) => b.revenue - a.revenue)
    .forEach(([serviceName, data]) => {
      console.log(`   ${serviceName}: ${data.count} agendamentos - R$ ${data.revenue.toFixed(2)} (R$ ${data.price.toFixed(2)}/serviço)`);
    });

  console.log('\n🎯 RESUMO EXECUTIVO:');
  console.log('=' .repeat(50));
  console.log(`💰 Faturamento mês anterior: R$ ${previousMonthBilling.toFixed(2)}`);
  console.log(`💰 Faturamento atual (realizado): R$ ${currentMonthBillingRealized.toFixed(2)}`);
  console.log(`💰 Faturamento previsto (mês atual): R$ ${currentMonthBillingPredicted.toFixed(2)}`);
  console.log(`📈 Crescimento realizado: ${growthPercentage > 0 ? '+' : ''}${growthPercentage.toFixed(1)}%`);
  console.log(`📈 Crescimento previsto: ${predictedGrowthPercentage > 0 ? '+' : ''}${predictedGrowthPercentage.toFixed(1)}%`);
}

function getMonthName(month: number): string {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[month];
}

function getStatusName(status: string): string {
  const statusNames: Record<string, string> = {
    'scheduled': 'Agendado',
    'completed': 'Completado',
    'canceled': 'Cancelado',
    'no_show': 'Não compareceu'
  };
  return statusNames[status] || status;
}

main()
  .catch((e) => {
    console.error('❌ Erro ao calcular faturamento:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function main() {
  await calculateBilling();
}
