"use client";

import { cn } from "@/shared/lib/utils/cn";

interface AuthSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export function AuthSelect({
  id,
  label,
  value,
  onChange,
  disabled,
  children,
}: AuthSelectProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold tracking-wide text-white"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "w-full rounded-lg border border-zinc-700/80 bg-[#121214] px-4 py-2.5 text-sm text-white",
          "transition-colors focus:border-[#a855f7]/50 focus:outline-none focus:ring-2 focus:ring-[#a855f7]/35",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {children}
      </select>
    </div>
  );
}
