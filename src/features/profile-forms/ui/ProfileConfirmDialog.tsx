"use client";

import { useEffect, useId } from "react";
import { Button } from "@/shared/ui/Button";

interface ProfileConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  isLoading?: boolean;
  error?: string | null;
  onConfirm: () => void | Promise<void | boolean>;
  onCancel: () => void;
  zIndexClassName?: string;
}

export function ProfileConfirmDialog({
  open,
  title,
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  isLoading = false,
  error = null,
  onConfirm,
  onCancel,
  zIndexClassName = "z-[110]",
}: ProfileConfirmDialogProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onCancel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel, isLoading]);

  if (!open) {
    return null;
  }

  return (
    <div className={`fixed inset-0 ${zIndexClassName} flex items-center justify-center p-4`}>
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
        aria-label="Close"
        disabled={isLoading}
        onClick={onCancel}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[101] w-full max-w-[420px] rounded-2xl border border-zinc-800/90 bg-[#161618] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.65)]"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c4a3f7]">
          Profile
        </p>
        <h2 id={titleId} className="mt-1 text-xl font-bold tracking-tight text-white">
          {title}
        </h2>
        <p className="mt-2 text-sm text-zinc-400">{description}</p>

        {error ? (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-500/35 bg-red-950/35 px-4 py-3 text-sm text-red-100"
          >
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800/80"
            disabled={isLoading}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-red-500/40 bg-red-950/30 text-red-200 hover:bg-red-950/50"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={() => void onConfirm()}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
