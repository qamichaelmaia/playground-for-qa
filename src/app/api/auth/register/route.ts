import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/users";
import { validators } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, linkedinUrl } = body;

    // Validações no backend
    const errors: Record<string, string> = {};

    const emailError = validators.email.validate(email || "");
    if (emailError) errors.email = emailError;

    const passwordError = validators.password.validate(password || "");
    if (passwordError) errors.password = passwordError;

    const linkedinError = validators.linkedin.validate(linkedinUrl || "");
    if (linkedinError) errors.linkedinUrl = linkedinError;

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Verificar se e-mail já existe
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, errors: { email: "Este e-mail já está cadastrado" } },
        { status: 409 }
      );
    }

    // Criar usuário
    const user = await createUser({
      email,
      password,
      linkedinUrl: linkedinUrl || null,
      provider: "credentials",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Conta criada com sucesso!",
        user: { id: user.id, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return NextResponse.json(
      { success: false, errors: { general: "Ocorreu um erro inesperado. Tente novamente." } },
      { status: 500 }
    );
  }
}
