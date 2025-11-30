"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Phone, Mail, FileText } from "lucide-react"
import Link from "next/link"
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
    price: number
    durationMinutes: number
  }
}

interface AppointmentCardProps {
  appointment: Appointment
  onStatusUpdate: (appointmentId: number, newStatus: string) => void
}

export function AppointmentCard({ appointment, onStatusUpdate }: AppointmentCardProps) {
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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    )
  }

  const handleQuickStatusUpdate = async (newStatus: string) => {
    try {
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

      onStatusUpdate(appointment.id, newStatus)
      toast.success('Status do agendamento atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status do agendamento')
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {appointment.service.name}
            </h3>
            {getStatusBadge(appointment.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>{appointment.clientName}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>{appointment.clientEmail}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>{appointment.clientPhone}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(appointment.date)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>{formatTime(appointment.time)} ({appointment.service.durationMinutes} min)</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">Valor: {formatPrice(appointment.service.price)}</span>
              </div>
            </div>
          </div>

          {appointment.notes && (
            <div className="mb-4">
              <div className="flex items-start text-sm text-gray-600">
                <FileText className="h-4 w-4 mr-2 mt-0.5" />
                <div>
                  <span className="font-medium">Observações:</span>
                  <p className="mt-1">{appointment.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          {appointment.status === 'scheduled' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickStatusUpdate('completed')}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                Concluir
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickStatusUpdate('no_show')}
                className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
              >
                Não compareceu
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickStatusUpdate('canceled')}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Cancelar
              </Button>
            </>
          )}
        </div>

        <Link href={`/dashboard/appointments/${appointment.id}`}>
          <Button variant="outline" size="sm">
            Ver detalhes
          </Button>
        </Link>
      </div>
    </div>
  )
}
