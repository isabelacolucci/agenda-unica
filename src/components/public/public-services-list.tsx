"use client"

import { PublicService } from "@/types/provider"
import { PublicServiceCard } from "./public-service-card"

interface PublicServicesListProps {
  services: PublicService[]
}

export function PublicServicesList({ services }: PublicServicesListProps) {
  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Nenhum serviço disponível no momento.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <PublicServiceCard
          key={service.id}
          service={service}
        />
      ))}
    </div>
  )
}
