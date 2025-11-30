"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DailySummary } from "@/hooks/use-dashboard-daily-summary"
import { Calendar, TrendingUp } from "lucide-react"

interface AppointmentLineChartCardProps {
  data: DailySummary[]
}

interface TooltipPayload {
  value: number
  dataKey: string
  color: string
  payload?: {
    date: string
    total: number
    completed: number
    canceled: number
    noShow: number
    formattedDate: string
  }
}

interface TooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length && label) {
    // Buscar os dados completos do dia a partir do payload
    const dayData = payload[0]?.payload
    
    // Usar a data original do dayData
    let formattedDate = 'Data inválida'
    if (dayData?.date) {
      try {
        // Criar data a partir da string YYYY-MM-DD
        const [year, month, day] = dayData.date.split('-').map(Number)
        const date = new Date(year, month - 1, day) // month - 1 porque Date usa índice 0-11 para meses
        
        if (!isNaN(date.getTime())) {
          formattedDate = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        }
      } catch (error) {
        console.error('Erro ao formatar data no tooltip:', dayData.date, error)
        formattedDate = `Data: ${dayData.date}`
      }
    }
    
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{formattedDate}</p>
        <div className="space-y-1 text-sm">
          <p className="text-gray-700">
            <span className="font-medium">Total:</span> {dayData?.total || 0}
          </p>
          <p className="text-green-600">
            <span className="font-medium">Concluídos:</span> {dayData?.completed || 0}
          </p>
          <p className="text-yellow-600">
            <span className="font-medium">Cancelados:</span> {dayData?.canceled || 0}
          </p>
          <p className="text-red-600">
            <span className="font-medium">Não compareceu:</span> {dayData?.noShow || 0}
          </p>
        </div>
      </div>
    )
  }

  return null
}

export function AppointmentLineChartCard({ data }: AppointmentLineChartCardProps) {
  // Preparar dados para o gráfico
  const chartData = data.map((item, index) => {
    let formattedDate = 'N/A'
    
    try {
      // Criar data a partir da string YYYY-MM-DD
      const [year, month, day] = item.date.split('-').map(Number)
      const date = new Date(year, month - 1, day) // month - 1 porque Date usa índice 0-11 para meses
      
      if (!isNaN(date.getTime())) {
        formattedDate = date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit'
        })
      }
    } catch (error) {
      console.error('Erro ao formatar data:', item.date, error)
      formattedDate = `D${index + 1}` // Fallback para identificação
    }

    return {
      date: item.date, // Manter a data original como string
      total: item.total,
      completed: item.totalCompleted,
      canceled: item.totalCanceled,
      noShow: item.totalNoShow,
      formattedDate: formattedDate
    }
  })

  const totalAppointments = data.reduce((sum, item) => sum + item.total, 0)
  const averagePerDay = totalAppointments > 0 ? (totalAppointments / 30).toFixed(1) : '0'

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <CardTitle className="text-base sm:text-lg font-semibold">
              Agendamentos dos Últimos 30 Dias
            </CardTitle>
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Média: {averagePerDay}/dia</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="formattedDate"
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip 
                content={<CustomTooltip />}
                labelFormatter={() => ''} // Remove o label padrão para usar apenas nosso tooltip customizado
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Resumo rápido */}
        <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {data.reduce((sum, item) => sum + item.totalCompleted, 0)}
            </p>
            <p className="text-sm text-gray-600">Concluídos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {data.reduce((sum, item) => sum + item.totalCanceled, 0)}
            </p>
            <p className="text-sm text-gray-600">Cancelados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {data.reduce((sum, item) => sum + item.totalNoShow, 0)}
            </p>
            <p className="text-sm text-gray-600">Não compareceu</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
