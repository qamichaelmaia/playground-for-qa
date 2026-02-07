"use client";

import { HTMLAttributes, forwardRef } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "error";
  dot?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", dot = false, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200";
    
    const variants = {
      default: "bg-white/8 border-white/12 text-white",
      primary: "bg-[#FF6803]/10 border-[#FF6803]/30 text-[#FF6803]",
      success: "bg-green-500/10 border-green-500/30 text-green-400",
      warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
      error: "bg-red-500/10 border-red-500/30 text-red-400",
    };

    const dotColors = {
      default: "bg-white",
      primary: "bg-[#FF6803]",
      success: "bg-green-400",
      warning: "bg-yellow-400",
      error: "bg-red-400",
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        data-testid="badge"
        {...props}
      >
        {dot && <span className={`w-2 h-2 rounded-full ${dotColors[variant]}`} data-testid="badge-dot" />}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
