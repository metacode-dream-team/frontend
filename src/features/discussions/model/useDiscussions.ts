"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import type {
  DiscussionAuthor,
  DiscussionCategory,
  DiscussionData,
  DiscussionPost,
  VoteKind,
} from "@/entities/discussion";
import {
  mapCommentListFromApi,
  mapDiscussionFromApi,
  mapDiscussionListFromApi,
} from "@/entities/discussion/lib/discussionMappers";
import {
  createDiscussion,
  createDiscussionComment,
  fetchDiscussionById,
  fetchDiscussionComments,
  fetchDiscussions,
  voteComment,
  voteDiscussion,
} from "@/shared/lib/api/discussionApi";

export function useDiscussions() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const profile = useProfileMeStore((s) => s.profile);
  const currentUserId = profile?.userId || profile?.id || null;

  const [data, setData] = useState<DiscussionData>(() => ({
    posts: [],
    commentsByPostId: {},
  }));
  const [hydrated, setHydrated] = useState(false);
  const [loadingPostId, setLoadingPostId] = useState<string | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const buildCurrentAuthor = useCallback((): DiscussionAuthor => {
    const username =
      profile?.username?.trim() ||
      [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
      "developer";
    const id = profile?.userId || profile?.id || "unknown";
    const avatarUrl =
      profile?.avatarUrl?.trim() ||
      `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(username)}`;
    return { id, username, avatarUrl };
  }, [profile]);

  const enrichPostAuthor = useCallback(
    (post: DiscussionPost, fallback: DiscussionAuthor): DiscussionPost => ({
      ...post,
      author: {
        id: post.author.id !== "unknown" ? post.author.id : fallback.id,
        username: fallback.username,
        avatarUrl: fallback.avatarUrl,
      },
    }),
    [],
  );

  const upsertPost = useCallback((post: DiscussionPost) => {
    setData((prev) => ({
      ...prev,
      posts: prev.posts.some((p) => p.id === post.id)
        ? prev.posts.map((p) => (p.id === post.id ? post : p))
        : [post, ...prev.posts],
    }));
  }, []);

  const refreshPosts = useCallback(async () => {
    try {
      const raw = await fetchDiscussions(accessToken);
      const posts = mapDiscussionListFromApi(raw, currentUserId);
      setData((prev) => ({ ...prev, posts }));
    } catch (err) {
      console.error("Failed to load discussions", err);
    } finally {
      setHydrated(true);
    }
  }, [accessToken, currentUserId]);

  useEffect(() => {
    void refreshPosts();
  }, [refreshPosts]);

  const refreshPost = useCallback(
    async (postId: string) => {
      try {
        const raw = await fetchDiscussionById(postId, accessToken);
        const post = mapDiscussionFromApi(raw, currentUserId);
        if (post) upsertPost(post);
      } catch (err) {
        console.error("Failed to load discussion", postId, err);
      }
    },
    [accessToken, currentUserId, upsertPost],
  );

  const ensurePostLoaded = useCallback(
    async (postId: string) => {
      setLoadingPostId(postId);
      try {
        await refreshPost(postId);
      } finally {
        setLoadingPostId((current) => (current === postId ? null : current));
      }
    },
    [refreshPost],
  );

  const loadComments = useCallback(
    async (postId: string) => {
      try {
        const raw = await fetchDiscussionComments(postId, accessToken);
        const comments = mapCommentListFromApi(raw, currentUserId);
        setData((prev) => ({
          ...prev,
          commentsByPostId: { ...prev.commentsByPostId, [postId]: comments },
        }));
      } catch (err) {
        console.error("Failed to load comments", postId, err);
      }
    },
    [accessToken, currentUserId],
  );

  const createPost = useCallback(
    async (input: {
      title: string;
      body: string;
      category: DiscussionCategory;
    }): Promise<DiscussionPost> => {
      const title = input.title.trim();
      const body = input.body.trim();
      if (!title || !body) {
        throw new Error("Fill in the title and body");
      }
      if (!accessToken) {
        throw new Error("Sign in to create a post");
      }

      setIsCreatingPost(true);
      try {
        const raw = await createDiscussion(accessToken, {
          title,
          content: body,
          category: input.category,
        });
        const mapped = mapDiscussionFromApi(raw, currentUserId);
        if (!mapped) {
          await refreshPosts();
          throw new Error("Failed to process server response");
        }

        const post = enrichPostAuthor(mapped, buildCurrentAuthor());
        upsertPost(post);
        return post;
      } finally {
        setIsCreatingPost(false);
      }
    },
    [
      accessToken,
      currentUserId,
      upsertPost,
      refreshPosts,
      enrichPostAuthor,
      buildCurrentAuthor,
    ],
  );

  const addComment = useCallback(
    (input: { postId: string; body: string; author: DiscussionAuthor }) => {
      void (async () => {
        if (!accessToken) return;
        try {
          await createDiscussionComment(accessToken, input.postId, input.body);
          await loadComments(input.postId);
          setData((prev) => ({
            ...prev,
            posts: prev.posts.map((p) =>
              p.id === input.postId ? { ...p, commentCount: p.commentCount + 1 } : p,
            ),
          }));
        } catch (err) {
          console.error("Failed to create comment", err);
        }
      })();
    },
    [accessToken, loadComments],
  );

  const togglePostVote = useCallback(
    (postId: string, _userId: string, kind: VoteKind) => {
      void (async () => {
        if (!accessToken) return;
        try {
          await voteDiscussion(accessToken, postId, kind);
          await refreshPost(postId);
        } catch (err) {
          console.error("Failed to vote on discussion", err);
        }
      })();
    },
    [accessToken, refreshPost],
  );

  const toggleCommentVote = useCallback(
    (postId: string, commentId: string, _userId: string, kind: VoteKind) => {
      void (async () => {
        if (!accessToken) return;
        try {
          await voteComment(accessToken, commentId, kind);
          await loadComments(postId);
        } catch (err) {
          console.error("Failed to vote on comment", err);
        }
      })();
    },
    [accessToken, loadComments],
  );

  const getPostById = useCallback(
    (postId: string) => data.posts.find((p) => p.id === postId) ?? null,
    [data.posts],
  );

  return {
    data,
    hydrated,
    loadingPostId,
    isCreatingPost,
    createPost,
    addComment,
    togglePostVote,
    toggleCommentVote,
    getPostById,
    ensurePostLoaded,
    loadComments,
    refreshPosts,
  };
}
