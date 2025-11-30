import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle, XCircle, UserX, Clock } from "lucide-react"

interface AppointmentStatsCardProps {
  stats: {
    total: number
    completed: number
    canceled: number
    noShow: number
  }
}

export function AppointmentStatsCard({ stats }: AppointmentStatsCardProps) {
  const scheduled = stats.total - stats.completed - stats.canceled - stats.noShow

  const statItems = [
    {
      label: "Total",
      value: stats.total,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Todos os agendamentos"
    },
    {
      label: "Agendados",
      value: scheduled,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description: "Aguardando atendimento"
    },
    {
      label: "Concluídos",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Atendimentos realizados"
    },
    {
      label: "Cancelados",
      value: stats.canceled,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Cancelados pelo cliente"
    },
    {
      label: "Não compareceram",
      value: stats.noShow,
      icon: UserX,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      description: "Cliente não compareceu"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Estatísticas de Agendamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {statItems.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className={`${item.bgColor} rounded-lg p-3 sm:p-4 text-center hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-center mb-1.5 sm:mb-2">
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${item.color}`} />
                </div>
                <div className={`text-xl sm:text-2xl font-bold ${item.color} mb-0.5 sm:mb-1`}>
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-800 mb-0.5 sm:mb-1">
                  {item.label}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-600 line-clamp-2">
                  {item.description}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
