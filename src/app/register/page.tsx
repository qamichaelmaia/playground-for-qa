"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FlaskConical, Eye, EyeOff, ArrowRight, Check, Info, Linkedin } from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import { validators, authMessages } from "@/lib/validators";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    linkedinUrl: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const checkPasswordStrength = (password: string) => {
    return validators.password.requirements.map((req) => ({
      ...req,
      met: req.regex.test(password),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const emailError = validators.email.validate(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validators.password.validate(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmError = validators.confirmPassword.validate(formData.confirmPassword, formData.password);
    if (confirmError) newErrors.confirmPassword = confirmError;

    const linkedinError = validators.linkedin.validate(formData.linkedinUrl);
    if (linkedinError) newErrors.linkedinUrl = linkedinError;

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Você deve aceitar os termos para continuar";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          linkedinUrl: formData.linkedinUrl || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: authMessages.registerError });
        }
        setIsLoading(false);
        return;
      }

      // Auto-login após cadastro
      const loginResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (loginResult?.error) {
        setSuccessMessage(authMessages.registerSuccess + " Faça login para continuar.");
        setTimeout(() => router.push("/login"), 2000);
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

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      setErrors({ general: authMessages.googleError });
      setIsGoogleLoading(false);
    }
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

        {/* Optional Note */}
        <div className="mb-6 p-4 rounded-xl bg-[#FF6803]/10 border border-[#FF6803]/20 flex items-start gap-3" data-testid="register-optional-note">
          <Info className="w-5 h-5 text-[#FF6803] mt-0.5 shrink-0" />
          <p className="text-sm text-[#BFBFBF]">
            {authMessages.optionalNote}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20" data-testid="register-success">
            <p className="text-sm text-green-400 text-center">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20" data-testid="register-error">
            <p className="text-sm text-red-400 text-center">{errors.general}</p>
          </div>
        )}

        {/* Register Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5" data-testid="register-form">
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

            {/* LinkedIn Field */}
            <div className="relative">
              <Input
                label="LinkedIn (opcional)"
                type="url"
                name="linkedinUrl"
                placeholder="https://linkedin.com/in/seu-perfil"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                error={errors.linkedinUrl}
                helperText="Insira a URL do seu perfil no LinkedIn"
                data-testid="register-linkedin"
              />
              <Linkedin className="absolute right-4 top-[38px] w-5 h-5 text-[#BFBFBF] pointer-events-none" />
            </div>

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

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white/8 px-4 text-[#BFBFBF]">Ou cadastre-se com</span>
            </div>
          </div>

          {/* Social Register - Google */}
          <Button
            variant="secondary"
            type="button"
            className="w-full"
            onClick={handleGoogleRegister}
            isLoading={isGoogleLoading}
            data-testid="register-google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Cadastrar com Google
          </Button>
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
