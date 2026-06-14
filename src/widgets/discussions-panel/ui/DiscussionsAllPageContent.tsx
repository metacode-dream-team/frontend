"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  DISCUSSION_CATEGORIES,
  filterAndSortPosts,
  type DiscussionCategory,
  type DiscussionSort,
} from "@/entities/discussion";
import { CreateDiscussionPostModal, useDiscussions } from "@/features/discussions";
import { Button } from "@/shared/ui/Button";
import { formatTimeAgo } from "@/shared/lib/utils/formatTime";

import { buildDiscussionsAllHref, parseDiscussionsSearchParams } from "../lib/discussionsUrl";
import { DiscussionsFilterFields } from "./DiscussionsFilterFields";

export function DiscussionsAllPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, hydrated, createPost } = useDiscussions();
  const [createOpen, setCreateOpen] = useState(false);

  const initial = useMemo(
    () => parseDiscussionsSearchParams(searchParams),
    [searchParams],
  );

  const [query, setQuery] = useState(initial.query);
  const [category, setCategory] = useState<DiscussionCategory | "all">(initial.category);
  const [sort, setSort] = useState<DiscussionSort>(initial.sort);

  useEffect(() => {
    setQuery(initial.query);
    setCategory(initial.category);
    setSort(initial.sort);
  }, [initial.query, initial.category, initial.sort]);

  useEffect(() => {
    const parsed = parseDiscussionsSearchParams(searchParams);
    if (
      parsed.sort !== sort ||
      parsed.category !== category ||
      parsed.query !== query
    ) {
      router.replace(buildDiscussionsAllHref({ sort, category, query }), { scroll: false });
    }
  }, [sort, category, query, router, searchParams]);

  const filteredPosts = useMemo(
    () =>
      filterAndSortPosts(data.posts, data.commentsByPostId, {
        query,
        category,
        sort,
      }),
    [data.posts, data.commentsByPostId, query, category, sort],
  );

  const categoryLabel = (id: DiscussionCategory) =>
    DISCUSSION_CATEGORIES.find((c) => c.id === id)?.label ?? id;

  const listTitle =
    sort === "top" ? "Топ" : sort === "new" ? "Новые" : "Обсуждаемые";

  return (
    <>
      <div className="min-h-screen bg-black px-4 py-6 text-zinc-100 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link
                href="/feed"
                className="text-xs font-medium text-zinc-500 transition-colors hover:text-violet-300"
              >
                ← К ленте
              </Link>
              <h1 className="mt-2 text-2xl font-semibold text-white">Все посты</h1>
              <p className="mt-1 text-sm text-zinc-500">
                Обсуждения сообщества с фильтрами
              </p>
            </div>
            <Button variant="accent" size="sm" onClick={() => setCreateOpen(true)}>
              + Пост
            </Button>
          </div>

          <div className="mt-6">
            <DiscussionsFilterFields
              query={query}
              onQueryChange={setQuery}
              category={category}
              onCategoryChange={setCategory}
              sort={sort}
              onSortChange={setSort}
              showAllCategory
            />
          </div>

          <section className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              {listTitle}
              {hydrated ? (
                <span className="ml-2 font-normal normal-case tracking-normal text-zinc-600">
                  · {filteredPosts.length}
                </span>
              ) : null}
            </h2>

            {!hydrated ? (
              <p className="mt-4 text-sm text-zinc-600">Загрузка…</p>
            ) : filteredPosts.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-600">Ничего не найдено.</p>
            ) : (
              <ul className="mt-4 divide-y divide-zinc-800/60 overflow-hidden rounded-2xl border border-zinc-800/60">
                {filteredPosts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/feed/discussions/${post.id}`}
                      className="block px-4 py-3.5 transition-colors hover:bg-zinc-900/50"
                    >
                      <p className="text-sm font-medium text-zinc-200">{post.title}</p>
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
        </div>
      </div>

      <CreateDiscussionPostModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={createPost}
      />
    </>
  );
}
