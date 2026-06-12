"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import { isRemoteSvgImage } from "@/shared/lib/utils/isRemoteSvgImage";
import { shouldUseNativeImgForRemoteUrl } from "@/shared/lib/utils/remoteImagePlain";
import { useUploadProfileAvatar } from "../model/useUploadProfileAvatar";

type AvatarSize = "sm" | "md";
type AvatarVariant = "round" | "rounded";

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-11 w-11",
  md: "h-24 w-24",
};

const sizePx: Record<AvatarSize, number> = {
  sm: 44,
  md: 96,
};

interface EditableProfileAvatarProps {
  avatarUrl?: string | null;
  editable?: boolean;
  size?: AvatarSize;
  variant?: AvatarVariant;
  className?: string;
  title?: string;
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

export function EditableProfileAvatar({
  avatarUrl,
  editable = false,
  size = "md",
  variant = "rounded",
  className,
  title,
}: EditableProfileAvatarProps) {
  const upload = useUploadProfileAvatar();
  const displayUrl = upload.previewUrl || avatarUrl?.trim() || "";
  const plain = displayUrl ? shouldUseNativeImgForRemoteUrl(displayUrl) : false;
  const isInteractive = editable && !upload.isUploading;
  const shape = variant === "round" ? "rounded-full" : "rounded-xl";

  const handleClick = () => {
    if (!isInteractive) return;
    upload.openFilePicker();
  };

  const Wrapper = isInteractive ? "button" : "div";

  return (
    <div className="flex flex-col items-center">
      <Wrapper
        type={isInteractive ? "button" : undefined}
        onClick={isInteractive ? handleClick : undefined}
        title={
          title ?? (isInteractive ? "Change profile photo" : undefined)
        }
        aria-label={isInteractive ? "Change profile photo" : undefined}
        disabled={isInteractive ? upload.isUploading : undefined}
        className={cn(
          "group relative shrink-0 overflow-hidden bg-black shadow-inner",
          sizeClasses[size],
          shape,
          isInteractive &&
            "cursor-pointer transition hover:ring-2 hover:ring-violet-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
          className,
        )}
      >
        <input
          ref={upload.inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          disabled={!editable || upload.isUploading}
          onChange={upload.handleFileChange}
        />

        {displayUrl ? (
          plain || upload.previewUrl ? (
            <img
              src={displayUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          ) : (
            <Image
              src={displayUrl}
              alt=""
              fill
              className="object-cover"
              sizes={`${sizePx[size]}px`}
              priority={size === "md"}
              unoptimized={isRemoteSvgImage(displayUrl)}
            />
          )
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-zinc-500">
            {size === "sm" ? "ME" : "No photo"}
          </span>
        )}

        {isInteractive ? (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/0 text-white transition group-hover:bg-black/45",
              upload.isUploading && "bg-black/55",
            )}
          >
            <span className="opacity-0 transition group-hover:opacity-100">
              <CameraIcon />
            </span>
          </div>
        ) : null}

        {upload.isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-[10px] font-medium text-zinc-200">
            Uploading…
          </div>
        ) : null}
      </Wrapper>

      {upload.error ? (
        <p role="alert" className="mt-1.5 max-w-[11rem] text-center text-[10px] leading-snug text-red-300">
          {upload.error}
        </p>
      ) : null}
    </div>
  );
}
