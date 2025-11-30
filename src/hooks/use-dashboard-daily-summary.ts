"use client"

import { useEffect, useState } from "react"

export interface DailySummary {
  date: string
  totalCompleted: number
  totalCanceled: number
  totalNoShow: number
  total: number
}

interface UseDashboardDailySummaryResult {
  data: DailySummary[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useDashboardDailySummary(): UseDashboardDailySummaryResult {
  const [data, setData] = useState<DailySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/dashboard/daily-summary")
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sessão expirada. Faça login novamente.")
        }
        throw new Error("Erro ao carregar dados do resumo diário")
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}
