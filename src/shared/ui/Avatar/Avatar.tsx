import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import { shouldUseNativeImgForRemoteUrl } from "@/shared/lib/utils/remoteImagePlain";
import { isRemoteSvgImage } from "@/shared/lib/utils/isRemoteSvgImage";

interface AvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-16 h-16",
};

export function Avatar({ src, alt, size = "md", className }: AvatarProps) {
  const plain = shouldUseNativeImgForRemoteUrl(src);
  const px = size === "sm" ? "32" : size === "md" ? "40" : "64";
  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0",
        sizeClasses[size],
        className,
      )}
    >
      {plain ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={`${px}px`}
          unoptimized={isRemoteSvgImage(src)}
        />
      )}
    </div>
  );
}

