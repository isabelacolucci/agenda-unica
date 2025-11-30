"use client"

import { ServiceCard } from "@/components/services/service-card"
import { CreateServiceModal } from "@/components/services/create-service-modal"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Plus, ClipboardList, AlertCircle } from "lucide-react"

interface Service {
  id: number
  name: string
  description: string | null
  durationMinutes: number
  price: number
  isActive: boolean
}

export function ServicesList() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleToggleActive = (serviceId: number, newStatus: boolean) => {
    setServices(prevServices => 
      prevServices.map(service => 
        service.id === serviceId 
          ? { ...service, isActive: newStatus }
          : service
      )
    )
  }

  const handleServiceUpdated = (updatedService: Service) => {
    setServices(prevServices => 
      prevServices.map(service => 
        service.id === updatedService.id 
          ? updatedService
          : service
      )
    )
  }

  const handleServiceCreated = (newService: Service) => {
    setServices(prevServices => [newService, ...prevServices])
  }

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/services')
        
        if (!response.ok) {
          throw new Error('Erro ao carregar serviços')
        }
        
        const data = await response.json()
        setServices(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header da página */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Seus Serviços</h2>
            <p className="text-gray-600 mt-1">Carregando...</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Serviço
          </Button>
        </div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Header da página */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Seus Serviços</h2>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Serviço
          </Button>
        </div>

        {/* Error state */}
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Erro ao carregar serviços</h3>
            <p className="mt-2 text-gray-500">{error}</p>
            <div className="mt-6">
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header da página */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Seus Serviços</h2>
          <p className="text-gray-600 mt-1">
            {services.length === 0 
              ? "Você ainda não cadastrou nenhum serviço" 
              : `${services.length} ${services.length === 1 ? 'serviço cadastrado' : 'serviços cadastrados'}`
            }
          </p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      {/* Lista de serviços */}
      {services.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum serviço cadastrado</h3>
            <p className="mt-2 text-gray-500">
              Comece criando seu primeiro serviço para que os clientes possam fazer agendamentos.
            </p>
            <div className="mt-6">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Serviço
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              name={service.name}
              description={service.description}
              durationMinutes={service.durationMinutes}
              price={service.price}
              isActive={service.isActive}
              onToggleActive={handleToggleActive}
              onServiceUpdated={handleServiceUpdated}
            />
          ))}
        </div>
      )}

      <CreateServiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onServiceCreated={handleServiceCreated}
      />
    </div>
  )
}
