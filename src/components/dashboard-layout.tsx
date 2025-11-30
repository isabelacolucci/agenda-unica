import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { DashboardLayoutClient } from "./dashboard-layout-client"
import { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  currentPath?: string
}

export async function DashboardLayout({ 
  children, 
  title = "Dashboard",
  subtitle,
  currentPath
}: DashboardLayoutProps) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardLayoutClient
      userName={session.user.name}
      businessName={session.user.businessName}
      title={title}
      subtitle={subtitle}
      currentPath={currentPath}
    >
      {children}
    </DashboardLayoutClient>
  )
}
