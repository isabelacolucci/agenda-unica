"use client"

import { SignOutButton } from "@/components/sign-out-button"
import { ReactNode, useState } from "react"
import Link from "next/link"
import { Menu, X, LayoutDashboard, Briefcase, Calendar, ClipboardList, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardLayoutClientProps {
  children: ReactNode
  userName: string
  businessName: string
  title?: string
  subtitle?: string
  currentPath?: string
}

function Navigation({ currentPath }: { currentPath?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', current: currentPath === '/dashboard', icon: LayoutDashboard },
    { name: 'Serviços', href: '/dashboard/services', current: currentPath === '/dashboard/services', icon: Briefcase },
    { name: 'Disponibilidade', href: '/dashboard/schedule', current: currentPath === '/dashboard/schedule', icon: Calendar },
    { name: 'Agendamentos', href: '/dashboard/appointments', current: currentPath === '/dashboard/appointments', icon: ClipboardList },
    { name: 'Configurações', href: '/dashboard/config', current: currentPath === '/dashboard/config', icon: Settings },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  item.current
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Button */}
      <div className="md:hidden bg-card border-b border-border">
        <div className="px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full justify-start"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 mr-2" /> : <Menu className="h-5 w-5 mr-2" />}
            <span>Menu</span>
          </Button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${
                    item.current
                      ? 'bg-accent border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:bg-accent hover:border-border hover:text-foreground'
                  } block pl-3 pr-4 py-3 border-l-4 text-base font-medium transition-colors`}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export function DashboardLayoutClient({ 
  children, 
  userName,
  businessName,
  title = "Dashboard",
  subtitle,
  currentPath
}: DashboardLayoutClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-3 sm:gap-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">{title}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                {subtitle || `Bem-vindo, ${userName}!`}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <span className="text-xs sm:text-sm text-foreground truncate max-w-[150px] sm:max-w-none">
                {businessName}
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      <Navigation currentPath={currentPath} />

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="sm:px-0">
          {children}
        </div>
      </main>
    </div>
  )
}
