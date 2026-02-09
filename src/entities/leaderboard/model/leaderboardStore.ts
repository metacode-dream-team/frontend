/**
 * Zustand store для Leaderboard
 */

import { create } from "zustand";
import type { LeaderboardUser } from "./types";

interface LeaderboardStore {
  users: LeaderboardUser[];
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
  currentUserRank: number | null;
  currentUser: LeaderboardUser | null;

  // Actions
  setUsers: (users: LeaderboardUser[]) => void;
  appendUsers: (users: LeaderboardUser[]) => void;
  setCurrentPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setCurrentUserRank: (rank: number | null) => void;
  setCurrentUser: (user: LeaderboardUser | null) => void;
  reset: () => void;
}

const initialState = {
  users: [],
  currentPage: 0,
  hasMore: true,
  isLoading: false,
  currentUserRank: null,
  currentUser: null,
};

export const useLeaderboardStore = create<LeaderboardStore>((set) => ({
  ...initialState,

  setUsers: (users) => set({ users }),
  
  appendUsers: (users) =>
    set((state) => ({
      users: [...state.users, ...users],
    })),

  setCurrentPage: (page) => set({ currentPage: page }),

  setHasMore: (hasMore) => set({ hasMore }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setCurrentUserRank: (rank) => set({ currentUserRank: rank }),

  setCurrentUser: (user) => set({ currentUser: user }),

  reset: () => set(initialState),
}));

