"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { appointmentSchema, type AppointmentInput } from "@/lib/validations/appointment"
import { formatPhoneNumber, cleanPhoneNumber } from "@/lib/utils"
import { toast } from "react-toastify"
import { Calendar, Clock, DollarSign, User } from "lucide-react"

interface Service {
  id: number
  name: string
  description?: string
  durationMinutes: number
  price: number
  provider: {
    id: number
    name: string
    businessName: string
  }
}

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  service: Service
  selectedDate: string
  selectedTime: string
  onSuccess: () => void
}

export function AppointmentModal({
  isOpen,
  onClose,
  service,
  selectedDate,
  selectedTime,
  onSuccess
}: AppointmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      serviceId: service.id,
      date: selectedDate,
      time: selectedTime,
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      notes: ""
    }
  })

  const onSubmit = async (data: AppointmentInput) => {
    try {
      setIsSubmitting(true)

      // Remover a máscara do telefone antes de enviar
      const dataToSend = {
        ...data,
        clientPhone: cleanPhoneNumber(data.clientPhone)
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar agendamento')
      }

      await response.json()
      
      toast.success('Agendamento criado com sucesso!')
      reset()
      onSuccess()
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao criar agendamento')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}min`
    } else if (hours > 0) {
      return `${hours}h`
    } else {
      return `${mins}min`
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Confirmar Agendamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo do Agendamento */}
          <div className="bg-accent rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{service.name}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="capitalize">{formatDate(selectedDate)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{selectedTime} ({formatDuration(service.durationMinutes)})</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-green-600 dark:text-green-400">{formatPrice(service.price)}</span>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="clientName">Nome completo *</Label>
              <Input
                id="clientName"
                {...register('clientName')}
                placeholder="Digite seu nome completo"
                disabled={isSubmitting}
              />
              {errors.clientName && (
                <p className="text-red-500 text-sm mt-1">{errors.clientName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="clientEmail">E-mail *</Label>
              <Input
                id="clientEmail"
                type="email"
                {...register('clientEmail')}
                placeholder="Digite seu e-mail"
                disabled={isSubmitting}
              />
              {errors.clientEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.clientEmail.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="clientPhone">Telefone *</Label>
              <Input
                id="clientPhone"
                type="tel"
                placeholder="(11) 99999-9999"
                {...register('clientPhone', {
                  onChange: (e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    e.target.value = formatted
                  }
                })}
                disabled={isSubmitting}
                maxLength={15}
              />
              {errors.clientPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.clientPhone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Alguma observação especial?"
                disabled={isSubmitting}
                rows={3}
              />
              {errors.notes && (
                <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
