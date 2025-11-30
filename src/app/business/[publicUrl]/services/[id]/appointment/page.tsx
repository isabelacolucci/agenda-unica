"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppointmentModal } from "@/components/appointments/appointment-modal"
import { toast } from "react-toastify"

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

export default function AppointmentPage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [loadingTimes, setLoadingTimes] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const serviceId = params?.id as string
  const publicUrl = params?.publicUrl as string

  useEffect(() => {
    if (serviceId) {
      fetchService()
      fetchAvailableDates()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId])

  useEffect(() => {
    if (selectedDate && serviceId) {
      fetchAvailableTimes(selectedDate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, serviceId])

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/public-provider/${publicUrl}`)
      if (!response.ok) {
        throw new Error('Erro ao carregar serviço')
      }
      const providerData = await response.json()
      const foundService = providerData.services.find((s: {id: number}) => s.id === parseInt(serviceId))
      
      if (!foundService) {
        throw new Error('Serviço não encontrado')
      }
      
      setService({
        ...foundService,
        provider: {
          id: providerData.id,
          name: providerData.name,
          businessName: providerData.businessName
        }
      })
    } catch (error) {
      console.error('Erro ao buscar serviço:', error)
      toast.error('Erro ao carregar informações do serviço')
      router.push(`/business/${publicUrl}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableDates = async () => {
    try {
      const response = await fetch(`/api/services/${serviceId}/available-dates`)
      if (!response.ok) {
        throw new Error('Erro ao carregar datas')
      }
      const data = await response.json()
      setAvailableDates(data.availableDates)
    } catch (error) {
      console.error('Erro ao buscar datas:', error)
      toast.error('Erro ao carregar datas disponíveis')
    }
  }

  const fetchAvailableTimes = async (date: string) => {
    try {
      setLoadingTimes(true)
      const response = await fetch(`/api/services/${serviceId}/available-times?date=${date}`)
      if (!response.ok) {
        throw new Error('Erro ao carregar horários')
      }
      const data = await response.json()
      setAvailableTimes(data.availableTimes)
    } catch (error) {
      console.error('Erro ao buscar horários:', error)
      toast.error('Erro ao carregar horários disponíveis')
    } finally {
      setLoadingTimes(false)
    }
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime("")
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setShowModal(true)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Serviço não encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push(`/business/${publicUrl}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h1>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-500">
                <Clock className="w-5 h-5" />
                <span>{formatDuration(service.durationMinutes)}</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <span className="text-xl font-semibold">{formatPrice(service.price)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seleção de Data */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Selecione uma data
          </h2>
          
          {availableDates.length === 0 ? (
            <p className="text-gray-500">Nenhuma data disponível</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableDates.map((date) => (
                <button
                  key={date}
                  onClick={() => handleDateSelect(date)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    selectedDate === date
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-medium capitalize">
                    {formatDate(date)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Seleção de Horário */}
        {selectedDate && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Selecione um horário
            </h2>
            
            {loadingTimes ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Carregando horários...</p>
              </div>
            ) : availableTimes.length === 0 ? (
              <p className="text-gray-500">Nenhum horário disponível para esta data</p>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className="p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-center transition-colors"
                  >
                    <div className="text-sm font-medium">{time}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal de Agendamento */}
        {showModal && selectedDate && selectedTime && service && (
          <AppointmentModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            service={service}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSuccess={() => {
              setShowModal(false)
              router.push(`/business/${publicUrl}`)
            }}
          />
        )}
      </div>
    </div>
  )
}
