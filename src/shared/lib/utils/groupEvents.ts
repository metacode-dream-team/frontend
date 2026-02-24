/**
 * Утилита для группировки событий по пользователям
 * Группирует события одного пользователя, которые произошли в течение короткого времени
 */

import type { FeedEvent, GroupedEvent } from "@/entities/event";

const GROUPING_TIME_WINDOW_MS = 30 * 60 * 1000; // 30 минут

/**
 * Группирует события по пользователям
 * Если один пользователь совершил несколько действий подряд (в пределах временного окна),
 * они группируются вместе
 */
export function groupEvents(events: FeedEvent[]): GroupedEvent[] {
  if (events.length === 0) {
    return [];
  }

  const grouped: GroupedEvent[] = [];
  let currentGroup: GroupedEvent | null = null;

  for (const event of events) {
    const eventTime = new Date(event.createdAt).getTime();

    // Если это первое событие или событие от другого пользователя
    if (!currentGroup || currentGroup.userId !== event.userId) {
      // Если предыдущая группа существует, сохраняем её
      if (currentGroup) {
        grouped.push(currentGroup);
      }

      // Создаем новую группу
      currentGroup = {
        userId: event.userId,
        username: event.username,
        userAvatar: event.userAvatar,
        events: [event],
        createdAt: event.createdAt,
      };
      continue;
    }

    // Проверяем, попадает ли событие в временное окно текущей группы
    const groupTime = new Date(currentGroup.createdAt).getTime();
    const timeDiff = Math.abs(eventTime - groupTime);

    if (timeDiff <= GROUPING_TIME_WINDOW_MS) {
      // Добавляем событие в текущую группу
      currentGroup.events.push(event);
      // Обновляем время группы на самое раннее событие
      if (eventTime < groupTime) {
        currentGroup.createdAt = event.createdAt;
      }
    } else {
      // Событие выходит за временное окно, сохраняем текущую группу и создаем новую
      grouped.push(currentGroup);
      currentGroup = {
        userId: event.userId,
        username: event.username,
        userAvatar: event.userAvatar,
        events: [event],
        createdAt: event.createdAt,
      };
    }
  }

  // Добавляем последнюю группу
  if (currentGroup) {
    grouped.push(currentGroup);
  }

  return grouped;
}

