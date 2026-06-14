"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DISCUSSION_CATEGORIES,
  commentCount,
  filterAndSortPosts,
  getTopPosts,
  voteScore,
  type DiscussionCategory,
  type DiscussionSort,
} from "@/entities/discussion";
import {
  CreateDiscussionPostModal,
  useDiscussions,
} from "@/features/discussions";
import { Button } from "@/shared/ui/Button";
import { formatTimeAgo } from "@/shared/lib/utils/formatTime";

import { buildDiscussionsAllHref } from "../lib/discussionsUrl";
import { DiscussionsFilterFields } from "./DiscussionsFilterFields";

const TOP_LIMIT = 5;

export function DiscussionsPanel() {
  const { data, hydrated, createPost, isCreatingPost } = useDiscussions();
  const [createOpen, setCreateOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<DiscussionCategory>("common");
  const [sort, setSort] = useState<DiscussionSort>("top");

  const isSearchActive = query.trim().length > 0;

  const filteredPosts = useMemo(
    () =>
      filterAndSortPosts(data.posts, data.commentsByPostId, {
        query,
        category: isSearchActive ? "all" : category,
        sort,
      }),
    [data.posts, data.commentsByPostId, query, category, sort, isSearchActive],
  );

  const showTopPosts = !isSearchActive && sort === "top";
  const showFilteredList = isSearchActive || sort !== "top";

  const filteredListTitle = isSearchActive
    ? "Results"
    : sort === "new"
      ? "New"
      : "Most discussed";

  const topPosts = useMemo(
    () =>
      getTopPosts(data.posts, data.commentsByPostId, {
        category: "all",
        limit: TOP_LIMIT,
      }),
    [data.posts, data.commentsByPostId],
  );

  const categoryLabel = (id: DiscussionCategory) =>
    DISCUSSION_CATEGORIES.find((c) => c.id === id)?.label ?? id;

  const allPostsHref = buildDiscussionsAllHref({ sort, category: "all", query });

  return (
    <>
      <aside className="flex max-h-[calc(100dvh-11rem)] flex-col lg:max-h-[calc(100dvh-6.5rem)]">
        <div className="flex shrink-0 items-center justify-between gap-3 pb-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Discussions</h2>
            <p className="mt-0.5 text-xs text-zinc-500">Questions, ideas, and community projects</p>
          </div>
          <Button variant="accent" size="sm" onClick={() => setCreateOpen(true)}>
            + Post
          </Button>
        </div>

        <DiscussionsFilterFields
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={(value) => {
            if (value !== "all") setCategory(value);
          }}
          sort={sort}
          onSortChange={setSort}
        />

        <div className="panel-scroll mt-5 min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
          {showTopPosts ? (
          <section>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              Top posts
            </h3>
            {!hydrated ? (
              <p className="mt-3 text-sm text-zinc-600">Loading…</p>
            ) : topPosts.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-600">
                {data.posts.length === 0 ? "No posts yet." : "No popular posts yet."}
              </p>
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
                            {voteScore(post.upvotes, post.downvotes)} pts ·{" "}
                            {commentCount(post, data.commentsByPostId)} comments
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
          ) : null}

          {showFilteredList ? (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                {filteredListTitle}
              </h3>
              {!hydrated ? (
                <p className="mt-3 text-sm text-zinc-600">Loading…</p>
              ) : filteredPosts.length === 0 ? (
                <p className="mt-3 text-sm text-zinc-600">Nothing found.</p>
              ) : (
                <ul className="mt-3 divide-y divide-zinc-800/60 overflow-hidden rounded-2xl border border-zinc-800/60">
                  {filteredPosts.slice(0, 8).map((post) => (
                    <li key={post.id}>
                      <Link
                        href={`/feed/discussions/${post.id}`}
                        className="block px-4 py-3 transition-colors hover:bg-zinc-900/50"
                      >
                        <p className="line-clamp-2 text-sm font-medium text-zinc-200">
                          {post.title}
                        </p>
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
          ) : null}
        </div>

        <Link
          href={allPostsHref}
          className="mt-3 block shrink-0 py-1 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500 transition-colors hover:text-violet-300"
        >
          All →
        </Link>
      </aside>

      <CreateDiscussionPostModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={createPost}
        submitting={isCreatingPost}
      />
    </>
  );
}
