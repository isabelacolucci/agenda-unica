"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"

interface BillingComparisonChartProps {
  data: {
    previousMonth: number
    currentMonthRealized: number
    currentMonthPredicted: number
    predictionPercentage: number
  }
}

interface TooltipPayload {
  value: number
  dataKey: string
  name: string
  color: string
}

interface TooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    }

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export function BillingComparisonChart({ data }: BillingComparisonChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const chartData = [
    {
      name: 'Mês Anterior',
      'Faturado': data.previousMonth,
    },
    {
      name: 'Mês Atual',
      'Realizado': data.currentMonthRealized,
      'Previsto': data.currentMonthPredicted,
    }
  ]

  // Calcular diferença e percentual
  const difference = data.currentMonthPredicted - data.previousMonth
  const isPositive = difference >= 0
  const percentageChange = data.previousMonth > 0 
    ? ((difference / data.previousMonth) * 100).toFixed(1)
    : '0'

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg font-semibold">
              Comparativo de Faturamento
            </CardTitle>
          </div>
          <div className={`flex items-center space-x-2 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>
              {isPositive ? '+' : ''}{percentageChange}% vs mês anterior
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 12 }}
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
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Bar 
                dataKey="Faturado" 
                fill="#6b7280" 
                radius={[8, 8, 0, 0]}
                maxBarSize={80}
              />
              <Bar 
                dataKey="Realizado" 
                fill="#3b82f6" 
                radius={[8, 8, 0, 0]}
                maxBarSize={80}
              />
              <Bar 
                dataKey="Previsto" 
                fill="#8b5cf6" 
                radius={[8, 8, 0, 0]}
                maxBarSize={80}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resumo de valores */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Mês Anterior</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(data.previousMonth)}
            </p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">Mês Atual (Realizado)</p>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(data.currentMonthRealized)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {data.previousMonth > 0 
                ? `${((data.currentMonthRealized / data.previousMonth) * 100).toFixed(0)}% do mês anterior`
                : 'Primeiro mês'
              }
            </p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-600 mb-1">Previsão Total</p>
            <p className="text-xl font-bold text-purple-600">
              {formatCurrency(data.currentMonthPredicted)}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              {formatCurrency(data.currentMonthPredicted - data.currentMonthRealized)} restante
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
