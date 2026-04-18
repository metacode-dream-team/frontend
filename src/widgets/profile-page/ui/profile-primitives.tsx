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
        "rounded-2xl bg-zinc-900/55 p-5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-[2px]",
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
      <div className="flex shrink-0 items-center gap-1 text-zinc-500">
        {right ?? (
          <>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800/80 hover:text-zinc-300"
              aria-label="Add"
            >
              <span className="text-lg leading-none">+</span>
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800/80 hover:text-zinc-300"
              aria-label="Edit"
            >
              <PencilIcon />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

export function skillLevelDotClass(level: string): string {
  if (level === "Advanced") return "bg-rose-400";
  if (level === "Intermediate") return "bg-amber-400";
  return "bg-emerald-400";
}
