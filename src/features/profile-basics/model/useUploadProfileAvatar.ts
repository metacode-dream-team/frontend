"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import { uploadProfileAvatar } from "@/shared/lib/api/platformData";
import { formatProfileFillError } from "../lib/profileBasicsForm";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function validateAvatarFile(file: File): string | null {
  if (!ACCEPTED_TYPES.has(file.type)) {
    return "Please choose a JPEG, PNG, WebP, or GIF image.";
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return "Image must be 5 MB or smaller.";
  }
  return null;
}

export function useUploadProfileAvatar(options?: { onSuccess?: () => void }) {
  const onSuccess = options?.onSuccess;
  const accessToken = useAuthStore((s) => s.accessToken);
  const fetchMe = useProfileMeStore((s) => s.fetchMe);
  const inputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const openFilePicker = useCallback(() => {
    if (isUploading) return;
    inputRef.current?.click();
  }, [isUploading]);

  const uploadFile = useCallback(
    async (file: File): Promise<boolean> => {
      setError(null);

      const validationError = validateAvatarFile(file);
      if (validationError) {
        setError(validationError);
        return false;
      }

      if (!accessToken) {
        setError("You must be signed in to upload an avatar.");
        return false;
      }

      const localPreview = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) {
          URL.revokeObjectURL(prev);
        }
        return localPreview;
      });

      setIsUploading(true);

      try {
        await uploadProfileAvatar(accessToken, file);
        await fetchMe(accessToken);
        setPreviewUrl(null);
        onSuccess?.();
        return true;
      } catch (err) {
        setPreviewUrl((prev) => {
          if (prev?.startsWith("blob:")) {
            URL.revokeObjectURL(prev);
          }
          return null;
        });
        setError(formatProfileFillError(err));
        return false;
      } finally {
        setIsUploading(false);
      }
    },
    [accessToken, fetchMe, onSuccess],
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      await uploadFile(file);
    },
    [uploadFile],
  );

  const clearPreview = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
    setError(null);
  }, []);

  return {
    inputRef,
    previewUrl,
    isUploading,
    error,
    openFilePicker,
    handleFileChange,
    clearPreview,
  };
}
