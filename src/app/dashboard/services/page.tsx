import { DashboardLayout } from "@/components/dashboard-layout"
import { ServicesList } from "@/components/services/services-list"

export default async function ServicesPage() {
  return (
    <DashboardLayout 
      title="Serviços" 
      subtitle="Gerencie os serviços oferecidos"
      currentPath="/dashboard/services"
    >
      <ServicesList />
    </DashboardLayout>
  )
}
