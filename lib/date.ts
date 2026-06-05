/**
 * Returns today's date as YYYY-MM-DD in the user's local timezone.
 */
export function getToday(): string {
  const now = new Date();
  return formatDate(now);
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2;
}

export function isYesterday(date: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date === formatDate(yesterday);
}

export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1 + 'T00:00:00');
  const d2 = new Date(date2 + 'T00:00:00');
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Returns an array of YYYY-MM-DD strings starting at startDate for `days` days.
 */
export function getDateRange(startDate: string, days: number): string[] {
  const result: string[] = [];
  const start = new Date(startDate + 'T00:00:00');
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    result.push(formatDate(d));
  }
  return result;
}
