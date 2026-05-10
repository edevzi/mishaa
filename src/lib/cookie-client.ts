/** Read a first-party cookie in the browser (client components only). */
export function readClientCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const safe = name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1');
  const match = document.cookie.match(new RegExp(`(?:^|; )${safe}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
