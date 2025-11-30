"use client"

import { useDashboardSummary } from "@/hooks/use-dashboard-summary"
import { useBillingData } from "@/hooks/use-billing-data"
import { useDashboardDailySummary } from "@/hooks/use-dashboard-daily-summary"
import { PublicUrlCard } from "./public-url-card"
import { AppointmentStatsCard } from "./appointment-stats-card"
import { BillingCard } from "./billing-card"
import { AppointmentLineChartCard } from "./appointment-line-chart-card"
import { DashboardSkeleton } from "./dashboard-skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle } from "lucide-react"

export function DashboardContent() {
  const { data, loading, error, refetch } = useDashboardSummary()
  const { data: billingData, loading: billingLoading, error: billingError, refetch: refetchBilling } = useBillingData()
  const { data: dailySummaryData, loading: dailySummaryLoading, error: dailySummaryError, refetch: refetchDailySummary } = useDashboardDailySummary()

  const handleRefetch = () => {
    refetch()
    refetchBilling()
    refetchDailySummary()
  }

  if (loading || billingLoading || dailySummaryLoading) {
    return <DashboardSkeleton />
  }

  if (error || billingError || dailySummaryError) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-8 w-8" />
          <span className="font-medium text-lg">Erro ao carregar dashboard</span>
        </div>
        <p className="text-gray-600 text-center max-w-md">{error || billingError || dailySummaryError}</p>
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

      {/* Card de Faturamento */}
      <BillingCard data={billingData} />

      {/* Card das Estatísticas */}
      <AppointmentStatsCard stats={data.stats} />

      {/* Card do Gráfico de Agendamentos dos Últimos 30 Dias */}
      {dailySummaryData && (
        <AppointmentLineChartCard data={dailySummaryData} />
      )}
    </div>
  )
}
