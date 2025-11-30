import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, Calendar } from "lucide-react"

interface BillingCardProps {
  data: {
    previousMonth: number
    currentMonthRealized: number
    currentMonthPredicted: number
    predictionPercentage: number
  }
}

export function BillingCard({ data }: BillingCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const isPositiveTrend = data.predictionPercentage >= 100
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown
  const trendColor = isPositiveTrend ? "text-green-600" : "text-red-600"
  const trendBgColor = isPositiveTrend ? "bg-green-50" : "bg-red-50"

  const billingItems = [
    {
      label: "Mês Anterior",
      value: data.previousMonth,
      icon: Calendar,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      description: "Faturamento realizado",
      formatted: formatCurrency(data.previousMonth)
    },
    {
      label: "Mês Atual (Realizado)",
      value: data.currentMonthRealized,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Já faturado este mês",
      formatted: formatCurrency(data.currentMonthRealized)
    },
    {
      label: "Previsão Mês Atual",
      value: data.currentMonthPredicted,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Faturamento previsto total",
      formatted: formatCurrency(data.currentMonthPredicted)
    },
    {
      label: "Previsão vs Anterior",
      value: data.predictionPercentage,
      icon: TrendIcon,
      color: trendColor,
      bgColor: trendBgColor,
      description: isPositiveTrend ? "Crescimento projetado" : "Redução projetada",
      formatted: formatPercentage(data.predictionPercentage)
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Faturamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {billingItems.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className={`${item.bgColor} rounded-lg p-4 text-center hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-center mb-2">
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className={`text-lg font-bold ${item.color} mb-1`}>
                  {item.formatted}
                </div>
                <div className="text-sm font-medium text-gray-800 mb-1">
                  {item.label}
                </div>
                <div className="text-xs text-gray-600">
                  {item.description}
                </div>
              </div>
            )
          })}
        </div>

        {/* Informação adicional sobre a tendência */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <TrendIcon className={`h-4 w-4 ${trendColor}`} />
            <span className="text-sm text-gray-700">
              {data.previousMonth === 0 ? (
                <>Primeiro mês de operação - sem dados de comparação</>
              ) : isPositiveTrend ? (
                <>Previsão de <strong>crescimento</strong> de {formatPercentage(data.predictionPercentage - 100)} em relação ao mês anterior</>
              ) : (
                <>Previsão de <strong>redução</strong> de {formatPercentage(100 - data.predictionPercentage)} em relação ao mês anterior</>
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
