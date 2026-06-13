import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils/cn";

export function ProfileCard({
  className,
  children,
  ...rest
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "rounded-2xl bg-zinc-900/55 p-4 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-[2px] max-lg:p-3 lg:p-5",
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}

export function ProfileTag({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-zinc-800/90 px-2 py-0.5 text-xs font-medium text-zinc-200",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  title,
  right,
}: {
  title: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-base font-semibold tracking-tight text-white">{title}</h2>
      {right ? (
        <div className="flex shrink-0 items-center gap-1 text-zinc-500">{right}</div>
      ) : null}
    </div>
  );
}

export function SectionAddButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800/80 hover:text-zinc-300 sm:h-8 sm:w-8"
      aria-label={label}
    >
      <span className="text-lg leading-none">+</span>
    </button>
  );
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function TagRemoveButton({
  onClick,
  label,
  className,
}: {
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm text-zinc-500 transition-colors hover:bg-zinc-700/80 hover:text-zinc-200",
        className,
      )}
    >
      <CloseIcon />
    </button>
  );
}

export function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function SectionDeleteButton({
  onClick,
  label,
  className,
}: {
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-red-950/40 hover:text-red-300 focus-visible:opacity-100 sm:h-8 sm:w-8",
        className,
      )}
      aria-label={label}
    >
      <TrashIcon />
    </button>
  );
}

export function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

export function ProfileEditButton({
  onClick,
  className,
  "aria-label": ariaLabel = "Edit",
}: {
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800/80 hover:text-zinc-300 sm:h-8 sm:w-8",
        className,
      )}
      aria-label={ariaLabel}
    >
      <PencilIcon />
    </button>
  );
}

export function skillLevelDotClass(level: string): string {
  if (level === "Advanced") return "bg-rose-400";
  if (level === "Intermediate") return "bg-amber-400";
  return "bg-emerald-400";
}
