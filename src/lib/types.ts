/**
 * Tipos do sistema de autenticação
 */

export type UserRole = "user" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  linkedinUrl?: string | null;
  provider: "credentials" | "google";
  role: UserRole;
  createdAt: Date;
  // Campos para integração futura
  powerRankingEnabled?: boolean;
  notificationsEnabled?: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  linkedinUrl: string;
  acceptTerms: boolean;
}

export interface AuthError {
  field?: string;
  message: string;
}
