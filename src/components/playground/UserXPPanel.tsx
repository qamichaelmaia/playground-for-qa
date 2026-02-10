"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Zap, TrendingUp, Target, RotateCcw } from "lucide-react";
import { Card, Button, Modal } from "@/components/ui";
import { calculateLevel } from "@/lib/xp";

interface UserXPPanelProps {
  totalXP: number;
  completedCount: number;
  totalScenarios: number;
  onProgressReset?: () => void;
}

export function UserXPPanel({ totalXP, completedCount, totalScenarios, onProgressReset }: UserXPPanelProps) {
  const { data: session } = useSession();
  const [isResetting, setIsResetting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const level = calculateLevel(totalXP);
  const nextLevelXP = Math.pow(level, 2) * 25; // XP necessário para o próximo nível
  const progressToNextLevel = totalXP < nextLevelXP ? (totalXP % nextLevelXP) / nextLevelXP : 1;

  const handleResetProgress = async () => {
    setIsResetting(true);
    try {
      const response = await fetch("/api/playground/reset", {
        method: "POST",
      });

      if (response.ok) {
        setShowResetModal(false);
        // Recarrega a página ou atualiza o estado
        if (onProgressReset) {
          onProgressReset();
        } else {
          window.location.reload();
        }
      } else {
        alert("Erro ao resetar progresso. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao resetar progresso:", error);
      alert("Erro ao resetar progresso. Tente novamente.");
    } finally {
      setIsResetting(false);
    }
  };

  if (!session?.user) {
    return (
      <Card className="p-4">
        <div className="text-center py-6">
          <Zap className="w-8 h-8 text-[#FF6803]/40 mx-auto mb-3" />
          <p className="text-sm text-[#BFBFBF] mb-3">
            Faça login para acompanhar seu progresso e participar do Power Ranking
          </p>
        </div>
      </Card>
    );
  }

  const progressPercentage = Math.round((completedCount / totalScenarios) * 100);

  return (
    <Card className="p-4" data-testid="user-xp-panel">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Seu Progresso</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#FF6803]/10 border border-[#FF6803]/20">
            <Zap className="w-3.5 h-3.5 text-[#FF6803]" />
            <span className="text-xs font-bold text-[#FF6803]">Nível {level}</span>
          </div>
          <button
            onClick={() => setShowResetModal(true)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
            title="Resetar progresso"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#BFBFBF] hover:text-white" />
          </button>
        </div>
      </div>

      {/* XP Display */}
      <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-[#FF6803]/10 to-[#AE3A02]/10 border border-[#FF6803]/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#BFBFBF]">XP Total</span>
          <span className="text-xs text-[#BFBFBF]">{nextLevelXP} XP</span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-[#FF6803]">{totalXP}</span>
          <span className="text-sm text-[#FF6803]/60">XP</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF6803] to-[#AE3A02] transition-all duration-500"
            style={{ width: `${progressToNextLevel * 100}%` }}
          />
        </div>
        <p className="text-xs text-[#BFBFBF] mt-2">
          {Math.round(progressToNextLevel * 100)}% para o nível {level + 1}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-[#BFBFBF]">Concluídas</span>
          </div>
          <p className="text-lg font-bold text-white">
            {completedCount}
            <span className="text-sm font-normal text-[#BFBFBF]">/{totalScenarios}</span>
          </p>
        </div>

        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-[#BFBFBF]">Progresso</span>
          </div>
          <p className="text-lg font-bold text-white">{progressPercentage}%</p>
        </div>
      </div>

      {/* Motivation Message */}
      {progressPercentage < 100 && (
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-blue-200">
            {progressPercentage === 0
              ? "Comece agora e ganhe seus primeiros XP!"
              : progressPercentage < 30
              ? "Você está indo bem! Continue praticando."
              : progressPercentage < 70
              ? "Ótimo progresso! Siga firme."
              : "Quase lá! Finalize as últimas seções."}
          </p>
        </div>
      )}

      {progressPercentage === 100 && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-xs text-green-200 font-semibold">
            🎉 Parabéns! Você completou 100% do Playground!
          </p>
        </div>
      )}

      {/* Modal de Confirmação de Reset */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Resetar Progresso"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#BFBFBF]">
            Tem certeza que deseja resetar todo o seu progresso? Esta ação irá:
          </p>
          <ul className="list-disc list-inside text-sm text-[#BFBFBF] space-y-1">
            <li>Zerar todo o seu XP acumulado</li>
            <li>Remover todas as seções concluídas</li>
            <li>Resetar seu nível para 1</li>
            <li>Remover sua posição no Power Ranking</li>
          </ul>
          <p className="text-sm text-yellow-400">
            ⚠️ Esta ação não pode ser desfeita!
          </p>
          <div className="flex gap-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setShowResetModal(false)}
              className="flex-1"
              disabled={isResetting}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleResetProgress}
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={isResetting}
            >
              {isResetting ? "Resetando..." : "Confirmar Reset"}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
