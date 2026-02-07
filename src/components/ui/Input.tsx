"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label 
            htmlFor={inputId} 
            className="text-sm font-medium text-white"
            data-testid="input-label"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 rounded-xl
            bg-white/5 border border-white/12
            text-white placeholder:text-[#BFBFBF]
            transition-all duration-200
            focus:outline-none focus:border-[#FF6803] focus:ring-2 focus:ring-[#FF6803]/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
            ${className}
          `}
          data-testid="input-field"
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <span 
            id={`${inputId}-error`} 
            className="text-sm text-red-500"
            data-testid="input-error"
            role="alert"
          >
            {error}
          </span>
        )}
        {helperText && !error && (
          <span 
            id={`${inputId}-helper`} 
            className="text-sm text-[#BFBFBF]"
            data-testid="input-helper"
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
