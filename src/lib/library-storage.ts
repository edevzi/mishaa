import { readStorageItem, writeStorageItem } from './browser-storage';

export const BOOKMARKS_STORAGE_KEY = 'bookmarks';
export const READING_HISTORY_STORAGE_KEY = 'reading_history';
export const LIBRARY_ACTIVITY_EVENT = 'libraryActivityUpdated';
export const BOOKMARKS_UPDATED_EVENT = 'bookmarksUpdated';

export type ReadingProgressStatus = 'started' | 'in_progress' | 'almost_done' | 'completed';

export type StoredBookmark = {
  id: string;
  source: string;
  title?: string;
  coverUrl?: string;
  rating?: string;
  savedAt?: number;
  href?: string;
};

export type StoredReadingHistoryEntry = {
  id?: string;
  title?: string;
  comicTitle?: string;
  comicCoverUrl?: string;
  comicSource?: string;
  chapterId?: string;
  chapterTitle?: string;
  timestamp?: number;
  progressPercent?: number;
  progressStatus?: ReadingProgressStatus;
  currentPage?: number;
  totalPages?: number;
  chapterIndex?: number;
  chapterCount?: number;
  lastReadAt?: number;
  aniListId?: number | string;
  malId?: number | string;
};

export const emitLibraryActivityUpdated = () => {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new Event(LIBRARY_ACTIVITY_EVENT));
};

export const readBookmarks = (): StoredBookmark[] => {
  const raw = readStorageItem(BOOKMARKS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is StoredBookmark => Boolean(item && item.id && item.source))
      .map((item) => ({
        ...item,
        id: String(item.id),
        source: String(item.source),
      }));
  } catch {
    return [];
  }
};

export const writeBookmarks = (bookmarks: StoredBookmark[]) => {
  writeStorageItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
};

export const readReadingHistory = (): Record<string, StoredReadingHistoryEntry> => {
  const raw = readStorageItem(READING_HISTORY_STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed as Record<string, StoredReadingHistoryEntry>;
  } catch {
    return {};
  }
};

export const readRecentHistoryItems = (limit = 6) => {
  return Object.entries(readReadingHistory())
    .map(([key, entry]) => {
      const [source, id] = key.split(':');
      const progressPercent = Number(entry.progressPercent || 0);
      return {
        id: String(entry.id ?? id ?? ''),
        source: String(entry.comicSource ?? source ?? ''),
        title: entry.comicTitle || entry.chapterTitle || entry.title || 'Untitled',
        coverUrl: entry.comicCoverUrl || '/logo.png',
        chapterTitle: entry.chapterTitle || entry.title || '',
        timestamp: Number(entry.timestamp || 0),
        progressPercent,
        progressStatus: entry.progressStatus || 'started',
        href: `/library/${entry.comicSource ?? source}/${entry.id ?? id}`,
      };
    })
    .filter((item) => item.id && item.source)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

export const upsertReadingHistory = (entry: StoredReadingHistoryEntry & { source?: string }) => {
  const nextHistory = readReadingHistory();
  const source = String(entry.comicSource || entry.source || '');
  const comicId = String(entry.id || '');
  if (!source || !comicId) return;

  nextHistory[`${source}:${comicId}`] = {
    ...nextHistory[`${source}:${comicId}`],
    ...entry,
    comicSource: source,
    id: comicId,
    timestamp: entry.timestamp || entry.lastReadAt || Date.now(),
    lastReadAt: entry.lastReadAt || entry.timestamp || Date.now(),
  };

  writeStorageItem(READING_HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
  emitLibraryActivityUpdated();
}

export const removeReadingHistory = (source: string, id: string) => {
  const nextHistory = readReadingHistory();
  delete nextHistory[`${source}:${id}`];
  writeStorageItem(READING_HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
  emitLibraryActivityUpdated();
}

export const clearReadingHistory = () => {
  writeStorageItem(READING_HISTORY_STORAGE_KEY, JSON.stringify({}));
  emitLibraryActivityUpdated();
}

export const upsertBookmark = (bookmark: StoredBookmark) => {
  const nextBookmarks = readBookmarks();
  const index = nextBookmarks.findIndex((item) => item.id === bookmark.id && item.source === bookmark.source);

  if (index >= 0) {
    nextBookmarks[index] = { ...nextBookmarks[index], ...bookmark };
  } else {
    nextBookmarks.push(bookmark);
  }

  writeBookmarks(nextBookmarks);
  emitLibraryActivityUpdated();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(BOOKMARKS_UPDATED_EVENT));
  }
};

export const removeBookmark = (source: string, id: string) => {
  const nextBookmarks = readBookmarks().filter((item) => !(item.source === source && item.id === id));
  writeBookmarks(nextBookmarks);
  emitLibraryActivityUpdated();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(BOOKMARKS_UPDATED_EVENT));
  }
};
