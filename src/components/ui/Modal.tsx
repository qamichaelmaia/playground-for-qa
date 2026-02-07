"use client";

import { useEffect, forwardRef, HTMLAttributes } from "react";
import { X } from "lucide-react";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, size = "lg", children, className = "", ...props }, ref) => {
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
      };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
      sm: "max-w-md",
      md: "max-w-2xl",
      lg: "max-w-4xl",
      xl: "max-w-6xl",
      full: "max-w-[95vw]",
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        data-testid="modal-overlay"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          data-testid="modal-backdrop"
        />

        {/* Modal Content */}
        <div
          ref={ref}
          className={`relative w-full ${sizes[size]} bg-[#0B0501]/95 backdrop-blur-xl border border-white/12 rounded-2xl shadow-2xl overflow-hidden ${className}`}
          data-testid="modal-content"
          {...props}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-[#BFBFBF] hover:text-white hover:bg-white/5 transition-colors"
            data-testid="modal-close-button"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-white/12">
              <h2 className="text-2xl font-semibold text-white" data-testid="modal-title">
                {title}
              </h2>
            </div>
          )}

          {/* Body */}
          <div className="max-h-[80vh] overflow-y-auto modal-scrollbar" data-testid="modal-body">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";

export { Modal };
