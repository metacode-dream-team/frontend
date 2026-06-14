"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import type { DiscussionCategory, DiscussionPost } from "@/entities/discussion";
import { DISCUSSION_CATEGORIES } from "@/entities/discussion";
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
  }) => Promise<DiscussionPost>;
  submitting?: boolean;
}

export function CreateDiscussionPostModal({
  open,
  onClose,
  onSubmit,
  submitting = false,
}: CreateDiscussionPostModalProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<DiscussionCategory>("general");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isBusy = submitting || pending;

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setBody("");
      setCategory("general");
      setError(null);
      setPending(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!trimmedTitle || !trimmedBody || isBusy) return;

    setPending(true);
    setError(null);
    try {
      await onSubmit({
        title: trimmedTitle,
        body: trimmedBody,
        category,
      });
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create post. Please try again.";
      setError(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-discussion-title"
      onClick={isBusy ? undefined : onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0a0a0b] p-5 shadow-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="create-discussion-title" className="text-lg font-semibold text-white">
              New post
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              A short title and plain text — no rich formatting.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="rounded-lg p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-40"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-400">
            Sign in to create posts.{" "}
            <Link href="/" className="text-violet-300 hover:text-violet-200">
              Go home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error ? (
              <p className="rounded-lg border border-red-500/30 bg-red-950/30 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            ) : null}

            <div>
              <label htmlFor="discussion-title" className="text-xs font-medium text-zinc-400">
                Title
              </label>
              <input
                id="discussion-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                disabled={isBusy}
                placeholder="What do you want to talk about?"
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500/60 disabled:opacity-60"
              />
            </div>

            <div>
              <label htmlFor="discussion-body" className="text-xs font-medium text-zinc-400">
                Body
              </label>
              <textarea
                id="discussion-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                maxLength={4000}
                disabled={isBusy}
                placeholder="Describe your question, idea, or project..."
                className="mt-1.5 w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500/60 disabled:opacity-60"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-zinc-400">Category</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {DISCUSSION_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    disabled={isBusy}
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60",
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
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isBusy}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="accent"
                size="sm"
                disabled={!title.trim() || !body.trim() || isBusy}
              >
                {isBusy ? "Publishing…" : "Publish"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
