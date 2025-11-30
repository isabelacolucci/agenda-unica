import { DashboardLayout } from "@/components/dashboard-layout"
import ScheduleList from "@/components/schedules/schedule-list"

export default function SchedulePage() {
  return (
    <DashboardLayout 
      title="Disponibilidade" 
      subtitle="Gerencie seus horários de atendimento"
      currentPath="/dashboard/schedule"
    >
      <ScheduleList />
    </DashboardLayout>
  )
}
