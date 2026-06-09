"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import {
  DISCUSSION_CATEGORIES,
  type DiscussionAuthor,
  type DiscussionCategory,
} from "@/entities/discussion";
import { useBodyScrollLock } from "@/shared/lib/hooks/useBodyScrollLock";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils/cn";

interface CreateDiscussionPostModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: {
    title: string;
    body: string;
    category: DiscussionCategory;
    author: DiscussionAuthor;
  }) => void;
}

function avatarFallback(seed: string): string {
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}`;
}

export function CreateDiscussionPostModal({
  open,
  onClose,
  onSubmit,
}: CreateDiscussionPostModalProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const profile = useProfileMeStore((s) => s.profile);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<DiscussionCategory>("general");

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setBody("");
      setCategory("general");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!trimmedTitle || !trimmedBody) return;

    const username =
      profile?.username?.trim() ||
      [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
      "developer";
    const authorId = profile?.userId || profile?.id || "guest";
    const avatarUrl = profile?.avatarUrl?.trim() || avatarFallback(username);

    onSubmit({
      title: trimmedTitle,
      body: trimmedBody,
      category,
      author: { id: authorId, username, avatarUrl },
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-discussion-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0a0a0b] p-5 shadow-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="create-discussion-title" className="text-lg font-semibold text-white">
              Новый пост
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Краткий заголовок и текст — без лишнего форматирования.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-400">
            Войдите в аккаунт, чтобы создавать посты.{" "}
            <Link href="/" className="text-violet-300 hover:text-violet-200">
              На главную
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="discussion-title" className="text-xs font-medium text-zinc-400">
                Заголовок
              </label>
              <input
                id="discussion-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                placeholder="О чём хотите поговорить?"
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500/60"
              />
            </div>

            <div>
              <label htmlFor="discussion-body" className="text-xs font-medium text-zinc-400">
                Текст
              </label>
              <textarea
                id="discussion-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                maxLength={4000}
                placeholder="Опишите вопрос, идею или проект..."
                className="mt-1.5 w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500/60"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-zinc-400">Категория</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {DISCUSSION_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      category === cat.id
                        ? "border-violet-500/50 bg-violet-950/50 text-violet-200"
                        : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Отмена
              </Button>
              <Button
                type="submit"
                variant="accent"
                size="sm"
                disabled={!title.trim() || !body.trim()}
              >
                Опубликовать
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
