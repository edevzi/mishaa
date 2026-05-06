export type ReadingProgressStatus = 'started' | 'in_progress' | 'almost_done' | 'completed';

export type ReadingViewMode = 'classic' | 'flow' | 'journal';

export interface ReadingProgressInput {
  source: string;
  comicId: string;
  comicTitle?: string | null;
  comicCoverUrl?: string | null;
  chapterId?: string | null;
  chapterTitle?: string | null;
  chapterIndex?: number;
  chapterCount?: number;
  currentPage?: number;
  totalPages?: number;
  scrollProgress?: number;
  viewMode?: ReadingViewMode;
  timestamp?: number;
}

export interface ReadingProgressRecord extends ReadingProgressInput {
  progressPercent: number;
  progressStatus: ReadingProgressStatus;
  timestamp: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const deriveReadingProgressStatus = (progressPercent: number): ReadingProgressStatus => {
  if (progressPercent >= 100) return 'completed';
  if (progressPercent >= 80) return 'almost_done';
  if (progressPercent >= 10) return 'in_progress';
  return 'started';
};

export const calculateReadingProgressPercent = (input: ReadingProgressInput): number => {
  const chapterCount = Number(input.chapterCount || 0);
  const chapterIndex = Number(input.chapterIndex || 0);
  const totalPages = Number(input.totalPages || 0);
  const currentPage = Number(input.currentPage || 0);
  const scrollProgress = Number(input.scrollProgress || 0);
  const viewMode = input.viewMode || 'classic';

  const chapterRatio = chapterCount > 0
    ? clamp((chapterIndex + 1) / chapterCount, 0, 1)
    : 0;

  let pageRatio = 0;
  if (viewMode === 'flow') {
    pageRatio = clamp(scrollProgress / 100, 0, 1);
  } else if (totalPages > 0) {
    const visiblePages = viewMode === 'journal' ? 2 : 1;
    pageRatio = clamp((currentPage + visiblePages) / totalPages, 0, 1);
  }

  if (chapterCount <= 1) {
    return Math.round(clamp(pageRatio || chapterRatio || 0, 0, 1) * 100);
  }

  const chapterProgress = chapterCount > 0 ? clamp(((chapterIndex + Math.max(pageRatio, 0)) / chapterCount), 0, 1) : pageRatio;
  const percent = clamp(chapterProgress * 100, 0, 100);
  return Math.round(percent);
};

export const normalizeReadingProgressRecord = (input: ReadingProgressInput): ReadingProgressRecord => {
  const timestamp = Number(input.timestamp || Date.now());
  const progressPercent = calculateReadingProgressPercent(input);

  return {
    ...input,
    timestamp,
    progressPercent,
    progressStatus: deriveReadingProgressStatus(progressPercent),
  };
};
