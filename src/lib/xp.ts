/**
 * Sistema de XP e Power Ranking - Playground de Automação
 */

import type { Scenario } from "@/data/scenarios";
import { db } from "@/lib/db";

export type DifficultyLevel = "Iniciante" | "Intermediário" | "Avançado" | "Expert";

/**
 * Tabela de pontuação por nível de dificuldade
 */
export const XP_PER_DIFFICULTY: Record<DifficultyLevel, number> = {
  "Iniciante": 10,
  "Intermediário": 25,
  "Avançado": 50,
  "Expert": 100,
};

/**
 * Progresso do usuário no Playground
 */
export interface UserPlaygroundProgress {
  userId: string;
  completedSections: Set<string>; // IDs dos cenários completados
  totalXP: number;
  lastUpdated: Date;
}

/**
 * Entrada no Power Ranking
 */
export interface RankingEntry {
  position: number;
  userId: string;
  name: string;
  email: string;
  image?: string | null;
  linkedinUrl?: string | null;
  totalXP: number;
  completedCount: number;
}

/**
 * Calcula XP de um cenário baseado em sua dificuldade
 */
export function calculateScenarioXP(difficulty: DifficultyLevel): number {
  return XP_PER_DIFFICULTY[difficulty];
}

/**
 * Verifica se o progresso do usuário precisa ser resetado (reset mensal automático)
 */
async function checkAndResetIfNeeded(userId: string): Promise<void> {
  const progress = await db.userProgress.findUnique({
    where: { userId },
  });

  if (!progress) return;

  const now = new Date();
  const lastUpdate = new Date(progress.lastUpdated);

  // Verifica se estamos em um novo mês
  const needsReset =
    now.getMonth() !== lastUpdate.getMonth() ||
    now.getFullYear() !== lastUpdate.getFullYear();

  if (needsReset) {
    await resetUserProgress(userId);
  }
}

/**
 * Reseta o progresso de um usuário
 */
export async function resetUserProgress(userId: string): Promise<void> {
  // Deleta todas as seções completadas
  await db.completedSection.deleteMany({
    where: { userId },
  });

  // Atualiza ou cria o progresso zerado
  await db.userProgress.upsert({
    where: { userId },
    update: {
      totalXP: 0,
      lastUpdated: new Date(),
    },
    create: {
      userId,
      totalXP: 0,
      lastUpdated: new Date(),
    },
  });
}

/**
 * Obtém o progresso de um usuário
 */
export async function getUserProgress(userId: string): Promise<UserPlaygroundProgress> {
  // Verifica e reseta se necessário (reset mensal automático)
  await checkAndResetIfNeeded(userId);

  const progress = await db.userProgress.findUnique({
    where: { userId },
    include: {
      sections: true,
    },
  });

  if (!progress) {
    const newProgress = await db.userProgress.create({
      data: {
        userId,
        totalXP: 0,
        lastUpdated: new Date(),
      },
      include: {
        sections: true,
      },
    });

    return {
      userId: newProgress.userId,
      completedSections: new Set(),
      totalXP: newProgress.totalXP,
      lastUpdated: newProgress.lastUpdated,
    };
  }

  return {
    userId: progress.userId,
    completedSections: new Set(progress.sections.map((s: { scenarioId: string }) => s.scenarioId)),
    totalXP: progress.totalXP,
    lastUpdated: progress.lastUpdated,
  };
}

/**
 * Marca uma seção como completa e adiciona XP
 */
export async function completeSection(
  userId: string,
  scenarioId: string,
  difficulty: DifficultyLevel
): Promise<{ xpGained: number; totalXP: number; alreadyCompleted: boolean }> {
  // Verifica e reseta se necessário
  await checkAndResetIfNeeded(userId);

  // Verifica se já foi completado
  const existing = await db.completedSection.findFirst({
    where: {
      userId,
      scenarioId,
    },
  });

  if (existing) {
    const progress = await db.userProgress.findUnique({
      where: { userId },
    });

    return {
      xpGained: 0,
      totalXP: progress?.totalXP || 0,
      alreadyCompleted: true,
    };
  }

  // Adiciona XP
  const xpGained = calculateScenarioXP(difficulty);

  // Cria a seção completada
  await db.completedSection.create({
    data: {
      userId,
      scenarioId,
    },
  });

  // Atualiza o progresso
  const updatedProgress = await db.userProgress.upsert({
    where: { userId },
    update: {
      totalXP: {
        increment: xpGained,
      },
      lastUpdated: new Date(),
    },
    create: {
      userId,
      totalXP: xpGained,
      lastUpdated: new Date(),
    },
  });

  return {
    xpGained,
    totalXP: updatedProgress.totalXP,
    alreadyCompleted: false,
  };
}

/**
 * Obtém o Top 10 do Power Ranking
 */
export async function getPowerRanking(usersData: Array<{
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  linkedinUrl?: string | null;
}>): Promise<RankingEntry[]> {
  // Busca todos os progressos do banco de dados
  const allProgress = await db.userProgress.findMany({
    include: {
      sections: true,
    },
    orderBy: {
      totalXP: 'desc',
    },
    take: 10, // Top 10
  });

  // Mapeia para o formato de ranking
  const rankings = allProgress
    .map((progress: any) => {
      const user = usersData.find((u) => u.id === progress.userId);
      if (!user) return null;

      return {
        userId: progress.userId,
        name: user.name || user.email.split("@")[0],
        email: user.email,
        image: user.image || null,
        linkedinUrl: user.linkedinUrl,
        totalXP: progress.totalXP,
        completedCount: progress.sections.length,
      };
    })
    .filter((entry: any): entry is Exclude<typeof entry, null> => entry !== null)
    .sort((a: any, b: any) => {
      // Ordena por XP (descendente), em caso de empate, por número de seções completadas
      if (b.totalXP !== a.totalXP) return b.totalXP - a.totalXP;
      return b.completedCount - a.completedCount;
    });

  // Adiciona posições
  return rankings.map((entry: any, index: number) => ({
    ...entry,
    position: index + 1,
  }));
}

/**
 * Calcula XP total possível de todos os cenários
 */
export function calculateTotalPossibleXP(scenarios: Scenario[]): number {
  return scenarios.reduce((total, scenario) => {
    return total + calculateScenarioXP(scenario.difficulty);
  }, 0);
}

/**
 * Calcula nível baseado em XP
 */
export function calculateLevel(xp: number): number {
  // Progressão: nível 1 = 0-50 XP, nível 2 = 51-150 XP, nível 3 = 151-300 XP, etc.
  return Math.floor(Math.sqrt(xp / 25)) + 1;
}

