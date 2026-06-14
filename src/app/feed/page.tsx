/**
 * Страница Activity Feed + Обсуждения
 */

"use client";

import { useState } from "react";
import { GlobalFeed } from "@/widgets/global-feed";
import { DiscussionsPanel } from "@/widgets/discussions-panel";
import { cn } from "@/shared/lib/utils/cn";

type MobilePanel = "feed" | "discussions";

export default function FeedPage() {
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("feed");

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div
          className="mb-6 flex gap-2 rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-1 lg:hidden"
          role="tablist"
          aria-label="Feed panels"
        >
          {(
            [
              { id: "feed" as const, label: "Activity" },
              { id: "discussions" as const, label: "Discussions" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={mobilePanel === tab.id}
              onClick={() => setMobilePanel(tab.id)}
              className={cn(
                "min-h-11 flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                mobilePanel === tab.id
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="lg:hidden">
          {mobilePanel === "feed" ? (
            <section aria-label="Activity feed" role="tabpanel" className="min-w-0">
              <GlobalFeed useGrouping={true} />
            </section>
          ) : (
            <section aria-label="Discussions" role="tabpanel" className="min-w-0">
              <DiscussionsPanel />
            </section>
          )}
        </div>

        <div className="hidden gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section aria-label="Activity feed" className="min-w-0">
            <GlobalFeed useGrouping={true} />
          </section>
          <section
            aria-label="Discussions"
            className="min-w-0 lg:sticky lg:top-20 lg:z-10 lg:self-start"
          >
            <DiscussionsPanel />
          </section>
        </div>
      </div>
    </div>
  );
}
