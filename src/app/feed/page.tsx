/**
 * Страница Activity Feed
 */

"use client";

import { GlobalFeed } from "@/widgets/global-feed";

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Activity Feed</h1>
          <p className="text-gray-400 text-sm">
            Лента активности пользователей платформы
          </p>
        </div>

        {/* Лента событий */}
        <GlobalFeed useGrouping={true} />
      </div>
    </div>
  );
}

