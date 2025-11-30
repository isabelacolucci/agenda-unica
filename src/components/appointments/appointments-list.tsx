"use client"

import { AppointmentCard } from "@/components/appointments/appointment-card"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useCallback } from "react"
import { Calendar, ClipboardList, AlertCircle, Filter } from "lucide-react"

interface Appointment {
  id: number
  date: Date
  time: string
  status: 'scheduled' | 'completed' | 'canceled' | 'no_show'
  clientName: string
  clientEmail: string
  clientPhone: string
  notes: string | null
  service: {
    name: string
    price: number
    durationMinutes: number
  }
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [filters, setFilters] = useState({
    status: '',
    date: ''
  })

  const fetchAppointments = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      })

      if (filters.status) {
        params.append('status', filters.status)
      }

      if (filters.date) {
        params.append('date', filters.date)
      }

      const response = await fetch(`/api/appointments?${params}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar agendamentos')
      }

      const data = await response.json()
      setAppointments(data.appointments)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [filters.status, filters.date, pagination.limit])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const handleStatusUpdate = (appointmentId: number, newStatus: string) => {
    setAppointments(prevAppointments => 
      prevAppointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: newStatus as Appointment['status'] }
          : appointment
      )
    )
  }

  const handleFilterChange = (filterType: 'status' | 'date', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    fetchAppointments(newPage)
  }

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Carregando agendamentos...</h3>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Erro ao carregar agendamentos</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <Button 
            onClick={() => fetchAppointments()} 
            className="mt-4"
            variant="outline"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm text-gray-600">Status:</label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="">Todos</option>
              <option value="scheduled">Agendado</option>
              <option value="completed">Concluído</option>
              <option value="canceled">Cancelado</option>
              <option value="no_show">Não compareceu</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="date-filter" className="text-sm text-gray-600">Data:</label>
            <input
              id="date-filter"
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            />
          </div>

          {(filters.status || filters.date) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ status: '', date: '' })}
            >
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Lista de agendamentos */}
      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhum agendamento encontrado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filters.status || filters.date 
              ? 'Nenhum agendamento corresponde aos filtros aplicados.'
              : 'Quando você receber agendamentos, eles aparecerão aqui.'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Mostrando {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)} até{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} agendamentos
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-700">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
