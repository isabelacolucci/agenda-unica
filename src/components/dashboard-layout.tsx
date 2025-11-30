import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SignOutButton } from "@/components/sign-out-button"
import { ReactNode } from "react"
import Link from "next/link"

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  currentPath?: string
}

function Navigation({ currentPath }: { currentPath?: string }) {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', current: currentPath === '/dashboard' },
    { name: 'Serviços', href: '/dashboard/services', current: currentPath === '/dashboard/services' },
    { name: 'Disponibilidade', href: '/dashboard/schedule', current: currentPath === '/dashboard/schedule' },
    { name: 'Agendamentos', href: '/dashboard/appointments', current: currentPath === '/dashboard/appointments' },
    { name: 'Configurações', href: '/dashboard/config', current: currentPath === '/dashboard/config' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                item.current
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {subtitle || `Bem-vindo, ${session.user.name}!`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {session.user.businessName}
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      <Navigation currentPath={currentPath} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  )
}
