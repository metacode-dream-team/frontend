/**
 * Утилиты для форматирования времени
 */

const RU_LOCALE = "ru-RU";

const timeFormatter = new Intl.DateTimeFormat(RU_LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
});

const dayMonthFormatter = new Intl.DateTimeFormat(RU_LOCALE, {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

const dayMonthYearFormatter = new Intl.DateTimeFormat(RU_LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
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

function formatRelativeRu(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "только что";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} мин назад`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ч назад`;
  }

  const days = Math.floor(hours / 24);
  return `${days} дн назад`;
}

/**
 * Форматирует дату в формат "2 часа назад", "Вчера в 15:40" и т.д.
 */
export function formatTimeAgo(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isToday(dateObj)) {
    // Сегодня: "2 ч назад"
    return formatRelativeRu(dateObj);
  }

  if (isYesterday(dateObj)) {
    // Вчера: "Вчера в 15:40"
    return `Вчера в ${timeFormatter.format(dateObj)}`;
  }

  // Старше: "15 января в 15:40" или "15 янв 2024 в 15:40" если не текущий год
  const currentYear = new Date().getFullYear();
  const eventYear = dateObj.getFullYear();

  if (eventYear === currentYear) {
    const formatted = dayMonthFormatter.format(dateObj);
    return formatted.replace(",", " в");
  }

  const formatted = dayMonthYearFormatter.format(dateObj);
  return formatted.replace(",", " в");
}
