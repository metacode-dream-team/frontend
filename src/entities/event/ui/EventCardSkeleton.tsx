/**
 * Скелетон для карточки события
 */

import { Skeleton } from "@/shared/ui/Skeleton";
import { cn } from "@/shared/lib/utils/cn";

interface EventCardSkeletonProps {
  className?: string;
  showIcon?: boolean;
}

export function EventCardSkeleton({ className, showIcon = true }: EventCardSkeletonProps) {
  return (
    <div className={cn("flex gap-3 py-4 sm:gap-4", className)}>
      <Skeleton variant="circular" className="h-8 w-8 shrink-0" />

      <div className="flex min-w-0 flex-1 gap-2.5 sm:gap-3">
        {showIcon && <Skeleton className="mt-0.5 h-8 w-8 shrink-0 rounded-md" />}

        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    </div>
  );
}

