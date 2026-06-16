const PRO_KEY = 'who-paid:pro:v1';
const TRIAL_START_KEY = 'who-paid:trial-start:v1';
const REVIEW_KEY = 'who-paid:review-asked:v1';
const WIN_COUNT_KEY = 'who-paid:win-count:v1';

export const FREE_TABLE_LIMIT = 3;
export const TRIAL_DAYS = 7;
export const PRICE_MONTHLY = '$4.99';

export type ProStatus = 'free' | 'trial' | 'paid';

export function proStatus(): ProStatus {
  const stored = localStorage.getItem(PRO_KEY);
  if (stored === 'paid') return 'paid';
  if (stored === 'trial') {
    const start = localStorage.getItem(TRIAL_START_KEY);
    if (start) {
      const elapsed = (Date.now() - new Date(start).getTime()) / 86400000;
      if (elapsed <= TRIAL_DAYS) return 'trial';
    }
    localStorage.removeItem(PRO_KEY);
    localStorage.removeItem(TRIAL_START_KEY);
  }
  return 'free';
}

export function isPro(): boolean {
  const s = proStatus();
  return s === 'paid' || s === 'trial';
}

export function trialDaysLeft(): number {
  const start = localStorage.getItem(TRIAL_START_KEY);
  if (!start) return 0;
  return Math.max(0, Math.ceil(TRIAL_DAYS - (Date.now() - new Date(start).getTime()) / 86400000));
}

export function isAtLimit(tableCount: number): boolean {
  return !isPro() && tableCount >= FREE_TABLE_LIMIT;
}

/** TODO: call a payment backend (Stripe Checkout / Apple IAP) before activating trial in production. */
export function startTrial(): void {
  localStorage.setItem(PRO_KEY, 'trial');
  localStorage.setItem(TRIAL_START_KEY, new Date().toISOString());
}

/** Call this from your payment webhook / IAP restore handler. */
export function markPaid(): void {
  localStorage.setItem(PRO_KEY, 'paid');
  localStorage.removeItem(TRIAL_START_KEY);
}

export function incrementWinCount(): number {
  const n = parseInt(localStorage.getItem(WIN_COUNT_KEY) ?? '0', 10) + 1;
  localStorage.setItem(WIN_COUNT_KEY, String(n));
  return n;
}

export function hasAskedReview(): boolean {
  return localStorage.getItem(REVIEW_KEY) === '1';
}

export function markReviewAsked(): void {
  localStorage.setItem(REVIEW_KEY, '1');
}

/** Ask on the 2nd coin flip — user has proved the habit, hasn't hit any paywall yet. */
export function shouldShowReview(winCount: number): boolean {
  return winCount === 2 && !hasAskedReview();
}
