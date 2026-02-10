import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserProfileByEmail, updateUserProfileByEmail } from "@/lib/users";
import { validators } from "@/lib/validators";

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

    const profile = await getUserProfileByEmail(session.user.email);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Erro ao obter perfil:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao obter perfil" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const image = typeof body.image === "string" ? body.image.trim() : null;
    const linkedinUrl = typeof body.linkedinUrl === "string" ? body.linkedinUrl.trim() : null;

    // Apenas valida se houver valor
    if (linkedinUrl) {
      const linkedinError = validators.linkedin.validate(linkedinUrl);
      if (linkedinError) {
        return NextResponse.json(
          { success: false, error: linkedinError },
          { status: 400 }
        );
      }
    }

    const updated = await updateUserProfileByEmail(session.user.email, {
      image: image || null,
      linkedinUrl: linkedinUrl || null,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const profile = await getUserProfileByEmail(updated.email);

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}
