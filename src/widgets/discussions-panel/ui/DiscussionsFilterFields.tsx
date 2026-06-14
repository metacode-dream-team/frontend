"use client";

import {
  DISCUSSION_CATEGORIES,
  DISCUSSION_SORT_OPTIONS,
  type DiscussionCategory,
  type DiscussionSort,
} from "@/entities/discussion";
import { cn } from "@/shared/lib/utils/cn";

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-violet-500/50 bg-violet-950/50 text-violet-200"
          : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200",
      )}
    >
      {label}
    </button>
  );
}

interface DiscussionsFilterFieldsProps {
  query: string;
  onQueryChange: (value: string) => void;
  category: DiscussionCategory | "all";
  onCategoryChange: (value: DiscussionCategory | "all") => void;
  sort: DiscussionSort;
  onSortChange: (value: DiscussionSort) => void;
  showAllCategory?: boolean;
}

export function DiscussionsFilterFields({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  showAllCategory = false,
}: DiscussionsFilterFieldsProps) {
  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-[#09090b] p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">Поиск</p>
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Заголовок, текст, автор..."
        className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500/50"
      />

      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        Категория
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {showAllCategory ? (
          <FilterChip
            active={category === "all"}
            onClick={() => onCategoryChange("all")}
            label="Все"
          />
        ) : null}
        {DISCUSSION_CATEGORIES.map((cat) => (
          <FilterChip
            key={cat.id}
            active={category === cat.id}
            onClick={() => onCategoryChange(cat.id)}
            label={cat.label}
          />
        ))}
      </div>

      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        Сортировка
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {DISCUSSION_SORT_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.id}
            active={sort === opt.id}
            onClick={() => onSortChange(opt.id)}
            label={opt.label}
          />
        ))}
      </div>
    </div>
  );
}
