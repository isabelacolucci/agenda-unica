"use client"

import { MapPin, Phone } from "lucide-react"
import { PublicProvider } from "@/types/provider"

interface ProviderInfoProps {
  provider: PublicProvider
}

export function ProviderInfo({ provider }: ProviderInfoProps) {
  const { name, businessName, phone, address } = provider

  return (
    <div 
      className="bg-card border border-border rounded-lg p-4 sm:p-6 lg:p-8 shadow-sm"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      <div className="text-center space-y-3 sm:space-y-4">
        <div>
          <h1 
            className="text-2xl sm:text-3xl font-bold text-gray-900"
            itemProp="name"
          >
            {businessName}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-2">
            <span itemProp="employee" itemScope itemType="https://schema.org/Person">
              <span itemProp="name">{name}</span>
            </span>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-8 space-y-2 sm:space-y-0 pt-3 sm:pt-4">
          <div className="flex items-center justify-center space-x-2 text-sm sm:text-base text-gray-600">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span itemProp="telephone">{phone}</span>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm sm:text-base text-gray-600">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span itemProp="address" className="text-center">{address}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
