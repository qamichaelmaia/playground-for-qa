"use client";

import { useEffect, useState } from "react";
import { Zap, X } from "lucide-react";

interface XPToastProps {
  show: boolean;
  xpGained: number;
  totalXP: number;
  onClose: () => void;
}

export function XPToast({ show, xpGained, totalXP, onClose }: XPToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      data-testid="xp-toast"
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#FF6803] to-[#AE3A02] text-white shadow-[0_8px_30px_rgba(255,104,3,0.5)] border border-[#FF6803]/30">
        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">+{xpGained} XP</p>
          <p className="text-xs opacity-90">Total: {totalXP} XP</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
