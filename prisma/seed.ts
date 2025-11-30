import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Hash the password
  const hashedPassword = await bcrypt.hash('senha@123', 12);

  // Create provider (user)
  const provider = await prisma.provider.create({
    data: {
      name: 'João Silva',
      businessName: 'Salão do João',
      publicUrl: 'joao-silva',
      email: 'joao@mail.com',
      password: hashedPassword,
      phone: '(11) 99999-9999',
      address: 'Rua das Flores, 123 - São Paulo, SP',
    },
  });

  console.log('✅ Provider created:', provider.name);

  // Create services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Corte Masculino',
        description: 'Corte de cabelo masculino tradicional',
        durationMinutes: 30,
        price: 25.00,
        providerId: provider.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Barba',
        description: 'Aparar e modelar barba',
        durationMinutes: 20,
        price: 15.00,
        providerId: provider.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Corte + Barba',
        description: 'Pacote completo: corte de cabelo e barba',
        durationMinutes: 45,
        price: 35.00,
        providerId: provider.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Lavagem',
        description: 'Lavagem e hidratação capilar',
        durationMinutes: 15,
        price: 10.00,
        providerId: provider.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Sobrancelha',
        description: 'Design e aparar sobrancelha',
        durationMinutes: 25,
        price: 20.00,
        providerId: provider.id,
      },
    }),
  ]);

  console.log('✅ Services created:', services.length);

  // Create schedules (Monday to Saturday)
  const schedules = await Promise.all([
    prisma.schedule.create({
      data: {
        dayOfWeek: 'Monday',
        startTime: '08:00',
        endTime: '18:00',
        providerId: provider.id,
      },
    }),
    prisma.schedule.create({
      data: {
        dayOfWeek: 'Tuesday',
        startTime: '08:00',
        endTime: '18:00',
        providerId: provider.id,
      },
    }),
    prisma.schedule.create({
      data: {
        dayOfWeek: 'Wednesday',
        startTime: '08:00',
        endTime: '18:00',
        providerId: provider.id,
      },
    }),
    prisma.schedule.create({
      data: {
        dayOfWeek: 'Thursday',
        startTime: '08:00',
        endTime: '18:00',
        providerId: provider.id,
      },
    }),
    prisma.schedule.create({
      data: {
        dayOfWeek: 'Friday',
        startTime: '08:00',
        endTime: '18:00',
        providerId: provider.id,
      },
    }),
    prisma.schedule.create({
      data: {
        dayOfWeek: 'Saturday',
        startTime: '08:00',
        endTime: '16:00',
        providerId: provider.id,
      },
    }),
  ]);

  console.log('✅ Schedules created:', schedules.length);

  // Generate appointments for current month and previous month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Previous month dates
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const statuses = ['scheduled', 'completed', 'canceled', 'no_show'];
  const times = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  const clientNames = [
    'Maria Santos', 'Pedro Costa', 'Ana Silva', 'Carlos Oliveira', 'Lucia Ferreira',
    'Roberto Lima', 'Patricia Souza', 'Fernando Alves', 'Claudia Rocha', 'Marcos Pereira',
    'Sandra Martins', 'José Ribeiro', 'Monica Dias', 'Antonio Carvalho', 'Helena Gomes'
  ];

  // Create appointments for previous month (15 appointments)
  const previousMonthAppointments = [];
  for (let i = 0; i < 15; i++) {
    const randomDay = Math.floor(Math.random() * 28) + 1; // Days 1-28 to avoid issues with different month lengths
    const appointmentDate = new Date(previousYear, previousMonth, randomDay);
    
    // Skip Sundays (dayOfWeek === 0)
    if (appointmentDate.getDay() === 0) {
      continue;
    }

    const randomService = services[Math.floor(Math.random() * services.length)];
    const randomTime = times[Math.floor(Math.random() * times.length)];
    const randomClient = clientNames[Math.floor(Math.random() * clientNames.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    previousMonthAppointments.push({
      date: appointmentDate,
      time: randomTime,
      status: randomStatus,
      clientName: randomClient,
      clientEmail: `${randomClient.toLowerCase().replace(' ', '.')}@email.com`,
      clientPhone: `(11) 9${Math.floor(Math.random() * 90000000) + 10000000}`,
      notes: i % 3 === 0 ? `Observação para ${randomClient}` : null,
      providerId: provider.id,
      serviceId: randomService.id,
    });
  }

  // Create appointments for current month (20 appointments)
  const currentMonthAppointments = [];
  for (let i = 0; i < 20; i++) {
    const randomDay = Math.floor(Math.random() * 28) + 1; // Days 1-28
    const appointmentDate = new Date(currentYear, currentMonth, randomDay);
    
    // Skip Sundays
    if (appointmentDate.getDay() === 0) {
      continue;
    }

    const randomService = services[Math.floor(Math.random() * services.length)];
    const randomTime = times[Math.floor(Math.random() * times.length)];
    const randomClient = clientNames[Math.floor(Math.random() * clientNames.length)];
    // For current month, more appointments should be 'scheduled'
    const randomStatus = Math.random() < 0.6 ? 'scheduled' : statuses[Math.floor(Math.random() * statuses.length)];

    currentMonthAppointments.push({
      date: appointmentDate,
      time: randomTime,
      status: randomStatus,
      clientName: randomClient,
      clientEmail: `${randomClient.toLowerCase().replace(' ', '.')}@email.com`,
      clientPhone: `(11) 9${Math.floor(Math.random() * 90000000) + 10000000}`,
      notes: i % 4 === 0 ? `Observação para ${randomClient}` : null,
      providerId: provider.id,
      serviceId: randomService.id,
    });
  }

  // Insert all appointments
  const allAppointments = [...previousMonthAppointments, ...currentMonthAppointments];
  
  for (const appointmentData of allAppointments) {
    await prisma.appointment.create({
      data: appointmentData,
    });
  }

  console.log('✅ Appointments created:');
  console.log(`   - Previous month: ${previousMonthAppointments.length}`);
  console.log(`   - Current month: ${currentMonthAppointments.length}`);
  console.log(`   - Total: ${allAppointments.length}`);

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`   - Provider: ${provider.name} (${provider.email})`);
  console.log(`   - Services: ${services.length}`);
  console.log(`   - Schedules: ${schedules.length}`);
  console.log(`   - Appointments: ${allAppointments.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });