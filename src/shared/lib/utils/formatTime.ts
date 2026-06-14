/**
 * Time formatting utilities
 */

const EN_LOCALE = "en-US";

const timeFormatter = new Intl.DateTimeFormat(EN_LOCALE, {
  hour: "numeric",
  minute: "2-digit",
});

const dayMonthFormatter = new Intl.DateTimeFormat(EN_LOCALE, {
  day: "numeric",
  month: "long",
  hour: "numeric",
  minute: "2-digit",
});

const dayMonthYearFormatter = new Intl.DateTimeFormat(EN_LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

function formatRelativeEn(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Formats a date as relative time or a calendar string. */
export function formatTimeAgo(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isToday(dateObj)) {
    return formatRelativeEn(dateObj);
  }

  if (isYesterday(dateObj)) {
    return `Yesterday at ${timeFormatter.format(dateObj)}`;
  }

  const currentYear = new Date().getFullYear();
  const eventYear = dateObj.getFullYear();

  if (eventYear === currentYear) {
    return dayMonthFormatter.format(dateObj);
  }

  return dayMonthYearFormatter.format(dateObj);
}
