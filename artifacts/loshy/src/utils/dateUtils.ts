export const TOGETHER_SINCE = new Date('2025-06-10T00:00:00');

export function getDaysTogether(since: Date = TOGETHER_SINCE): number {
  const now = new Date();
  const diff = now.getTime() - since.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getWeeksTogether(since: Date = TOGETHER_SINCE): number {
  return Math.floor(getDaysTogether(since) / 7);
}

export function getMonthsTogether(since: Date = TOGETHER_SINCE): number {
  const now = new Date();
  return (
    (now.getFullYear() - since.getFullYear()) * 12 +
    (now.getMonth() - since.getMonth())
  );
}

export function getYearsTogether(since: Date = TOGETHER_SINCE): number {
  const now = new Date();
  const years = now.getFullYear() - since.getFullYear();
  const hasBirthdayPassed =
    now.getMonth() > since.getMonth() ||
    (now.getMonth() === since.getMonth() && now.getDate() >= since.getDate());
  return hasBirthdayPassed ? years : years - 1;
}

export function formatTogetherSince(date: Date = TOGETHER_SINCE, lang: 'en' | 'ar' = 'en'): string {
  return date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDate(date: Date, lang: 'en' | 'ar' = 'en'): string {
  return date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(date: Date, lang: 'en' | 'ar' = 'en'): string {
  return date.toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isToday(dateStr: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
}

export function isYesterday(dateStr: string): boolean {
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  return dateStr === yesterday;
}

export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}
