import { DashboardLayout } from "@/components/dashboard-layout"
import ConfigForm from "@/components/config/config-form"
import UpdatePasswordForm from "@/components/config/update-password-form"

export default function ConfigPage() {
  return (
    <DashboardLayout 
      title="Configurações" 
      subtitle="Gerencie suas informações pessoais e do negócio"
      currentPath="/dashboard/config"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ConfigForm />
          <UpdatePasswordForm />
        </div>
      </div>
    </DashboardLayout>
  )
}
