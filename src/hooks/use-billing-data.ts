"use client"

import { useEffect, useState } from "react"

interface BillingData {
  previousMonth: number
  currentMonthRealized: number
  currentMonthPredicted: number
  predictionPercentage: number
}

interface UseBillingDataResult {
  data: BillingData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useBillingData(): UseBillingDataResult {
  const [data, setData] = useState<BillingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/dashboard/billing")
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sessão expirada. Faça login novamente.")
        }
        throw new Error("Erro ao carregar dados de faturamento")
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
