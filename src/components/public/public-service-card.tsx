"use client"

import { formatPrice, formatDuration, truncateDescription } from "@/lib/utils"
import { Clock, DollarSign, Calendar } from "lucide-react"
import { PublicService } from "@/types/provider"
import { useRouter, useParams } from "next/navigation"

interface PublicServiceCardProps {
  service: PublicService
}

export function PublicServiceCard({ service }: PublicServiceCardProps) {
  const { name, description, durationMinutes, price } = service
  const router = useRouter()
  const params = useParams()

  const handleAppointmentClick = () => {
    const publicUrl = params?.publicUrl
    router.push(`/business/${publicUrl}/services/${service.id}/appointment`)
  }

  return (
    <div 
      className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      itemScope
      itemType="https://schema.org/Service"
      onClick={handleAppointmentClick}
    >
      <div className="flex flex-col space-y-3">
        <h3 
          className="text-lg font-semibold text-gray-900"
          itemProp="name"
        >
          {name}
        </h3>
        
        {description && (
          <p 
            className="text-gray-600 text-sm leading-relaxed"
            itemProp="description"
          >
            {truncateDescription(description, 120)}
          </p>
        )}
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                <span itemProp="duration">{formatDuration(durationMinutes)}</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-1 text-green-600">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-medium">
                <span itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  <meta itemProp="priceCurrency" content="BRL" />
                  <span itemProp="price" content={price.toString()}>
                    {formatPrice(price)}
                  </span>
                </span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 text-blue-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Agendar</span>
          </div>
        </div>
      </div>
    </div>
  )
}
