import { describe, expect, it } from 'vitest';

import { resolveTelegramComicReadUrl } from '@/lib/telegram-read-url';

const ORIGIN = 'https://icomics.wiki';

describe('resolveTelegramComicReadUrl', () => {
  it('never leaves homepage href when id is present (rebuilds /library/{source}/{id})', () => {
    expect(
      resolveTelegramComicReadUrl(ORIGIN, {
        id: 'manga-uuid',
        href: 'https://icomics.wiki',
        shelf: 'trending',
      }),
    ).toBe('https://icomics.wiki/library/mangadex/manga-uuid');
  });

  it('rebuilds when href is only /library', () => {
    expect(
      resolveTelegramComicReadUrl(ORIGIN, {
        id: '21',
        href: '/library',
        shelf: 'trending',
      }),
    ).toBe('https://icomics.wiki/library/mangadex/21');
  });

  it('uses nhentai shelf inference for ntr', () => {
    expect(
      resolveTelegramComicReadUrl(ORIGIN, {
        id: '654321',
        href: '/library',
        shelf: 'ntr',
      }),
    ).toBe('https://icomics.wiki/library/nhentai/654321');
  });

  it('prefers explicit source over shelf', () => {
    expect(
      resolveTelegramComicReadUrl(ORIGIN, {
        id: 'one',
        href: 'https://icomics.wiki/library',
        shelf: 'ntr',
        source: 'mangadex',
      }),
    ).toBe('https://icomics.wiki/library/mangadex/one');
  });

  it('passes through valid relative detail path', () => {
    expect(
      resolveTelegramComicReadUrl(ORIGIN, {
        id: 'ignored-for-path',
        href: '/library/mangadex/explicit-id',
        shelf: 'trending',
      }),
    ).toBe('https://icomics.wiki/library/mangadex/explicit-id');
  });

  it('normalizes www + absolute URL to configured origin', () => {
    expect(
      resolveTelegramComicReadUrl(ORIGIN, {
        id: 'z',
        href: 'https://www.icomics.wiki/library/mangadex/from-www/',
        shelf: 'trending',
      }),
    ).toBe('https://icomics.wiki/library/mangadex/from-www');
  });

  it('strips trailing slash from origin input', () => {
    expect(
      resolveTelegramComicReadUrl('https://icomics.wiki/', {
        id: 'x',
        href: '/library',
        shelf: 'romance',
      }),
    ).toBe('https://icomics.wiki/library/mangadex/x');
  });

  it('encodes id segments safely', () => {
    expect(
      resolveTelegramComicReadUrl(ORIGIN, {
        id: 'weird:id',
        href: '/library',
        shelf: 'fantasy',
      }),
    ).toBe('https://icomics.wiki/library/mangadex/weird%3Aid');
  });
});
