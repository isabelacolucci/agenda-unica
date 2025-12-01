"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { DailyBillingData } from "@/hooks/use-billing-daily"
import { TrendingUp, DollarSign } from "lucide-react"

interface BillingDailyChartProps {
  data: DailyBillingData[]
}

interface TooltipPayload {
  value: number
  dataKey: string
  name: string
  color: string
  payload?: {
    date: string
    realized: number
    predicted: number
    formattedDate: string
    completed: number
    scheduled: number
  }
}

interface TooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    }

    const dayData = payload[0]?.payload

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{dayData?.formattedDate}</p>
        <div className="space-y-1.5">
          <p className="text-sm">
            <span className="font-medium text-blue-600">Realizado:</span>{' '}
            <span className="text-blue-600">{formatCurrency(dayData?.realized || 0)}</span>
            {(dayData?.completed ?? 0) > 0 && (
              <span className="text-xs text-gray-500 ml-1">
                ({dayData?.completed} {dayData?.completed === 1 ? 'agendamento' : 'agendamentos'})
              </span>
            )}
          </p>
          <p className="text-sm">
            <span className="font-medium text-purple-600">Previsto:</span>{' '}
            <span className="text-purple-600">{formatCurrency(dayData?.predicted || 0)}</span>
            {(dayData?.scheduled ?? 0) > 0 && (
              <span className="text-xs text-gray-500 ml-1">
                (+{dayData?.scheduled} agendado{dayData?.scheduled && dayData.scheduled > 1 ? 's' : ''})
              </span>
            )}
          </p>
          {dayData && dayData.predicted > dayData.realized && (
            <p className="text-xs text-gray-600 pt-1 border-t">
              Potencial: {formatCurrency(dayData.predicted - dayData.realized)}
            </p>
          )}
        </div>
      </div>
    )
  }
  return null
}

export function BillingDailyChart({ data }: BillingDailyChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  // Preparar dados para o gráfico
  const chartData = data.map((item, index) => {
    let formattedDate = 'N/A'
    
    try {
      const [year, month, day] = item.date.split('-').map(Number)
      const date = new Date(year, month - 1, day)
      
      if (!isNaN(date.getTime())) {
        formattedDate = date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit'
        })
      }
    } catch (error) {
      console.error('Erro ao formatar data:', item.date, error)
      formattedDate = `D${index + 1}`
    }

    return {
      date: item.date,
      realized: item.realized,
      predicted: item.predicted,
      formattedDate: formattedDate,
      completed: item.completed,
      scheduled: item.scheduled
    }
  })

  // Calcular totais e métricas
  const totalRealized = data.reduce((sum, item) => sum + item.realized, 0)
  const totalPredicted = data.reduce((sum, item) => sum + item.predicted, 0)
  const totalCompleted = data.reduce((sum, item) => sum + item.completed, 0)
  const averagePerDay = totalRealized > 0 ? (totalRealized / 30) : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg font-semibold">
              Evolução do Faturamento (30 dias)
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>Média: {formatCurrency(averagePerDay)}/dia</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorRealized" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="formattedDate"
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `R$ ${(value / 1000).toFixed(1)}k`
                  }
                  return `R$ ${value}`
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '10px' }}
                iconType="circle"
              />
              <Area
                type="monotone"
                dataKey="predicted"
                name="Previsto"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#colorPredicted)"
              />
              <Area
                type="monotone"
                dataKey="realized"
                name="Realizado"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorRealized)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Resumo de valores */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalRealized)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Realizado</p>
            <p className="text-xs text-gray-500">{totalCompleted} agendamentos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalPredicted)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Previsto</p>
            <p className="text-xs text-gray-500">
              {data.reduce((sum, item) => sum + item.completed + item.scheduled, 0)} total
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPredicted - totalRealized)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Potencial</p>
            <p className="text-xs text-gray-500">
              {data.reduce((sum, item) => sum + item.scheduled, 0)} agendados
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {totalCompleted > 0 ? formatCurrency(totalRealized / totalCompleted) : 'R$ 0'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Ticket Médio</p>
            <p className="text-xs text-gray-500">por atendimento</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
