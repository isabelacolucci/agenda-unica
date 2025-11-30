"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, ExternalLink, Link } from "lucide-react"

interface PublicUrlCardProps {
  publicUrl: string
}

export function PublicUrlCard({ publicUrl }: PublicUrlCardProps) {
  const [copied, setCopied] = useState(false)
  
  // Usar window.location.origin em vez de NEXTAUTH_URL para maior flexibilidade
  const fullUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/business/${publicUrl}`
    : `/business/${publicUrl}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Erro ao copiar link:", error)
    }
  }

  const handleOpenLink = () => {
    if (typeof window !== "undefined") {
      window.open(fullUrl, "_blank")
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Link className="h-5 w-5" />
          Link Público
        </CardTitle>
        <CardDescription>
          Compartilhe este link com seus clientes para que possam fazer agendamentos online
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 p-3 sm:p-4 rounded-lg border">
          <code className="text-xs sm:text-sm text-gray-700 flex-1 truncate font-mono break-all">
            {fullUrl}
          </code>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial justify-center"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Copiar</span>
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={handleOpenLink}
              className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial justify-center"
            >
              <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Abrir</span>
            </Button>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          💡 Dica: Seus clientes podem acessar este link para visualizar seus serviços e fazer agendamentos
        </div>
      </CardContent>
    </Card>
  )
}
