import Image from "next/image";

import type { ProfileAchievement } from "@/entities/profile";
import { cn } from "@/shared/lib/utils/cn";
import { isRemoteSvgImage } from "@/shared/lib/utils/isRemoteSvgImage";
import { shouldUseNativeImgForRemoteUrl } from "@/shared/lib/utils/remoteImagePlain";

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
  xl: "h-28 w-28",
} as const;

const sizePx = {
  sm: 40,
  md: 56,
  lg: 80,
  xl: 112,
} as const;

interface AchievementLogoProps {
  achievement: ProfileAchievement;
  size?: keyof typeof sizeClasses;
  className?: string;
}

export function AchievementLogo({
  achievement,
  size = "md",
  className,
}: AchievementLogoProps) {
  const { title, iconUrl, unlocked } = achievement;
  const dim = sizeClasses[size];
  const px = sizePx[size];

  if (!iconUrl) {
    return (
      <div
        title={title}
        aria-label={title}
        className={cn(
          "flex shrink-0 items-center justify-center text-sm font-bold uppercase text-zinc-600",
          dim,
          !unlocked && "opacity-40 grayscale",
          className,
        )}
      >
        {title.trim().charAt(0) || "?"}
      </div>
    );
  }

  const plain = shouldUseNativeImgForRemoteUrl(iconUrl);

  return (
    <div
      title={title}
      aria-label={title}
      className={cn(
        "relative shrink-0",
        dim,
        !unlocked && "opacity-40 grayscale",
        className,
      )}
    >
      {plain ? (
        <img
          src={iconUrl}
          alt={title}
          className="h-full w-full object-contain"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <Image
          src={iconUrl}
          alt={title}
          fill
          className="object-contain"
          sizes={`${px}px`}
          unoptimized={isRemoteSvgImage(iconUrl)}
        />
      )}
    </div>
  );
}
