export interface ActivityStreak {
  current: number;
  longest: number;
  /** YYYY-MM-DD — последний день, когда серия обновлялась */
  lastActiveDate: string | null;
  /** Активность засчитана сегодня (серия не прервётся до конца дня) */
  activeToday: boolean;
}
