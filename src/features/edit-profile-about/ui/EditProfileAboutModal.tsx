"use client";

import { useEffect, useId } from "react";
import { useProfileMeStore } from "@/entities/profile";
import { useBodyScrollLock } from "@/shared/lib/hooks/useBodyScrollLock";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils/cn";
import {
  profileModalOverlayClass,
  profileModalBackdropClassName,
  profileModalScrollClassName,
  profileModalScrollInnerClassName,
  profileModalPanelClassName,
} from "@/features/profile-forms";
import { useEditProfileAbout } from "../model/useEditProfileAbout";

interface EditProfileAboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileAboutModal({
  open,
  onOpenChange,
}: EditProfileAboutModalProps) {
  const titleId = useId();
  const profile = useProfileMeStore((s) => s.profile);

  const { about, setAbout, resetFromProfile, submit, isLoading, error } =
    useEditProfileAbout({
      onSuccess: () => onOpenChange(false),
    });

  useEffect(() => {
    if (!open) return;
    resetFromProfile(profile?.about);
  }, [open, profile?.about, resetFromProfile]);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange, isLoading]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit();
  };

  return (
    <div className={profileModalOverlayClass()}>
      <div className={profileModalBackdropClassName} aria-hidden />

      <div
        className={profileModalScrollClassName}
        onClick={() => {
          if (!isLoading) {
            onOpenChange(false);
          }
        }}
      >
        <div className={profileModalScrollInnerClassName}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`${profileModalPanelClassName} max-w-[520px]`}
            onClick={(e) => e.stopPropagation()}
          >
        <div className="mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c4a3f7]">
            Profile
          </p>
          <h2 id={titleId} className="mt-1 text-xl font-bold tracking-tight text-white">
            Edit about
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Tell others a bit about yourself.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-500/35 bg-red-950/35 px-4 py-3 text-sm text-red-100"
            >
              {error}
            </div>
          )}

          <div className="w-full">
            <label
              htmlFor="profile-about"
              className="mb-1.5 block text-xs font-semibold tracking-wide text-white"
            >
              About
            </label>
            <textarea
              id="profile-about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="I am genius"
              rows={5}
              required
              disabled={isLoading}
              className={cn(
                "w-full resize-y rounded-lg border border-zinc-700/80 bg-[#121214] px-4 py-2.5 text-sm text-white",
                "placeholder:text-zinc-500 transition-colors",
                "focus:border-[#a855f7]/50 focus:outline-none focus:ring-2 focus:ring-[#a855f7]/35",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800/80"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              className="flex-1"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Save changes
            </Button>
          </div>
        </form>
          </div>
        </div>
      </div>
    </div>
  );
}
