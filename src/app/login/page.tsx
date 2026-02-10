"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FlaskConical, Eye, EyeOff, ArrowRight, Info } from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import { validators, authMessages } from "@/lib/validators";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    const emailError = validators.email.validate(formData.email);
    if (emailError) newErrors.email = emailError;

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setErrors({ general: authMessages.loginError });
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setErrors({ general: authMessages.genericError });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      setErrors({ general: authMessages.googleError });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial flex items-center justify-center px-6 py-12">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#FF6803]/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md" data-testid="login-page">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group" data-testid="login-logo">
            <div className="w-12 h-12 rounded-xl bg-[#FF6803] flex items-center justify-center shadow-[0_4px_20px_rgba(255,104,3,0.3)] group-hover:shadow-[0_8px_30px_rgba(255,104,3,0.4)] transition-all duration-200">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-h2 text-white mt-6 mb-2" data-testid="login-title">Bem-vindo de volta</h1>
          <p className="text-[#BFBFBF]">Entre para continuar no QA Playground</p>
        </div>

        {/* Optional Note */}
        <div className="mb-6 p-4 rounded-xl bg-[#FF6803]/10 border border-[#FF6803]/20 flex items-start gap-3" data-testid="login-optional-note">
          <Info className="w-5 h-5 text-[#FF6803] mt-0.5 shrink-0" />
          <p className="text-sm text-[#BFBFBF]">
            {authMessages.optionalNote}
          </p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20" data-testid="login-error">
            <p className="text-sm text-red-400 text-center">{errors.general}</p>
          </div>
        )}

        {/* Login Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
            <Input
              label="E-mail"
              type="email"
              name="email"
              placeholder="voce@exemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              autoComplete="email"
              data-testid="login-email"
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
                autoComplete="current-password"
                data-testid="login-password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer" data-testid="remember-me">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF6803] focus:ring-[#FF6803]/50"
                />
                <span className="text-sm text-[#BFBFBF]">Lembrar de mim</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#FF6803] hover:text-[#AE3A02] transition-colors"
                data-testid="forgot-password-link"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              data-testid="login-submit"
            >
              Entrar
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white/8 px-4 text-[#BFBFBF]">Ou continue com</span>
            </div>
          </div>

          {/* Social Login - Google */}
          <Button
            variant="secondary"
            type="button"
            className="w-full"
            onClick={handleGoogleLogin}
            isLoading={isGoogleLoading}
            data-testid="login-google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Entrar com Google
          </Button>
        </Card>

        {/* Register Link */}
        <p className="text-center mt-8 text-[#BFBFBF]" data-testid="register-link">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-[#FF6803] hover:text-[#AE3A02] font-medium transition-colors">
            Cadastre-se grátis
          </Link>
        </p>

        {/* Test Credentials Hint */}
        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-[#BFBFBF] text-center" data-testid="test-credentials">
            <span className="text-white font-medium">Credenciais de teste:</span><br />
            E-mail: test@example.com<br />
            Senha: Password1
          </p>
        </div>
      </div>
    </div>
  );
}
