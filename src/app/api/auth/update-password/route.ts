import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updatePasswordSchema } from "@/lib/validations/password";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    // Verificar autenticação
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Obter dados do request
    const body = await request.json();

    // Validar dados com zod
    const validationResult = updatePasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Dados inválidos",
          details: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validationResult.data;

    // Buscar o usuário no banco
    const provider = await prisma.provider.findUnique({
      where: {
        id: parseInt(session.user.id),
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se a senha atual está correta
    const isCurrentPasswordValid = await verifyPassword(currentPassword, provider.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Senha atual incorreta" },
        { status: 400 }
      );
    }

    // Gerar hash da nova senha
    const hashedNewPassword = await hashPassword(newPassword);

    // Atualizar senha no banco de dados
    await prisma.provider.update({
      where: {
        id: provider.id,
      },
      data: {
        password: hashedNewPassword,
      },
    });

    return NextResponse.json(
      { message: "Senha atualizada com sucesso" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
