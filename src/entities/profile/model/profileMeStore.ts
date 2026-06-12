import { create } from "zustand";
import type { CurrentUserProfile } from "./currentUserProfile";
import { normalizeProfileMe } from "./currentUserProfile";
import { fetchProfileMe } from "@/shared/lib/api/platformData";

let fetchMeInflight: Promise<void> | null = null;
let fetchMeToken: string | null = null;

export interface ProfileMeState {
  profile: CurrentUserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchMe: (accessToken: string) => Promise<void>;
  clear: () => void;
}

export const useProfileMeStore = create<ProfileMeState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchMe: async (accessToken: string) => {
    if (!accessToken) {
      fetchMeInflight = null;
      fetchMeToken = null;
      set({ profile: null, error: null, isLoading: false });
      return;
    }

    if (fetchMeInflight && fetchMeToken === accessToken) {
      return fetchMeInflight;
    }

    fetchMeToken = accessToken;
    set({ isLoading: true, error: null });

    fetchMeInflight = (async () => {
      try {
        const raw = await fetchProfileMe(accessToken);
        if (fetchMeToken !== accessToken) {
          return;
        }
        const profile = normalizeProfileMe(raw);
        set({ profile, isLoading: false, error: null });
      } catch (e) {
        if (fetchMeToken !== accessToken) {
          return;
        }
        const message = e instanceof Error ? e.message : "Failed to load profile";
        console.warn("[ProfileMe]", message);
        set({ profile: null, isLoading: false, error: message });
      } finally {
        if (fetchMeToken === accessToken) {
          fetchMeInflight = null;
        }
      }
    })();

    return fetchMeInflight;
  },

  clear: () => set({ profile: null, error: null, isLoading: false }),
}));
