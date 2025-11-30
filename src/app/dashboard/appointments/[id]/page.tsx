import { DashboardLayout } from "@/components/dashboard-layout"
import { AppointmentDetails } from "@/components/appointments/appointment-details"
import { notFound } from "next/navigation"

interface AppointmentPageProps {
  params: {
    id: string
  }
}

export default async function AppointmentPage({ params }: AppointmentPageProps) {
  const id = parseInt(params.id)
  
  if (isNaN(id)) {
    notFound()
  }

  return (
    <DashboardLayout 
      currentPath="/dashboard/appointments"
      title="Detalhes do Agendamento"
      subtitle="Visualize e gerencie o agendamento"
    >
      <AppointmentDetails appointmentId={id} />
    </DashboardLayout>
  )
}
