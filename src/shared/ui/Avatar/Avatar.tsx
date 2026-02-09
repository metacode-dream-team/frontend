/**
 * Компонент аватара пользователя
 */

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";

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
  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0",
        sizeClasses[size],
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={`${size === "sm" ? "32" : size === "md" ? "40" : "64"}px`}
      />
    </div>
  );
}

