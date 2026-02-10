import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findUserByEmail } from "@/lib/users";
import { resetUserProgress } from "@/lib/xp";

export const runtime = "nodejs";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401 }
      );
    }

    const user = await findUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    await resetUserProgress(user.id);

    return NextResponse.json({
      success: true,
      message: "Progresso resetado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao resetar progresso:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao resetar progresso" },
      { status: 500 }
    );
  }
}
