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
      className="border border-border rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-98 bg-card"
      itemScope
      itemType="https://schema.org/Service"
      onClick={handleAppointmentClick}
    >
      <div className="flex flex-col space-y-3">
        <h3 
          className="text-base sm:text-lg font-semibold text-foreground"
          itemProp="name"
        >
          {name}
        </h3>
        
        {description && (
          <p 
            className="text-muted-foreground text-xs sm:text-sm leading-relaxed"
            itemProp="description"
          >
            {truncateDescription(description, 120)}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">
                <span itemProp="duration">{formatDuration(durationMinutes)}</span>
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-green-600">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">
                <span itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  <meta itemProp="priceCurrency" content="BRL" />
                  <span itemProp="price" content={price.toString()}>
                    {formatPrice(price)}
                  </span>
                </span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-primary bg-accent rounded-md px-3 py-2 sm:py-1.5">
            <Calendar className="w-4 h-4 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="text-sm sm:text-xs font-medium">Agendar</span>
          </div>
        </div>
      </div>
    </div>
  )
}
