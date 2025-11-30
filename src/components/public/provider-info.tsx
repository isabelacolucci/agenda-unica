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
      className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      <div className="text-center space-y-4">
        <div>
          <h1 
            className="text-3xl font-bold text-gray-900"
            itemProp="name"
          >
            {businessName}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            <span itemProp="employee" itemScope itemType="https://schema.org/Person">
              <span itemProp="name">{name}</span>
            </span>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-8 space-y-3 sm:space-y-0 pt-4">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Phone className="w-5 h-5" />
            <span itemProp="telephone">{phone}</span>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span itemProp="address">{address}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
