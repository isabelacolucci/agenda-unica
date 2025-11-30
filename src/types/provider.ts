export interface PublicProvider {
  id: number
  name: string
  businessName: string
  publicUrl: string
  phone: string
  address: string
  services: PublicService[]
}

export interface PublicService {
  id: number
  name: string
  description: string | null
  durationMinutes: number
  price: number
  isActive: boolean
}
