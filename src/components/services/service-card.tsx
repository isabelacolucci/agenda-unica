"use client"

import { Button } from "@/components/ui/button"
import { formatPrice, formatDuration, truncateDescription } from "@/lib/utils"
import { Clock, DollarSign, Edit } from "lucide-react"
import { useState } from "react"
import { EditServiceModal } from "./edit-service-modal"

interface ServiceCardProps {
  id: number
  name: string
  description: string | null
  durationMinutes: number
  price: number
  isActive: boolean
  onToggleActive?: (id: number, newStatus: boolean) => void
  onServiceUpdated?: (updatedService: Service) => void
}

interface Service {
  id: number
  name: string
  description: string | null
  durationMinutes: number
  price: number
  isActive: boolean
}

export function ServiceCard({
  id,
  name,
  description,
  durationMinutes,
  price,
  isActive,
  onToggleActive,
  onServiceUpdated
}: ServiceCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleToggleActive = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/services/${id}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao alterar status do serviço')
      }

      const data = await response.json()
      
      // Chama o callback para atualizar o estado na lista
      if (onToggleActive) {
        onToggleActive(id, data.isActive)
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      // Aqui você pode adicionar uma notificação de erro se desejar
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = () => {
    setIsEditModalOpen(true)
  }

  const handleServiceUpdated = (updatedService: Service) => {
    if (onServiceUpdated) {
      onServiceUpdated(updatedService)
    }
  }

  const service: Service = {
    id,
    name,
    description,
    durationMinutes,
    price,
    isActive
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">{name}</h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium self-start ${
                isActive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {isActive ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          {description && (
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3">
              {truncateDescription(description)}
            </p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{formatDuration(durationMinutes)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-medium text-foreground">{formatPrice(price)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 border-t border-border">
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isActive}
              onChange={handleToggleActive}
              disabled={isLoading}
            />
            <div className={`w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
            <span className="ml-3 text-xs sm:text-sm font-medium text-foreground">
              {isLoading ? 'Processando...' : (isActive ? 'Ativo' : 'Inativo')}
            </span>
          </label>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          className="w-full sm:w-auto"
          onClick={handleEditClick}
        >
          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
          Editar
        </Button>
      </div>

      <EditServiceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        service={service}
        onServiceUpdated={handleServiceUpdated}
      />
    </div>
  )
}
