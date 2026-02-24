/**
 * Утилиты для форматирования времени
 */

import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { ru } from "date-fns/locale/ru";

/**
 * Форматирует дату в формат "2 часа назад", "Вчера в 15:40" и т.д.
 */
export function formatTimeAgo(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isToday(dateObj)) {
    // Сегодня: "2 часа назад"
    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: ru,
    });
  }

  if (isYesterday(dateObj)) {
    // Вчера: "Вчера в 15:40"
    return `Вчера в ${format(dateObj, "HH:mm")}`;
  }

  // Старше: "15 января в 15:40" или "15 янв 2024 в 15:40" если не текущий год
  const currentYear = new Date().getFullYear();
  const eventYear = dateObj.getFullYear();

  if (eventYear === currentYear) {
    return format(dateObj, "d MMMM в HH:mm", { locale: ru });
  }

  return format(dateObj, "d MMM yyyy в HH:mm", { locale: ru });
}

