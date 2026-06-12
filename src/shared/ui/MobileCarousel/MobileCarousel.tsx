"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/shared/lib/utils/cn";

interface MobileCarouselProps {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  /** Tailwind breakpoint prefix where carousel hides (default: md) */
  breakpoint?: "sm" | "md" | "lg";
}

function NavButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-950/90 text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

const HIDE_AT: Record<NonNullable<MobileCarouselProps["breakpoint"]>, string> = {
  sm: "sm:hidden",
  md: "md:hidden",
  lg: "lg:hidden",
};

export function MobileCarousel({
  children,
  className,
  itemClassName,
  breakpoint = "md",
}: MobileCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = children.length;
  const hideClass = HIDE_AT[breakpoint];

  if (count === 0) return null;

  const safeIndex = Math.min(index, count - 1);

  return (
    <div className={cn(hideClass, className)}>
      <div className={itemClassName}>{children[safeIndex]}</div>
      {count > 1 ? (
        <nav className="mt-5 flex items-center justify-between gap-3">
          <NavButton
            label="Previous slide"
            disabled={safeIndex <= 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="m15 18-6-6 6-6" />
            </svg>
          </NavButton>
          <div className="flex items-center gap-2">
            {children.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === safeIndex ? "true" : undefined}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  i === safeIndex ? "w-6 bg-violet-400" : "w-2.5 bg-zinc-700 hover:bg-zinc-500",
                )}
              />
            ))}
          </div>
          <NavButton
            label="Next slide"
            disabled={safeIndex >= count - 1}
            onClick={() => setIndex((i) => Math.min(count - 1, i + 1))}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </NavButton>
        </nav>
      ) : null}
    </div>
  );
}
