"use client";

import { useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import { useProfileMeStore } from "@/entities/profile";
import {
  ProfileAvatarUpload,
  ProfileBasicsFields,
  useProfileBasicsForm,
  useUploadProfileAvatar,
} from "@/features/profile-basics";
import { Button } from "@/shared/ui/Button";

interface EditProfileBasicsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileBasicsModal({
  open,
  onOpenChange,
}: EditProfileBasicsModalProps) {
  const titleId = useId();
  const router = useRouter();
  const profile = useProfileMeStore((s) => s.profile);
  const previousUsername = profile?.username?.trim() ?? "";

  const { values, setField, resetFromProfile, submit, isLoading, error } =
    useProfileBasicsForm({
      mode: "intro",
      onSuccess: (newUsername) => {
        onOpenChange(false);
        if (
          previousUsername &&
          newUsername &&
          previousUsername.toLowerCase() !== newUsername.toLowerCase()
        ) {
          router.replace(`/profile/${encodeURIComponent(newUsername)}`);
        }
      },
    });

  const avatarUpload = useUploadProfileAvatar();
  const formBusy = isLoading || avatarUpload.isUploading;

  useEffect(() => {
    if (!open) return;
    resetFromProfile(profile);
    avatarUpload.clearPreview();
  }, [open, profile, resetFromProfile, avatarUpload.clearPreview]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !formBusy) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange, formBusy]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
        aria-label="Close"
        disabled={formBusy}
        onClick={() => onOpenChange(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[101] w-full max-w-[520px] rounded-2xl border border-zinc-800/90 bg-[#161618] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.65)]"
      >
        <div className="mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c4a3f7]">
            Profile
          </p>
          <h2 id={titleId} className="mt-1 text-xl font-bold tracking-tight text-white">
            Edit profile
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Update your photo, name, username, headline, links, and location.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ProfileAvatarUpload
            avatarUrl={profile?.avatarUrl}
            previewUrl={avatarUpload.previewUrl}
            isUploading={avatarUpload.isUploading}
            error={avatarUpload.error}
            disabled={formBusy}
            inputRef={avatarUpload.inputRef}
            onOpenFilePicker={avatarUpload.openFilePicker}
            onFileChange={avatarUpload.handleFileChange}
          />

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-500/35 bg-red-950/35 px-4 py-3 text-sm text-red-100"
            >
              {error}
            </div>
          )}

          <ProfileBasicsFields
            values={values}
            setField={setField}
            disabled={formBusy}
            showLinks
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800/80"
              disabled={formBusy}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              className="flex-1"
              isLoading={isLoading}
              disabled={formBusy}
            >
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
