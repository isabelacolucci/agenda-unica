"use client"

import { useEffect, useState } from "react"

export interface DailyBillingData {
  date: string
  realized: number
  predicted: number
  completed: number
  scheduled: number
  canceled: number
  noShow: number
  totalAppointments: number
}

interface UseBillingDailyResult {
  data: DailyBillingData[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useBillingDaily(): UseBillingDailyResult {
  const [data, setData] = useState<DailyBillingData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/dashboard/billing-daily")
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sessão expirada. Faça login novamente.")
        }
        throw new Error("Erro ao carregar dados de faturamento diário")
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
