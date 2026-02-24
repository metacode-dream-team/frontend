import type { ActivitySource } from "@/entities/stats";
import { cn } from "@/shared/lib/utils/cn";

export type ActivityFilterValue = "all" | ActivitySource;

interface ActivitySourceFilterProps {
  value: ActivityFilterValue;
  onChange: (value: ActivityFilterValue) => void;
}

const tabs: ActivityFilterValue[] = ["all", "github", "leetcode", "monkeytype"];

export function ActivitySourceFilter({ value, onChange }: ActivitySourceFilterProps) {
  return (
    <div className="inline-flex rounded-lg border border-slate-700 bg-slate-900 p-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs capitalize transition-colors",
            value === tab
              ? "bg-cyan-500/20 text-cyan-200"
              : "text-slate-400 hover:text-slate-200",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
