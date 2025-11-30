import { DashboardLayout } from "@/components/dashboard-layout"
import { AppointmentsList } from "@/components/appointments/appointments-list"

export default async function AppointmentsPage() {
  return (
    <DashboardLayout 
      currentPath="/dashboard/appointments"
      title="Agendamentos"
      subtitle="Gerencie todos os seus agendamentos"
    >
      <AppointmentsList />
    </DashboardLayout>
  )
}
