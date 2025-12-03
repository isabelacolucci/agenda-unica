"use client"

import { useDashboardSummary } from "@/hooks/use-dashboard-summary"
import { useBillingData } from "@/hooks/use-billing-data"
import { useDashboardDailySummary } from "@/hooks/use-dashboard-daily-summary"
import { useBillingDaily } from "@/hooks/use-billing-daily"
import { PublicUrlCard } from "./public-url-card"
import { AppointmentStatsCard } from "./appointment-stats-card"
import { BillingCard } from "./billing-card"
import { AppointmentLineChartCard } from "./appointment-line-chart-card"
import { BillingComparisonChart } from "./billing-comparison-chart"
import { BillingDailyChart } from "./billing-daily-chart"
import { DashboardSkeleton } from "./dashboard-skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle } from "lucide-react"

export function DashboardContent() {
  const { data, loading, error, refetch } = useDashboardSummary()
  const { data: billingData, loading: billingLoading, error: billingError, refetch: refetchBilling } = useBillingData()
  const { data: dailySummaryData, loading: dailySummaryLoading, error: dailySummaryError, refetch: refetchDailySummary } = useDashboardDailySummary()
  const { data: billingDailyData, loading: billingDailyLoading, error: billingDailyError, refetch: refetchBillingDaily } = useBillingDaily()

  const handleRefetch = () => {
    refetch()
    refetchBilling()
    refetchDailySummary()
    refetchBillingDaily()
  }

  if (loading || billingLoading || dailySummaryLoading || billingDailyLoading) {
    return <DashboardSkeleton />
  }

  if (error || billingError || dailySummaryError || billingDailyError) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-8 w-8" />
          <span className="font-medium text-lg">Erro ao carregar dashboard</span>
        </div>
        <p className="text-gray-600 text-center max-w-md">
          {error || billingError || dailySummaryError || billingDailyError}
        </p>
        <Button onClick={handleRefetch} variant="outline" className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4" />
          <span>Tentar novamente</span>
        </Button>
      </div>
    )
  }

  if (!data || !billingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Nenhum dado encontrado</p>
      </div>
    )
  }

  // Calcular totais para passar ao BillingCard
  const dailyTotals = billingDailyData.reduce((acc, day) => ({
    totalCompleted: acc.totalCompleted + day.completed,
    totalScheduled: acc.totalScheduled + day.scheduled,
    totalCanceled: acc.totalCanceled + day.canceled,
    totalNoShow: acc.totalNoShow + day.noShow
  }), { totalCompleted: 0, totalScheduled: 0, totalCanceled: 0, totalNoShow: 0 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button onClick={handleRefetch} variant="outline" size="sm" className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4" />
          <span>Atualizar</span>
        </Button>
      </div>

      {/* Card do Link Público */}
      <PublicUrlCard publicUrl={data.publicUrl} />

      {/* Card de Métricas Financeiras */}
      <BillingCard data={billingData} dailyData={dailyTotals} />

      {/* Card das Estatísticas de Agendamentos */}
      <AppointmentStatsCard stats={data.stats} />

      {/* Gráficos Financeiros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Comparação Mensal */}
        <BillingComparisonChart data={billingData} />

        {/* Gráfico de Evolução Diária */}
        {billingDailyData.length > 0 && (
          <BillingDailyChart data={billingDailyData} />
        )}
      </div>
    </div>
  )
}
