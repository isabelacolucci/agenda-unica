"use client"

import { useEffect, useState } from "react"

interface DashboardSummary {
  publicUrl: string
  stats: {
    total: number
    completed: number
    canceled: number
    noShow: number
  }
}

interface UseDashboardSummaryResult {
  data: DashboardSummary | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useDashboardSummary(): UseDashboardSummaryResult {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/dashboard/summary")
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sessão expirada. Faça login novamente.")
        }
        throw new Error("Erro ao carregar dados do dashboard")
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
