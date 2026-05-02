export const AGE_VERIFICATION_COOKIE = 'age_verified';
export const AGE_VERIFICATION_STORAGE_KEY = 'age_verified';

export const isAdultRating = (rating?: string | null) => {
  const normalized = String(rating || '').toLowerCase();
  return [
    'erotica',
    'pornographic',
    'explicit',
    'questionable',
    'e',
    'q',
  ].includes(normalized);
};

export const isAdultComic = (comic: { rating?: string | null; source?: string | null }) => {
  return comic.source === 'nhentai' || isAdultRating(comic.rating);
};

export const readAgeVerification = () => {
  if (typeof window === 'undefined') return false;

  let storedValue: string | null = null;
  let storedTimestamp: string | null = null;
  try {
    storedValue = window.localStorage.getItem(AGE_VERIFICATION_STORAGE_KEY);
    storedTimestamp = window.localStorage.getItem(`${AGE_VERIFICATION_STORAGE_KEY}_timestamp`);
  } catch {
    storedValue = null;
  }

  // Check if storage has expired (1 day = 86400000 ms)
  if (storedTimestamp) {
    const now = Date.now();
    const then = parseInt(storedTimestamp, 10);
    if (now - then > 86400000) {
      return false;
    }
  }

  if (storedValue === 'true') return true;

  return document.cookie
    .split('; ')
    .some((cookie) => cookie === `${AGE_VERIFICATION_COOKIE}=true`);
};

export const persistAgeVerification = () => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(AGE_VERIFICATION_STORAGE_KEY, 'true');
    window.localStorage.setItem(`${AGE_VERIFICATION_STORAGE_KEY}_timestamp`, Date.now().toString());
  } catch {
    // Some mobile/private browsing modes block storage writes.
  }

  try {
    // Max-Age=86400 is 1 day
    document.cookie = `${AGE_VERIFICATION_COOKIE}=true; Path=/; Max-Age=86400; SameSite=Lax`;
  } catch {
    // If cookies are blocked, we still keep the session alive in-memory.
  }
};
