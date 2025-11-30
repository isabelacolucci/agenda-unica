import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ publicUrl: string }> }
) {
  try {
    const { publicUrl } = await params

    if (!publicUrl || publicUrl.trim() === '') {
      return NextResponse.json(
        { error: 'Public URL is required' },
        { status: 400 }
      )
    }

    // Sanitizar o publicUrl para evitar problemas de segurança
    const sanitizedPublicUrl = publicUrl.trim().toLowerCase()

    // Buscar o prestador pelo publicUrl
    const provider = await prisma.provider.findUnique({
      where: {
        publicUrl: sanitizedPublicUrl
      },
      select: {
        id: true,
        name: true,
        businessName: true,
        publicUrl: true,
        phone: true,
        address: true,
        // Não incluir email, password ou outros dados sensíveis
        services: {
          where: {
            isActive: true // Apenas serviços ativos
          },
          select: {
            id: true,
            name: true,
            description: true,
            durationMinutes: true,
            price: true,
            isActive: true
          },
          orderBy: {
            name: 'asc'
          }
        }
      }
    })

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(provider)
  } catch (error) {
    console.error('Error fetching public provider:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
