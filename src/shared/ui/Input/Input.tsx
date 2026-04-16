/**
 * Переиспользуемый компонент Input
 */

import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
} from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  /** Icon or prefix inside the field (left) */
  startSlot?: ReactNode;
  /** Toggle or suffix inside the field (right) */
  endSlot?: ReactNode;
  /** Visual preset for auth-style dark fields */
  variant?: "default" | "auth";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      className = "",
      startSlot,
      endSlot,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const isAuth = variant === "auth";
    const leftPad = startSlot ? "pl-10" : "pl-4";
    const rightPad = endSlot ? "pr-11" : "pr-4";

    const shellClass = isAuth
      ? `w-full ${leftPad} ${rightPad} py-2.5 text-sm text-white placeholder:text-zinc-500
          rounded-lg border bg-[#121214] transition-colors
          focus:outline-none focus:ring-2 focus:ring-[#a855f7]/35 focus:border-[#a855f7]/50
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-red-500/80 focus:ring-red-500/40" : "border-zinc-700/80"}`
      : `w-full ${leftPad} ${rightPad} py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"}
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`;

    return (
      <div className="w-full">
        {label && (
          <label
            className={
              isAuth
                ? "mb-1.5 block text-xs font-semibold tracking-wide text-white"
                : "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            }
          >
            {label}
          </label>
        )}
        <div className="relative">
          {startSlot && (
            <span
              className={`pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400 ${isAuth ? "text-zinc-500" : ""}`}
            >
              {startSlot}
            </span>
          )}
          <input
            ref={ref}
            className={`${shellClass} ${className}`}
            {...props}
          />
          {endSlot && (
            <span className="absolute top-1/2 right-2 -translate-y-1/2 text-zinc-400">
              {endSlot}
            </span>
          )}
        </div>
        {error && (
          <p
            className={
              isAuth
                ? "mt-1.5 text-sm text-red-400"
                : "mt-1 text-sm text-red-600 dark:text-red-400"
            }
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
