import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { findUserByEmail } from "@/lib/users";
import { completeSection } from "@/lib/xp";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { scenarioId, difficulty } = body;

    if (!scenarioId || !difficulty) {
      return NextResponse.json(
        { success: false, error: "scenarioId e difficulty são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar dificuldade
    const validDifficulties = ["Iniciante", "Intermediário", "Avançado", "Expert"];
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { success: false, error: "Nível de dificuldade inválido" },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const result = await completeSection(user.id, scenarioId, difficulty);

    return NextResponse.json({
      success: true,
      xpGained: result.xpGained,
      totalXP: result.totalXP,
      alreadyCompleted: result.alreadyCompleted,
    });
  } catch (error) {
    console.error("Erro ao atualizar progresso:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
