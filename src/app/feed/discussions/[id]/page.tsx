"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import {
  DISCUSSION_CATEGORIES,
  commentCount,
} from "@/entities/discussion";
import {
  DiscussionCommentItem,
  ReactionBar,
  useDiscussions,
} from "@/features/discussions";
import { Avatar } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui/Button";
import { formatTimeAgo } from "@/shared/lib/utils/formatTime";
import { cn } from "@/shared/lib/utils/cn";

const COMMENTS_PER_PAGE = 15;

function profileHref(username: string): string {
  const slug = username.trim();
  return slug ? `/profile/${encodeURIComponent(slug)}` : "/profile";
}

function avatarFallback(seed: string): string {
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}`;
}

export default function DiscussionPostPage() {
  const params = useParams<{ id: string }>();
  const postId = params.id;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const profile = useProfileMeStore((s) => s.profile);
  const {
    data,
    hydrated,
    addComment,
    togglePostReaction,
    toggleCommentReaction,
    getPostById,
  } = useDiscussions();
  const [commentBody, setCommentBody] = useState("");
  const [page, setPage] = useState(1);

  const post = getPostById(postId);
  const comments = data.commentsByPostId[postId] ?? [];
  const totalComments = comments.length;
  const totalPages = Math.max(1, Math.ceil(totalComments / COMMENTS_PER_PAGE));

  const pageComments = useMemo(() => {
    const start = (page - 1) * COMMENTS_PER_PAGE;
    return comments.slice(start, start + COMMENTS_PER_PAGE);
  }, [comments, page]);

  const currentUserId = profile?.userId || profile?.id || null;
  const activePostReaction = currentUserId
    ? post?.userReactions[currentUserId] ?? null
    : null;

  const categoryLabel =
    DISCUSSION_CATEGORIES.find((c) => c.id === post?.category)?.label ?? post?.category;

  const handleAddComment = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated || !post || !commentBody.trim()) return;

    const username =
      profile?.username?.trim() ||
      [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
      "developer";
    const authorId = profile?.userId || profile?.id || "guest";
    const avatarUrl = profile?.avatarUrl?.trim() || avatarFallback(username);

    addComment({
      postId: post.id,
      body: commentBody,
      author: { id: authorId, username, avatarUrl },
    });
    setCommentBody("");
    setPage(Math.max(1, Math.ceil((totalComments + 1) / COMMENTS_PER_PAGE)));
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-black px-4 py-10 text-center text-zinc-500">
        Загрузка…
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black px-4 py-16 text-center">
        <p className="text-zinc-400">Пост не найден.</p>
        <Link href="/feed" className="mt-4 inline-block text-sm text-violet-300 hover:text-violet-200">
          ← К ленте
        </Link>
      </div>
    );
  }

  const pageStart = totalComments === 0 ? 0 : (page - 1) * COMMENTS_PER_PAGE + 1;
  const pageEnd = Math.min(page * COMMENTS_PER_PAGE, totalComments);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/feed"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          ← К ленте
        </Link>

        <article className="mt-4 overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#0c0c0e]">
          <div className="border-b border-zinc-800/70 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex gap-3">
              <Link href={profileHref(post.author.username)} className="shrink-0">
                <Avatar src={post.author.avatarUrl} alt={post.author.username} size="sm" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <Link
                    href={profileHref(post.author.username)}
                    className="text-sm font-medium text-zinc-200 hover:text-white"
                  >
                    {post.author.username}
                  </Link>
                  <span className="rounded border border-zinc-700/80 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-zinc-500">
                    {categoryLabel}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-zinc-600">{formatTimeAgo(post.createdAt)}</p>
              </div>
            </div>

            <ReactionBar
              reactions={post.reactions}
              activeKind={activePostReaction}
              onToggle={
                currentUserId
                  ? (kind) => togglePostReaction(post.id, currentUserId, kind)
                  : undefined
              }
              className="mt-4"
            />
          </div>

          <div className="px-4 py-5 sm:px-6 sm:py-6">
            <h1 className="text-xl font-bold leading-snug text-white sm:text-2xl">{post.title}</h1>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300 sm:text-base">
              {post.body}
            </p>
          </div>
        </article>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800/60 bg-zinc-950/40 px-4 py-3 text-xs text-zinc-500">
          <span>
            {totalComments === 0
              ? "Комментариев пока нет"
              : `Сообщения ${pageStart}–${pageEnd} из ${totalComments}`}
          </span>
          {totalPages > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={cn(
                  "rounded border border-zinc-700 px-2 py-1 transition-colors",
                  page <= 1 ? "opacity-40" : "hover:border-zinc-500 hover:text-zinc-300",
                )}
              >
                ‹
              </button>
              <span className="tabular-nums text-zinc-400">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={cn(
                  "rounded border border-zinc-700 px-2 py-1 transition-colors",
                  page >= totalPages ? "opacity-40" : "hover:border-zinc-500 hover:text-zinc-300",
                )}
              >
                ›
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-2 divide-y divide-zinc-800/60">
          {pageComments.map((comment, index) => (
            <DiscussionCommentItem
              key={comment.id}
              comment={comment}
              index={(page - 1) * COMMENTS_PER_PAGE + index}
              currentUserId={currentUserId}
              onToggleReaction={
                currentUserId
                  ? (commentId, kind) =>
                      toggleCommentReaction(post.id, commentId, currentUserId, kind)
                  : undefined
              }
            />
          ))}
        </div>

        <section className="mt-6 rounded-2xl border border-zinc-800/60 bg-[#09090b] p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-white">Оставить комментарий</h2>
          {!isAuthenticated ? (
            <p className="mt-3 text-sm text-zinc-500">
              Войдите в аккаунт, чтобы комментировать.
            </p>
          ) : (
            <form onSubmit={handleAddComment} className="mt-3 space-y-3">
              <textarea
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                rows={4}
                placeholder="Напишите ответ..."
                className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500/50"
              />
              <div className="flex justify-end">
                <Button type="submit" variant="accent" size="sm" disabled={!commentBody.trim()}>
                  Отправить
                </Button>
              </div>
            </form>
          )}
        </section>

        <p className="mt-4 text-center text-[11px] text-zinc-600">
          {commentCount(post.id, data.commentsByPostId)} комментариев · обсуждение MetaCode
        </p>
      </div>
    </div>
  );
}
