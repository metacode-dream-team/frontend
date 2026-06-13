"use client";

import { useEffect, useId, type ReactNode } from "react";
import { useBodyScrollLock } from "@/shared/lib/hooks/useBodyScrollLock";
import {
  profileModalOverlayClass,
  profileModalBackdropClassName,
  profileModalScrollClassName,
  profileModalScrollInnerClassName,
  profileModalPanelClassName,
} from "../lib/profileModalClasses";

interface ProfileViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  canEdit?: boolean;
  onEdit?: () => void;
  children: ReactNode;
  maxWidthClassName?: string;
}

export function ProfileViewModal({
  open,
  onOpenChange,
  title,
  description,
  canEdit = false,
  onEdit,
  children,
  maxWidthClassName = "max-w-[520px]",
}: ProfileViewModalProps) {
  const titleId = useId();

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  return (
    <div className={profileModalOverlayClass()}>
      <div className={profileModalBackdropClassName} aria-hidden />

      <div
        className={profileModalScrollClassName}
        onClick={() => onOpenChange(false)}
      >
        <div className={profileModalScrollInnerClassName}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`${profileModalPanelClassName} ${maxWidthClassName}`}
            onClick={(e) => e.stopPropagation()}
          >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c4a3f7]">
              Profile
            </p>
            <h2 id={titleId} className="mt-1 text-xl font-bold tracking-tight text-white">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-zinc-400">{description}</p>
            ) : null}
          </div>
          {canEdit && onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800/80 hover:text-zinc-300"
              aria-label={`Edit ${title.toLowerCase()}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          ) : null}
        </div>

        {children}
          </div>
        </div>
      </div>
    </div>
  );
}
