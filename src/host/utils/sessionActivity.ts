import { LAST_ACTIVITY_STORAGE_KEY } from '@/constants/auth';

export function getLastActivityTime(): number {
  const raw = localStorage.getItem(LAST_ACTIVITY_STORAGE_KEY);
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) ? parsed : Date.now();
}

export function touchLastActivity(): void {
  localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(Date.now()));
}

export function clearLastActivity(): void {
  localStorage.removeItem(LAST_ACTIVITY_STORAGE_KEY);
}
