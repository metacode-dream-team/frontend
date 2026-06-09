"use client";

import { useCallback, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import { formatProfileFillError } from "@/features/profile-basics";
import {
  deleteProfileCertification,
  deleteProfileEducation,
  deleteProfileExperience,
  deleteProfileLanguage,
  deleteProfileSkill,
} from "@/shared/lib/api/platformData";

export type ProfileMeDeleteResource =
  | "certifications"
  | "educations"
  | "experiences"
  | "languages"
  | "skills";

export interface ProfileDeletePending {
  resource: ProfileMeDeleteResource;
  id: string;
  label: string;
}

const deleteByResource: Record<
  ProfileMeDeleteResource,
  (accessToken: string, id: string) => Promise<void>
> = {
  certifications: deleteProfileCertification,
  educations: deleteProfileEducation,
  experiences: deleteProfileExperience,
  languages: deleteProfileLanguage,
  skills: deleteProfileSkill,
};

export function useProfileDeleteItem() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const fetchMe = useProfileMeStore((s) => s.fetchMe);

  const [pending, setPending] = useState<ProfileDeletePending | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestDelete = useCallback(
    (resource: ProfileMeDeleteResource, id: string, label: string) => {
      setPending({ resource, id, label });
      setError(null);
    },
    [],
  );

  const cancelDelete = useCallback(() => {
    if (isDeleting) return;
    setPending(null);
    setError(null);
  }, [isDeleting]);

  const confirmDelete = useCallback(async (): Promise<boolean> => {
    if (!pending) return false;

    setError(null);

    if (!accessToken) {
      setError("You must be signed in to delete this item.");
      return false;
    }

    setIsDeleting(true);

    try {
      await deleteByResource[pending.resource](accessToken, pending.id);
      await fetchMe(accessToken);
      setPending(null);
      return true;
    } catch (err) {
      setError(formatProfileFillError(err));
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [accessToken, fetchMe, pending]);

  return {
    pending,
    requestDelete,
    cancelDelete,
    confirmDelete,
    isDeleting,
    error,
  };
}
