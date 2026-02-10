"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Trophy, Linkedin, Zap, User } from "lucide-react";
import { Card } from "@/components/ui";
import type { RankingEntry } from "@/lib/xp";

export function PowerRanking() {
  const { data: session } = useSession();
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/playground/ranking");
      const data = await response.json();

      if (data.success) {
        setRanking(data.ranking);
      } else {
        setError("Erro ao carregar ranking");
      }
    } catch {
      setError("Erro ao carregar ranking");
    } finally {
      setIsLoading(false);
    }
  };

  const getPositionBadgeColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-[0_4px_20px_rgba(250,204,21,0.4)]";
      case 2:
        return "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900 shadow-[0_4px_20px_rgba(209,213,219,0.4)]";
      case 3:
        return "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-[0_4px_20px_rgba(251,146,60,0.4)]";
      default:
        return "bg-white/10 text-white border border-white/20";
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#FF6803]/10 border border-[#FF6803]/30 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-[#FF6803]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Power Ranking</h2>
            <p className="text-xs text-[#BFBFBF]">Top 10 jogadores</p>
          </div>
        </div>
        <div className="text-center py-8 text-[#BFBFBF]">
          Carregando ranking...
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#FF6803]/10 border border-[#FF6803]/30 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-[#FF6803]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Power Ranking</h2>
            <p className="text-xs text-[#BFBFBF]">Top 10 jogadores</p>
          </div>
        </div>
        <div className="text-center py-8 text-red-400 text-sm">{error}</div>
      </Card>
    );
  }

  return (
    <Card className="p-6" data-testid="power-ranking">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#FF6803]/10 border border-[#FF6803]/30 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-[#FF6803]" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white">Power Ranking</h2>
          <p className="text-xs text-[#BFBFBF]">Top 10 jogadores por XP</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF6803]/10 border border-[#FF6803]/20">
          <Zap className="w-3.5 h-3.5 text-[#FF6803]" />
          <span className="text-xs font-semibold text-[#FF6803]">Playground</span>
        </div>
      </div>

      {/* Info Note */}
      <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-blue-200">
          <strong>Atenção:</strong> Apenas ações no <strong>Playground de Automação</strong> contabilizam XP.
          O módulo "Desafios individuais" não impacta o ranking.
        </p>
      </div>

      {/* Ranking List */}
      {ranking.length === 0 ? (
        <div className="text-center py-8 text-[#BFBFBF] text-sm">
          Nenhum usuário no ranking ainda. Seja o primeiro!
        </div>
      ) : (
        <div className="space-y-2">
          {ranking.map((entry) => {
            const isCurrentUser = session?.user?.email === entry.email;
            const hasLinkedin = !!entry.linkedinUrl && entry.linkedinUrl.trim().length > 0;
            const linkedinHref = entry.linkedinUrl || "";
            const displayName = entry.name.length > 20 ? `${entry.name.slice(0, 17)}...` : entry.name;

            return (
              <div
                key={entry.userId}
                className={`group relative overflow-hidden rounded-xl border transition-all duration-200 ${
                  isCurrentUser
                    ? "bg-[#FF6803]/10 border-[#FF6803]/40 ring-2 ring-[#FF6803]/20"
                    : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8"
                }`}
                data-testid={`ranking-entry-${entry.position}`}
              >
                {/* Background Gradient for Top 3 */}
                {entry.position <= 3 && (
                  <div className="absolute inset-0 opacity-5">
                    <div
                      className={`w-full h-full ${
                        entry.position === 1
                          ? "bg-gradient-to-r from-yellow-400/20 to-transparent"
                          : entry.position === 2
                          ? "bg-gradient-to-r from-gray-300/20 to-transparent"
                          : "bg-gradient-to-r from-orange-400/20 to-transparent"
                      }`}
                    />
                  </div>
                )}

                <div className="relative flex items-center gap-3 p-3">
                  {/* Position Badge */}
                  <div
                    className={`relative flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 ${getPositionBadgeColor(
                      entry.position
                    )}`}
                  >
                    {entry.image ? (
                      <img
                        src={entry.image}
                        alt={`Avatar de ${entry.name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#0B0501] text-[10px] font-bold text-white border border-white/20 flex items-center justify-center shadow">
                      {entry.position}°
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`font-semibold text-sm ${
                          isCurrentUser ? "text-[#FF6803]" : "text-white"
                        }`}
                      >
                        {displayName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#BFBFBF]">
                      <span>{entry.completedCount} seções</span>
                    </div>
                  </div>

                  {/* XP Badge */}
                  <div className="flex items-center justify-center gap-1 px-2 py-1.5 min-w-[72px] rounded-lg bg-[#FF6803]/10 border border-[#FF6803]/20 flex-shrink-0">
                    <Zap className="w-3.5 h-3.5 text-[#FF6803]" />
                    <span className="text-sm font-bold text-[#FF6803]">{entry.totalXP}</span>
                    <span className="text-[10px] text-[#FF6803]/60">XP</span>
                  </div>

                  {/* LinkedIn Button */}
                  {hasLinkedin && (
                    <a
                      href={linkedinHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all duration-200 flex-shrink-0 group/linkedin"
                      aria-label={`LinkedIn de ${entry.name}`}
                      data-testid={`linkedin-${entry.position}`}
                    >
                      <Linkedin className="w-4 h-4 text-blue-400 group-hover/linkedin:text-blue-300" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-[#BFBFBF] text-center">
          Ranking atualizado em tempo real • XP baseado em dificuldade das seções
        </p>
      </div>
    </Card>
  );
}
