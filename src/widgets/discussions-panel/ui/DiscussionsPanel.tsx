"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DISCUSSION_CATEGORIES,
  DISCUSSION_SORT_OPTIONS,
  commentCount,
  filterAndSortPosts,
  reactionScore,
  type DiscussionCategory,
  type DiscussionSort,
} from "@/entities/discussion";
import {
  CreateDiscussionPostModal,
  useDiscussions,
} from "@/features/discussions";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils/cn";
import { formatTimeAgo } from "@/shared/lib/utils/formatTime";

const TOP_LIMIT = 6;

export function DiscussionsPanel() {
  const { data, hydrated, createPost } = useDiscussions();
  const [createOpen, setCreateOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<DiscussionCategory | "all">("all");
  const [sort, setSort] = useState<DiscussionSort>("top");

  const filteredPosts = useMemo(
    () =>
      filterAndSortPosts(data.posts, data.commentsByPostId, {
        query,
        category,
        sort,
      }),
    [data.posts, data.commentsByPostId, query, category, sort],
  );

  const topPosts = useMemo(
    () =>
      [...data.posts]
        .sort((a, b) => reactionScore(b.reactions) - reactionScore(a.reactions))
        .slice(0, TOP_LIMIT),
    [data.posts],
  );

  const categoryLabel = (id: DiscussionCategory) =>
    DISCUSSION_CATEGORIES.find((c) => c.id === id)?.label ?? id;

  return (
    <>
      <aside className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Обсуждения</h2>
            <p className="mt-0.5 text-xs text-zinc-500">Вопросы, идеи и проекты сообщества</p>
          </div>
          <Button variant="accent" size="sm" onClick={() => setCreateOpen(true)}>
            + Пост
          </Button>
        </div>

        <div className="rounded-2xl border border-zinc-800/60 bg-[#09090b] p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
            Поиск
          </p>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Заголовок, текст, автор..."
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500/50"
          />

          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
            Категория
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <FilterChip active={category === "all"} onClick={() => setCategory("all")} label="Все" />
            {DISCUSSION_CATEGORIES.map((cat) => (
              <FilterChip
                key={cat.id}
                active={category === cat.id}
                onClick={() => setCategory(cat.id)}
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
                onClick={() => setSort(opt.id)}
                label={opt.label}
              />
            ))}
          </div>
        </div>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
            Топ посты
          </h3>
          {!hydrated ? (
            <p className="mt-3 text-sm text-zinc-600">Загрузка…</p>
          ) : topPosts.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-600">Пока нет постов.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {topPosts.map((post, index) => (
                <li key={post.id}>
                  <Link
                    href={`/feed/discussions/${post.id}`}
                    className="group block rounded-xl border border-zinc-800/60 bg-zinc-950/40 px-3 py-2.5 transition-colors hover:border-violet-500/30 hover:bg-violet-950/10"
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 w-5 shrink-0 text-xs font-bold tabular-nums text-violet-400">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-medium text-zinc-200 group-hover:text-white">
                          {post.title}
                        </p>
                        <p className="mt-1 text-[11px] text-zinc-500">
                          {reactionScore(post.reactions)} очков ·{" "}
                          {commentCount(post.id, data.commentsByPostId)} комм.
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
            {sort === "top" ? "Топ" : sort === "new" ? "Новые" : "Обсуждаемые"}
          </h3>
          {!hydrated ? (
            <p className="mt-3 text-sm text-zinc-600">Загрузка…</p>
          ) : filteredPosts.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-600">Ничего не найдено.</p>
          ) : (
            <ul className="mt-3 divide-y divide-zinc-800/60 overflow-hidden rounded-2xl border border-zinc-800/60">
              {filteredPosts.slice(0, 8).map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/feed/discussions/${post.id}`}
                    className="block px-4 py-3 transition-colors hover:bg-zinc-900/50"
                  >
                    <p className="line-clamp-2 text-sm font-medium text-zinc-200">{post.title}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-zinc-500">
                      <span>{post.author.username}</span>
                      <span>·</span>
                      <span>{formatTimeAgo(post.createdAt)}</span>
                      <span>·</span>
                      <span className="rounded-full border border-zinc-700/80 px-2 py-0.5 text-zinc-400">
                        {categoryLabel(post.category)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>

      <CreateDiscussionPostModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={createPost}
      />
    </>
  );
}

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
