/**
 * Утилита для объединения классов (cn = className)
 * Основана на clsx и tailwind-merge
 */

type ClassValue = string | number | boolean | undefined | null;

export function cn(...classes: ClassValue[]): string {
  return classes
    .filter(Boolean)
    .map(String)
    .join(" ")
    .trim();
}

