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

  const storedValue = window.localStorage.getItem(AGE_VERIFICATION_STORAGE_KEY);
  if (storedValue === 'true') return true;

  return document.cookie
    .split('; ')
    .some((cookie) => cookie === `${AGE_VERIFICATION_COOKIE}=true`);
};

export const persistAgeVerification = () => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(AGE_VERIFICATION_STORAGE_KEY, 'true');
  document.cookie = `${AGE_VERIFICATION_COOKIE}=true; Path=/; Max-Age=31536000; SameSite=Lax`;
};
