"use client";

import { useEffect, useId, type ReactNode } from "react";
import { useBodyScrollLock } from "@/shared/lib/hooks/useBodyScrollLock";
import { Button } from "@/shared/ui/Button";
import {
  profileModalOverlayClass,
  profileModalBackdropClassName,
  profileModalScrollClassName,
  profileModalScrollInnerClassName,
  profileModalPanelClassName,
} from "../lib/profileModalClasses";

interface ProfileFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  submitLabel: string;
  isLoading: boolean;
  error: string | null;
  onSubmit: () => void | Promise<void | boolean>;
  children: ReactNode;
  maxWidthClassName?: string;
  zIndexClassName?: string;
}

export function ProfileFormModal({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  isLoading,
  error,
  onSubmit,
  children,
  maxWidthClassName = "max-w-[520px]",
  zIndexClassName = "z-[100]",
}: ProfileFormModalProps) {
  const titleId = useId();

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange, isLoading]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <div className={profileModalOverlayClass(zIndexClassName)}>
      <div className={profileModalBackdropClassName} aria-hidden />

      <div
        className={profileModalScrollClassName}
        onClick={() => {
          if (!isLoading) {
            onOpenChange(false);
          }
        }}
      >
        <div className={profileModalScrollInnerClassName}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`${profileModalPanelClassName} ${maxWidthClassName}`}
            onClick={(e) => e.stopPropagation()}
          >
        <div className="mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c4a3f7]">
            Profile
          </p>
          <h2 id={titleId} className="mt-1 text-xl font-bold tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <div
              role="alert"
              className="rounded-lg border border-red-500/35 bg-red-950/35 px-4 py-3 text-sm text-red-100"
            >
              {error}
            </div>
          ) : null}

          {children}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800/80"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              className="flex-1"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {submitLabel}
            </Button>
          </div>
        </form>
          </div>
        </div>
      </div>
    </div>
  );
}
