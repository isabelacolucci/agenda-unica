"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Calendar, Clock, User, Phone, Mail, FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

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
    description: string | null
    price: number
    durationMinutes: number
  }
}

interface AppointmentDetailsProps {
  appointmentId: number
}

export function AppointmentDetails({ appointmentId }: AppointmentDetailsProps) {
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/appointments/${appointmentId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Agendamento não encontrado')
          }
          throw new Error('Erro ao carregar agendamento')
        }

        const data = await response.json()
        setAppointment(data.appointment)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchAppointment()
  }, [appointmentId])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    return time.slice(0, 5) // Remove seconds if present
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      scheduled: { label: 'Agendado', className: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Concluído', className: 'bg-green-100 text-green-800' },
      canceled: { label: 'Cancelado', className: 'bg-red-100 text-red-800' },
      no_show: { label: 'Não compareceu', className: 'bg-yellow-100 text-yellow-800' }
    }
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { 
      label: status, 
      className: 'bg-gray-100 text-gray-800' 
    }
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    )
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!appointment) return

    try {
      setUpdating(true)
      
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar status')
      }

      setAppointment({ ...appointment, status: newStatus as Appointment['status'] })
      toast.success('Status do agendamento atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status do agendamento')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando agendamento...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <h3 className="text-lg font-medium">Erro</h3>
          <p className="text-sm">{error}</p>
        </div>
        <div className="space-x-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
          >
            Voltar
          </Button>
          <Button
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Agendamento não encontrado</h3>
        <p className="text-sm text-gray-600 mt-1">O agendamento solicitado não existe ou foi removido.</p>
        <Link href="/dashboard/appointments">
          <Button className="mt-4" variant="outline">
            Voltar para agendamentos
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/dashboard/appointments"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para agendamentos
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Agendamento #{appointment.id}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Detalhes completos do agendamento
            </p>
          </div>
          {getStatusBadge(appointment.status)}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informações do Cliente
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">{appointment.clientName}</p>
                <p className="text-xs text-gray-500">Nome</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">{appointment.clientEmail}</p>
                <p className="text-xs text-gray-500">E-mail</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">{appointment.clientPhone}</p>
                <p className="text-xs text-gray-500">Telefone</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informações do Serviço
          </h2>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{appointment.service.name}</p>
              <p className="text-xs text-gray-500">Serviço</p>
            </div>
            
            {appointment.service.description && (
              <div>
                <p className="text-sm text-gray-700">{appointment.service.description}</p>
                <p className="text-xs text-gray-500">Descrição</p>
              </div>
            )}
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">{appointment.service.durationMinutes} minutos</p>
                <p className="text-xs text-gray-500">Duração</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-900">{formatPrice(appointment.service.price)}</p>
              <p className="text-xs text-gray-500">Valor</p>
            </div>
          </div>
        </div>

        {/* Appointment Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Detalhes do Agendamento
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">{formatDate(appointment.date)}</p>
                <p className="text-xs text-gray-500">Data</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">{formatTime(appointment.time)}</p>
                <p className="text-xs text-gray-500">Horário</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes and Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Observações e Ações
          </h2>
          
          {appointment.notes ? (
            <div className="mb-6">
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">{appointment.notes}</p>
                  <p className="text-xs text-gray-500 mt-1">Observações do cliente</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-6">Nenhuma observação adicionada.</p>
          )}

          {/* Status Update Actions */}
          {appointment.status === 'scheduled' && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-900">Alterar status:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={updating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Marcar como Concluído
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate('no_show')}
                  disabled={updating}
                  className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                >
                  Cliente não compareceu
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate('canceled')}
                  disabled={updating}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Cancelar agendamento
                </Button>
              </div>
            </div>
          )}

          {appointment.status !== 'scheduled' && (
            <div>
              <p className="text-sm text-gray-500">
                Este agendamento já foi finalizado e não pode ser alterado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
