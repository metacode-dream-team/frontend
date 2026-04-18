/**
 * Страница Activity Feed
 */

"use client";

import { GlobalFeed } from "@/widgets/global-feed";

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="mr-auto ml-16 max-w-2xl px-4 py-6 sm:ml-24 sm:px-6 sm:py-8 md:ml-36 lg:ml-44">
        <GlobalFeed useGrouping={true} />
      </div>
    </div>
  );
}

