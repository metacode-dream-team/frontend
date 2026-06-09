export interface YearMonth {
  year: number;
  month: number;
}

export function parseYearMonth(
  yearStr: string,
  monthStr: string,
  label: string,
): { value: YearMonth | null; error: string | null } {
  const yearRaw = yearStr.trim();
  const monthRaw = monthStr.trim();

  if (!yearRaw && !monthRaw) {
    return { value: null, error: null };
  }

  if (!yearRaw || !monthRaw) {
    return { value: null, error: `Enter both year and month for ${label}.` };
  }

  const year = Number(yearRaw);
  const month = Number(monthRaw);

  if (!Number.isFinite(year) || year < 1900 || year > 2100) {
    return { value: null, error: `Enter a valid ${label} year.` };
  }
  if (!Number.isFinite(month) || month < 1 || month > 12) {
    return { value: null, error: `${label} month must be between 1 and 12.` };
  }

  return {
    value: { year: Math.trunc(year), month: Math.trunc(month) },
    error: null,
  };
}

export function compareYearMonth(a: YearMonth, b: YearMonth): number {
  if (a.year !== b.year) return a.year - b.year;
  return a.month - b.month;
}
