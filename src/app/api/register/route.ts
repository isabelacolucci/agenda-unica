import { NextRequest, NextResponse } from "next/server";
import { registerProviderSchema } from "@/lib/validations/provider";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { generateSlug, generateUniqueSlug } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados de entrada
    const validatedData = registerProviderSchema.parse(body)
    
    // Verificar se email já existe
    const existingProvider = await prisma.provider.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingProvider) {
      return NextResponse.json(
        { error: 'E-mail já está sendo usado por outro prestador de serviço' },
        { status: 400 }
      )
    }
    
    // Gerar slug base a partir do nome do negócio
    const baseSlug = generateSlug(validatedData.businessName)
    
    // Buscar URLs públicas existentes que começam com o slug base
    const existingUrls = await prisma.provider.findMany({
      where: {
        publicUrl: {
          startsWith: baseSlug
        }
      },
      select: { publicUrl: true }
    })
    
    const existingSlugs = existingUrls.map(p => p.publicUrl)
    
    // Gerar URL pública única
    const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs)
    
    // Hash da senha
    const hashedPassword = await hashPassword(validatedData.password)
    
    // Criar o prestador de serviço
    const provider = await prisma.provider.create({
      data: {
        name: validatedData.name,
        businessName: validatedData.businessName,
        publicUrl: uniqueSlug,
        email: validatedData.email,
        password: hashedPassword,
        phone: validatedData.phone,
        address: validatedData.address,
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Prestador de serviço registrado com sucesso!',
      data: {
        id: provider.id,
        publicUrl: provider.publicUrl
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Erro no registro:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
