import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  return (
    <DashboardLayout currentPath="/dashboard">
      <DashboardContent />
    </DashboardLayout>
  )
}
