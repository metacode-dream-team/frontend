/**
 * Страница Activity Feed + Обсуждения
 */

"use client";

import { GlobalFeed } from "@/widgets/global-feed";
import { DiscussionsPanel } from "@/widgets/discussions-panel";

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section aria-label="Activity feed" className="min-w-0">
          <GlobalFeed useGrouping={true} />
        </section>
        <section aria-label="Discussions" className="min-w-0 lg:sticky lg:top-20 lg:self-start">
          <DiscussionsPanel />
        </section>
      </div>
    </div>
  );
}
