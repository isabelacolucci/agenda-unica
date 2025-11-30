import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateProviderConfigSchema } from "@/lib/validations/config";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const provider = await prisma.provider.findUnique({
      where: {
        id: parseInt(session.user.id),
      },
      select: {
        id: true,
        name: true,
        businessName: true,
        publicUrl: true,
        email: true,
        address: true,
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(provider);
  } catch (error) {
    console.error("Erro ao buscar configurações do usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateProviderConfigSchema.parse(body);

    const providerId = parseInt(session.user.id);

    // Verificar se existe outro provider com o mesmo email ou publicUrl
    const existingProvider = await prisma.provider.findFirst({
      where: {
        AND: [
          { id: { not: providerId } },
          {
            OR: [
              { email: validatedData.email },
              { publicUrl: validatedData.publicUrl },
            ],
          },
        ],
      },
    });

    if (existingProvider) {
      if (existingProvider.email === validatedData.email) {
        return NextResponse.json(
          { error: "Este e-mail já está sendo usado por outro usuário" },
          { status: 409 }
        );
      }
      if (existingProvider.publicUrl === validatedData.publicUrl) {
        return NextResponse.json(
          { error: "Esta URL pública já está sendo usada por outro usuário" },
          { status: 409 }
        );
      }
    }

    const updatedProvider = await prisma.provider.update({
      where: {
        id: providerId,
      },
      data: validatedData,
      select: {
        id: true,
        name: true,
        businessName: true,
        publicUrl: true,
        email: true,
        address: true,
      },
    });

    return NextResponse.json(updatedProvider);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "E-mail ou URL pública já estão em uso" },
          { status: 409 }
        );
      }
    }

    console.error("Erro ao atualizar configurações do usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
