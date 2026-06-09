"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadDiscussionData,
  normalizePostReactions,
  saveDiscussionData,
  toggleReaction,
  type DiscussionAuthor,
  type DiscussionCategory,
  type DiscussionComment,
  type DiscussionData,
  type DiscussionPost,
  type ReactionKind,
} from "@/entities/discussion";

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useDiscussions() {
  const [data, setData] = useState<DiscussionData>(() => ({
    posts: [],
    commentsByPostId: {},
  }));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadDiscussionData();
    setData({
      posts: loaded.posts.map(normalizePostReactions),
      commentsByPostId: loaded.commentsByPostId,
    });
    setHydrated(true);
  }, []);

  const persist = useCallback((next: DiscussionData) => {
    setData(next);
    saveDiscussionData(next);
  }, []);

  const createPost = useCallback(
    (input: {
      title: string;
      body: string;
      category: DiscussionCategory;
      author: DiscussionAuthor;
    }) => {
      const post: DiscussionPost = {
        id: newId("post"),
        title: input.title.trim(),
        body: input.body.trim(),
        category: input.category,
        author: input.author,
        createdAt: new Date().toISOString(),
        reactions: { like: 0, love: 0, funny: 0, fire: 0, insight: 0 },
        userReactions: {},
      };
      persist({
        ...data,
        posts: [post, ...data.posts],
      });
      return post;
    },
    [data, persist],
  );

  const addComment = useCallback(
    (input: { postId: string; body: string; author: DiscussionAuthor }) => {
      const comment: DiscussionComment = {
        id: newId("comment"),
        postId: input.postId,
        author: input.author,
        body: input.body.trim(),
        createdAt: new Date().toISOString(),
        reactions: { like: 0, love: 0, funny: 0, fire: 0, insight: 0 },
        userReactions: {},
      };
      const existing = data.commentsByPostId[input.postId] ?? [];
      persist({
        ...data,
        commentsByPostId: {
          ...data.commentsByPostId,
          [input.postId]: [...existing, comment],
        },
      });
      return comment;
    },
    [data, persist],
  );

  const togglePostReaction = useCallback(
    (postId: string, userId: string, kind: ReactionKind) => {
      persist({
        ...data,
        posts: data.posts.map((post) => {
          if (post.id !== postId) return post;
          const next = toggleReaction(post.reactions, post.userReactions, userId, kind);
          return { ...post, ...next };
        }),
      });
    },
    [data, persist],
  );

  const toggleCommentReaction = useCallback(
    (postId: string, commentId: string, userId: string, kind: ReactionKind) => {
      const comments = data.commentsByPostId[postId] ?? [];
      persist({
        ...data,
        commentsByPostId: {
          ...data.commentsByPostId,
          [postId]: comments.map((comment) => {
            if (comment.id !== commentId) return comment;
            const next = toggleReaction(comment.reactions, comment.userReactions, userId, kind);
            return { ...comment, ...next };
          }),
        },
      });
    },
    [data, persist],
  );

  const getPostById = useCallback(
    (postId: string) => data.posts.find((p) => p.id === postId) ?? null,
    [data.posts],
  );

  return {
    data,
    hydrated,
    createPost,
    addComment,
    togglePostReaction,
    toggleCommentReaction,
    getPostById,
  };
}
