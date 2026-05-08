'use client';

import { searchComics } from '@/actions/comic';
import type { ComicsSearchPage } from '@/lib/comic-types';

type SearchLikeParams = Parameters<typeof searchComics>[0];

type CacheBucket = {
  storedAt: number;
  payload: ComicsSearchPage;
};

const TTL_MS = 1000 * 60 * 5;
const MAX_ENTRIES = 96;

const entries = new Map<string, CacheBucket>();
const inflight = new Map<string, Promise<ComicsSearchPage>>();

function sortedJoin(list: string[] | undefined) {
  if (!list?.length) return '';
  return [...new Set(list)].sort().join('\u241e');
}

function cacheKeyFromParams(params: SearchLikeParams): string {
  const {
    source,
    query = '',
    page = 0,
    mangaLanguage = 'en',
    ratings,
    originalLanguages,
    includedTagIds,
    excludedTagIds,
  } = params;

  return JSON.stringify({
    source,
    q: query.trim().toLowerCase(),
    page,
    mangaLanguage,
    r: sortedJoin(ratings),
    ol: sortedJoin(originalLanguages),
    i: sortedJoin(includedTagIds),
    e: sortedJoin(excludedTagIds),
  });
}

function pruneIfNeeded() {
  while (entries.size > MAX_ENTRIES) {
    let oldestKey: string | undefined;
    let oldestAt = Infinity;
    for (const [key, bucket] of entries) {
      if (bucket.storedAt < oldestAt) {
        oldestAt = bucket.storedAt;
        oldestKey = key;
      }
    }
    if (!oldestKey) break;
    entries.delete(oldestKey);
  }
}

/**
 * Deduplicates in-flight identical server-action calls and keeps a short in-memory LRU
 * of recent search pages so typing / revisiting doesn’t hammer the backend.
 */
export async function searchComicsWithClientCache(
  params: SearchLikeParams,
): Promise<ComicsSearchPage> {
  const key = cacheKeyFromParams(params);
  const now = Date.now();
  const hit = entries.get(key);
  if (hit && now - hit.storedAt < TTL_MS) return hit.payload;

  let pending = inflight.get(key);
  if (!pending) {
    pending = searchComics(params).then((page) => {
      entries.set(key, { storedAt: Date.now(), payload: page });
      pruneIfNeeded();
      return page;
    });
    pending.finally(() => {
      inflight.delete(key);
    });
    inflight.set(key, pending);
  }

  return pending;
}
