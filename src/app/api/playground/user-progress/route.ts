import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findUserByEmail } from "@/lib/users";
import { getUserProgress } from "@/lib/xp";

export const runtime = "nodejs";

export async function GET() {
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

    const progress = await getUserProgress(user.id);

    return NextResponse.json({
      success: true,
      totalXP: progress.totalXP,
      completedCount: progress.completedSections.size,
      completedSections: Array.from(progress.completedSections),
    });
  } catch (error) {
    console.error("Erro ao obter progresso:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
