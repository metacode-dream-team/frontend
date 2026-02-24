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
    <div
      className={cn(
        "flex gap-4 p-4 rounded-lg border border-gray-800 bg-gray-900/50",
        className,
      )}
    >
      {/* Аватар */}
      <Skeleton variant="circular" className="w-10 h-10 flex-shrink-0" />

      {/* Контент */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-3">
          {/* Иконка типа события */}
          {showIcon && (
            <div className="flex-shrink-0 mt-1">
              <Skeleton className="w-9 h-9 rounded-lg" />
            </div>
          )}

          {/* Текст события */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Дополнительная информация */}
            <Skeleton className="h-3 w-40" />

            {/* Время */}
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

