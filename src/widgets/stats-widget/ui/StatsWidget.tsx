import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils/cn";

interface StatsWidgetProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  isEditMode?: boolean;
  onDragStart?: () => void;
  onDrop?: () => void;
  onDragOver?: () => void;
  draggable?: boolean;
  className?: string;
}

export function StatsWidget({
  title,
  subtitle,
  children,
  action,
  isEditMode,
  onDragStart,
  onDrop,
  onDragOver,
  draggable,
  className,
}: StatsWidgetProps) {
  return (
    <article
      draggable={draggable}
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={(event) => {
        event.preventDefault();
        onDragOver?.();
      }}
      className={cn(
        "rounded-2xl border border-slate-800 bg-slate-900/50 p-4",
        isEditMode && "cursor-move",
        className,
      )}
    >
      <header className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          {subtitle ? <p className="text-xs text-slate-400">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          {isEditMode ? (
            <span className="rounded-md border border-slate-700 px-2 py-1 text-slate-400" title="Drag handle">
              ⠿
            </span>
          ) : null}
          {action}
        </div>
      </header>
      {children}
    </article>
  );
}
