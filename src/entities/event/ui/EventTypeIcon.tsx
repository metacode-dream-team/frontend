/**
 * Компонент иконки типа события
 */

import { cn } from "@/shared/lib/utils/cn";
import type { EventType } from "../model/types";

interface EventTypeIconProps {
  type: EventType;
  className?: string;
}

export function EventTypeIcon({ type, className }: EventTypeIconProps) {
  const iconConfig = {
    GITHUB_COMMIT: {
      icon: GitHubIcon,
      color: "text-gray-400",
      bgColor: "bg-gray-800",
    },
    LEETCODE_SOLVE: {
      icon: LeetCodeIcon,
      color: "text-orange-400",
      bgColor: "bg-orange-900/20",
    },
    ROADMAP_CREATE: {
      icon: RoadmapIcon,
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
    },
    ROADMAP_FAVORITE: {
      icon: FavoriteIcon,
      color: "text-pink-400",
      bgColor: "bg-pink-900/20",
    },
    MONKEYTYPE_RECORD: {
      icon: MonkeytypeIcon,
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/20",
    },
    DISCUSSION_CREATE: {
      icon: DiscussionIcon,
      color: "text-green-400",
      bgColor: "bg-green-900/20",
    },
  };

  const config = iconConfig[type];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg p-2",
        config.bgColor,
        className,
      )}
    >
      <IconComponent className={cn("w-5 h-5", config.color)} />
    </div>
  );
}

// GitHub иконка
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

// LeetCode иконка (упрощенная)
function LeetCodeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662L2.571 12.985c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.99-4.987c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.728-2.636c-.895-.895-2.132-1.305-3.66-1.305s-2.765.41-3.66 1.305L1.417 8.403c-.895.895-1.305 2.133-1.305 3.66s.41 2.765 1.305 3.66l5.063 5.063c.896.896 2.135 1.305 3.662 1.305s2.766-.41 3.661-1.305l2.728-2.636c.514-.514.496-1.365-.039-1.9-.535-.536-1.387-.553-1.901-.039zm6.217-9.484h-2.401v2.401h2.401V8.446zm0 4.802h-2.401v2.401h2.401v-2.401zm-4.802 4.803h-2.401v2.401h2.401v-2.401zm-4.801 0h-2.401v2.401h2.401v-2.401z" />
    </svg>
  );
}

// Roadmap иконка
function RoadmapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      />
    </svg>
  );
}

// Избранное иконка
function FavoriteIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

// Monkeytype иконка (молния)
function MonkeytypeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13 1l-12 12h8l-1 8 12-12h-8l1-8z" />
    </svg>
  );
}

// Discussion иконка
function DiscussionIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

