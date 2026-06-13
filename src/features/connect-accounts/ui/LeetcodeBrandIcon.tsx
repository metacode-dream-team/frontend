import Image from "next/image";

import leetcodeImg from "@/assets/leetcode_modal.png";
import { cn } from "@/shared/lib/utils/cn";

interface LeetcodeBrandIconProps {
  className?: string;
  size?: number;
}

export function LeetcodeBrandIcon({ className, size = 24 }: LeetcodeBrandIconProps) {
  return (
    <Image
      src={leetcodeImg}
      alt=""
      width={size}
      height={size}
      aria-hidden
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
