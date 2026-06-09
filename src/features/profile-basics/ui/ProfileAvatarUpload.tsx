"use client";

import Image from "next/image";
import { isRemoteSvgImage } from "@/shared/lib/utils/isRemoteSvgImage";
import { shouldUseNativeImgForRemoteUrl } from "@/shared/lib/utils/remoteImagePlain";
import { Button } from "@/shared/ui/Button";

interface ProfileAvatarUploadProps {
  avatarUrl?: string | null;
  previewUrl?: string | null;
  isUploading?: boolean;
  error?: string | null;
  disabled?: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onOpenFilePicker: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileAvatarUpload({
  avatarUrl,
  previewUrl,
  isUploading = false,
  error = null,
  disabled = false,
  inputRef,
  onOpenFilePicker,
  onFileChange,
}: ProfileAvatarUploadProps) {
  const displayUrl = previewUrl || avatarUrl?.trim() || "";
  const plain = displayUrl ? shouldUseNativeImgForRemoteUrl(displayUrl) : false;

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-900 shadow-inner">
        {displayUrl ? (
          plain || previewUrl ? (
            <img
              src={displayUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <Image
              src={displayUrl}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
              unoptimized={isRemoteSvgImage(displayUrl)}
            />
          )
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
            No photo
          </span>
        )}
        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-[10px] font-medium text-zinc-200">
            Uploading…
          </div>
        ) : null}
      </div>

      <div className="min-w-0 text-center sm:text-left">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          disabled={disabled || isUploading}
          onChange={onFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800/80"
          disabled={disabled || isUploading}
          onClick={onOpenFilePicker}
        >
          Change photo
        </Button>
        <p className="mt-1.5 text-xs text-zinc-500">JPEG, PNG, WebP, or GIF up to 5 MB.</p>
        {error ? (
          <p role="alert" className="mt-2 text-xs text-red-300">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
