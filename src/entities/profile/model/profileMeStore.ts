import { create } from "zustand";
import type { CurrentUserProfile } from "./currentUserProfile";
import { normalizeProfileMe } from "./currentUserProfile";
import { fetchProfileMe } from "@/shared/lib/api/platformData";

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
      set({ profile: null, error: null, isLoading: false });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const raw = await fetchProfileMe(accessToken);
      const profile = normalizeProfileMe(raw);
      set({ profile, isLoading: false, error: null });
    } catch (e) {
      let message = e instanceof Error ? e.message : "Failed to load profile";
      if (e instanceof TypeError && message.includes("Failed to fetch")) {
        message =
          "Cannot reach the API. Check that the backend is running and NEXT_PUBLIC_API_URL is correct.";
      }
      console.warn("[ProfileMe]", message);
      set({ profile: null, isLoading: false, error: message });
    }
  },

  clear: () => set({ profile: null, error: null, isLoading: false }),
}));
