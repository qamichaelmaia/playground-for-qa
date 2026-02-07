"use client";

import Link from "next/link";
import { useState } from "react";
import { FlaskConical, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { Button, Input, Card } from "@/components/ui";

const passwordRequirements = [
  { id: "length", label: "Pelo menos 8 caracteres", regex: /.{8,}/ },
  { id: "uppercase", label: "Uma letra maiúscula", regex: /[A-Z]/ },
  { id: "lowercase", label: "Uma letra minúscula", regex: /[a-z]/ },
  { id: "number", label: "Um número", regex: /[0-9]/ },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const checkPasswordStrength = (password: string) => {
    return passwordRequirements.map((req) => ({
      ...req,
      met: req.regex.test(password),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Digite um e-mail válido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else {
      const requirements = checkPasswordStrength(formData.password);
      if (!requirements.every((r) => r.met)) {
        newErrors.password = "Senha não atende aos requisitos";
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não conferem";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Você deve aceitar os termos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert("Conta criada com sucesso! (Demo)");

    setIsLoading(false);
  };

  const requirements = checkPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-radial flex items-center justify-center px-6 py-12">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#FF6803]/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md" data-testid="register-page">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group" data-testid="register-logo">
            <div className="w-12 h-12 rounded-xl bg-[#FF6803] flex items-center justify-center shadow-[0_4px_20px_rgba(255,104,3,0.3)] group-hover:shadow-[0_8px_30px_rgba(255,104,3,0.4)] transition-all duration-200">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-h2 text-white mt-6 mb-2" data-testid="register-title">
            Crie sua conta
          </h1>
          <p className="text-[#BFBFBF]">Comece a praticar automação de testes hoje</p>
        </div>

        {/* Register Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5" data-testid="register-form">
            <Input
              label="Nome completo"
              type="text"
              name="name"
              placeholder="João Silva"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              autoComplete="name"
              data-testid="register-name"
            />

            <Input
              label="E-mail"
              type="email"
              name="email"
              placeholder="voce@exemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              autoComplete="email"
              data-testid="register-email"
            />

            <div className="relative">
              <Input
                label="Senha"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                autoComplete="new-password"
                data-testid="register-password"
              />
              <button
                type="button"
                className="absolute right-4 top-[38px] text-[#BFBFBF] hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                data-testid="toggle-password"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Requirements */}
            {formData.password && (
              <div className="grid grid-cols-2 gap-2" data-testid="password-requirements">
                {requirements.map((req) => (
                  <div
                    key={req.id}
                    className={`flex items-center gap-2 text-xs ${
                      req.met ? "text-green-400" : "text-[#BFBFBF]"
                    }`}
                    data-testid={`requirement-${req.id}`}
                    data-met={req.met}
                  >
                    <Check className={`w-3 h-3 ${req.met ? "opacity-100" : "opacity-30"}`} />
                    {req.label}
                  </div>
                ))}
              </div>
            )}

            <Input
              label="Confirmar senha"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              autoComplete="new-password"
              data-testid="register-confirm-password"
            />

            <label className="flex items-start gap-3 cursor-pointer" data-testid="accept-terms">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF6803] focus:ring-[#FF6803]/50"
              />
              <span className="text-sm text-[#BFBFBF]">
                Eu concordo com os{" "}
                <Link href="/terms" className="text-[#FF6803] hover:underline">
                  Termos de Uso
                </Link>{" "}
                e a{" "}
                <Link href="/privacy" className="text-[#FF6803] hover:underline">
                  Política de Privacidade
                </Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-sm text-red-500" data-testid="terms-error">{errors.acceptTerms}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              data-testid="register-submit"
            >
              Criar Conta
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </Card>

        {/* Login Link */}
        <p className="text-center mt-8 text-[#BFBFBF]" data-testid="login-link">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="text-[#FF6803] hover:text-[#AE3A02] font-medium transition-colors"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
