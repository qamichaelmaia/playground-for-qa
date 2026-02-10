import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import type { UserProfile, UserRole } from "./types";

/**
 * Armazenamento em memória de usuários (demo).
 * Em produção, substituir por um banco de dados real (PostgreSQL, MongoDB, etc.).
 */
interface StoredUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  linkedinUrl?: string | null;
  passwordHash?: string; // null para OAuth users
  provider: "credentials" | "google";
  role: UserRole;
  createdAt: Date;
  powerRankingEnabled: boolean;
  notificationsEnabled: boolean;
}

const users: Map<string, StoredUser> = new Map();

// Seed com usuário de teste
const testPasswordHash = bcrypt.hashSync("Password1", 10);
users.set("test@example.com", {
  id: "user_test_001",
  email: "test@example.com",
  name: "Usuário Teste",
  passwordHash: testPasswordHash,
  provider: "credentials",
  role: "user",
  createdAt: new Date("2025-01-01"),
  powerRankingEnabled: false,
  notificationsEnabled: true,
});

// Seed com conta de administrador
const adminPasswordHash = bcrypt.hashSync("Admin@2026", 10);
users.set("contatomichaelmaia@gmail.com", {
  id: "user_admin_001",
  email: "contatomichaelmaia@gmail.com",
  name: "Michael Maia",
  linkedinUrl: "https://www.linkedin.com/in/qamichael/",
  passwordHash: adminPasswordHash,
  provider: "credentials",
  role: "admin",
  createdAt: new Date("2025-01-01"),
  powerRankingEnabled: true,
  notificationsEnabled: true,
});

function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  return users.get(email.toLowerCase()) || null;
}

async function upsertUserProfile(user: StoredUser): Promise<void> {
  try {
    await db.userProfile.upsert({
      where: { email: user.email.toLowerCase() },
      update: {
        name: user.name || null,
        image: user.image || null,
        linkedinUrl: user.linkedinUrl || null,
      },
      create: {
        userId: user.id,
        email: user.email.toLowerCase(),
        name: user.name || null,
        image: user.image || null,
        linkedinUrl: user.linkedinUrl || null,
      },
    });
  } catch (error) {
    console.error("Erro ao salvar perfil no banco:", error);
  }
}

function mergeProfileData(user: StoredUser, profile?: { name?: string | null; image?: string | null; linkedinUrl?: string | null }) {
  return {
    ...user,
    name: profile?.name ?? user.name,
    image: profile?.image ?? user.image,
    linkedinUrl: profile?.linkedinUrl ?? user.linkedinUrl,
  };
}

export async function getUserProfileByEmail(email: string): Promise<UserProfile | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;

  try {
    const profile = await db.userProfile.findUnique({
      where: { email: user.email.toLowerCase() },
    });

    const merged = mergeProfileData(user, profile || undefined);
    return toUserProfile(merged);
  } catch (error) {
    console.error("Erro ao buscar perfil do banco:", error);
    return toUserProfile(user);
  }
}

export async function updateUserProfileByEmail(
  email: string,
  data: { image?: string | null; linkedinUrl?: string | null }
): Promise<StoredUser | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;

  if (data.image !== undefined) {
    user.image = data.image;
  }

  if (data.linkedinUrl !== undefined) {
    user.linkedinUrl = data.linkedinUrl || null;
  }

  users.set(user.email.toLowerCase(), user);
  await upsertUserProfile(user);
  return user;
}

export async function createUser(data: {
  email: string;
  password?: string;
  name?: string | null;
  image?: string | null;
  linkedinUrl?: string | null;
  provider: "credentials" | "google";
}): Promise<StoredUser> {
  const email = data.email.toLowerCase();

  if (users.has(email)) {
    throw new Error("EMAIL_EXISTS");
  }

  const newUser: StoredUser = {
    id: generateId(),
    email,
    name: data.name || null,
    image: data.image || null,
    linkedinUrl: data.linkedinUrl || null,
    passwordHash: data.password ? await bcrypt.hash(data.password, 12) : undefined,
    provider: data.provider,
    role: "user",
    createdAt: new Date(),
    powerRankingEnabled: false,
    notificationsEnabled: true,
  };

  users.set(email, newUser);
  await upsertUserProfile(newUser);
  return newUser;
}

export async function verifyPassword(email: string, password: string): Promise<StoredUser | null> {
  const user = await findUserByEmail(email);
  if (!user || !user.passwordHash) return null;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  return isValid ? user : null;
}

export async function findOrCreateGoogleUser(data: {
  email: string;
  name?: string | null;
  image?: string | null;
}): Promise<StoredUser> {
  const existing = await findUserByEmail(data.email);
  if (existing) {
    // Atualizar dados do Google se necessário
    existing.name = data.name || existing.name;
    existing.image = data.image || existing.image;
    await upsertUserProfile(existing);
    return existing;
  }

  return createUser({
    email: data.email,
    name: data.name,
    image: data.image,
    provider: "google",
  });
}

export function toUserProfile(user: StoredUser): UserProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    linkedinUrl: user.linkedinUrl,
    provider: user.provider,
    role: user.role,
    createdAt: user.createdAt,
    powerRankingEnabled: user.powerRankingEnabled,
    notificationsEnabled: user.notificationsEnabled,
  };
}

/**
 * Lista todos os usuários (para ranking e outros usos)
 */
export function getAllUsers(): Array<{
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  linkedinUrl?: string | null;
}> {
  return Array.from(users.values()).map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image || null,
    linkedinUrl: user.linkedinUrl || null,
  }));
}

export async function getAllUsersWithProfiles(): Promise<Array<{
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  linkedinUrl?: string | null;
}>> {
  try {
    const profiles = await db.userProfile.findMany();
    const profilesByEmail = new Map(
      profiles.map((profile: { email: string; name?: string | null; image?: string | null; linkedinUrl?: string | null }) => [
        profile.email.toLowerCase(),
        profile,
      ])
    );

    return Array.from(users.values()).map((user) => {
      const profile = profilesByEmail.get(user.email.toLowerCase());
      const merged = mergeProfileData(user, profile || undefined);

      return {
        id: merged.id,
        email: merged.email,
        name: merged.name,
        image: merged.image || null,
        linkedinUrl: merged.linkedinUrl || null,
      };
    });
  } catch (error) {
    console.error("Erro ao buscar perfis do banco:", error);
    // Fallback para lista sem perfis do banco
    return Array.from(users.values()).map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image || null,
      linkedinUrl: user.linkedinUrl || null,
    }));
  }
}
