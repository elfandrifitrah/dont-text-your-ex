/** Local calendar dates. Day 1 is `planStartDate`; the streak moves when the date does. */

export function todayISO(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(iso: string, days: number): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return todayISO(date);
}

/** 1-based day count from the anchor through `today`. Not clamped. */
export function rawDayNumber(planStartDate: string, today = todayISO()): number {
  const start = parseISODate(planStartDate);
  const current = parseISODate(today);
  const diff = Math.round((current.getTime() - start.getTime()) / 86_400_000);
  if (!Number.isFinite(diff)) return 1;
  return diff + 1;
}

export function clampDay(rawDay: number): number {
  return Math.max(1, Math.min(30, rawDay));
}
