/**
 * Utilitários de validação para formulários - pt-BR
 */

export const validators = {
  email: {
    required: "E-mail é obrigatório",
    invalid: "Digite um e-mail válido",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    validate(value: string): string | null {
      if (!value.trim()) return this.required;
      if (!this.pattern.test(value)) return this.invalid;
      return null;
    },
  },

  password: {
    required: "Senha é obrigatória",
    minLength: "Senha deve ter pelo menos 8 caracteres",
    requirements: [
      { id: "length", label: "Pelo menos 8 caracteres", regex: /.{8,}/ },
      { id: "uppercase", label: "Uma letra maiúscula", regex: /[A-Z]/ },
      { id: "lowercase", label: "Uma letra minúscula", regex: /[a-z]/ },
      { id: "number", label: "Um número", regex: /[0-9]/ },
    ],
    validate(value: string): string | null {
      if (!value) return this.required;
      if (value.length < 8) return this.minLength;
      const unmet = this.requirements.filter((r) => !r.regex.test(value));
      if (unmet.length > 0) return "Senha não atende aos requisitos mínimos";
      return null;
    },
    checkStrength(password: string) {
      return this.requirements.map((req) => ({
        ...req,
        met: req.regex.test(password),
      }));
    },
  },

  confirmPassword: {
    required: "Confirmação de senha é obrigatória",
    mismatch: "As senhas não conferem",
    validate(value: string, password: string): string | null {
      if (!value) return this.required;
      if (value !== password) return this.mismatch;
      return null;
    },
  },

  linkedin: {
    invalid: "Insira uma URL válida do LinkedIn (ex: https://linkedin.com/in/seu-perfil)",
    pattern: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w\-%.]+\/?$/,
    validate(value: string): string | null {
      if (!value.trim()) return null; // Campo opcional
      if (!this.pattern.test(value.trim())) return this.invalid;
      return null;
    },
  },

  name: {
    required: "Nome é obrigatório",
    validate(value: string): string | null {
      if (!value.trim()) return this.required;
      return null;
    },
  },
};

export const authMessages = {
  loginSuccess: "Login realizado com sucesso!",
  loginError: "E-mail ou senha inválidos",
  registerSuccess: "Conta criada com sucesso!",
  registerError: "Erro ao criar conta. Tente novamente.",
  emailExists: "Este e-mail já está cadastrado",
  googleError: "Erro ao entrar com Google. Tente novamente.",
  genericError: "Ocorreu um erro inesperado. Tente novamente.",
  logoutSuccess: "Você saiu da sua conta",
  optionalNote: "O cadastro é opcional. Algumas funcionalidades, como comentários e Power Ranking, exigem autenticação.",
};
