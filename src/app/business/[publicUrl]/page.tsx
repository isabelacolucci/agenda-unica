"use client"

import { notFound } from "next/navigation"
import { PublicProvider } from "@/types/provider"
import { ProviderInfo } from "@/components/public/provider-info"
import { PublicServicesList } from "@/components/public/public-services-list"
import { useEffect, useState, use } from "react"
import { AlertCircle } from "lucide-react"

interface ProviderPublicPageProps {
  params: Promise<{
    publicUrl: string
  }>
}

export default function ProviderPublicPage({ params }: ProviderPublicPageProps) {
  const resolvedParams = use(params)
  const [provider, setProvider] = useState<PublicProvider | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProvider() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/public-provider/${resolvedParams.publicUrl}`)
        
        if (response.status === 404) {
          notFound()
        }

        if (!response.ok) {
          throw new Error('Erro ao carregar dados do prestador')
        }

        const data = await response.json()
        setProvider(data)

        // Atualizar o título da página
        if (data) {
          document.title = `${data.businessName} - ${data.name}`
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro inesperado')
      } finally {
        setLoading(false)
      }
    }

    fetchProvider()
  }, [resolvedParams.publicUrl])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Carregando informações...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Erro ao carregar dados</h3>
          <p className="mt-2 text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!provider) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": provider.businessName,
            "description": `Prestador de serviços - ${provider.name}`,
            "address": provider.address,
            "telephone": provider.phone,
            "url": typeof window !== 'undefined' 
              ? `${window.location.origin}/business/${resolvedParams.publicUrl}`
              : `/business/${resolvedParams.publicUrl}`,
            "priceRange": provider.services.length > 0 
              ? `R$ ${Math.min(...provider.services.map(s => s.price))} - R$ ${Math.max(...provider.services.map(s => s.price))}`
              : undefined,
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Serviços",
              "itemListElement": provider.services.map((service, index) => ({
                "@type": "Offer",
                "name": service.name,
                "description": service.description,
                "price": service.price,
                "priceCurrency": "BRL",
                "position": index + 1
              }))
            }
          })
        }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Informações do Prestador */}
          <ProviderInfo provider={provider} />
          
          {/* Lista de Serviços */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Nossos Serviços
            </h2>
            <PublicServicesList services={provider.services} />
          </div>
        </div>
      </div>
    </div>
  )
}
