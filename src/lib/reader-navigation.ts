/**
 * Last paginated index when entering a chapter from the previous volume/boundary
 * (must match ComicReader handleNextPage / handlePrevPage step logic).
 */
export function computeLastPageIndexForAdjacentChapter(
  viewMode: 'classic' | 'flow' | 'journal',
  isSpreadCover: boolean,
  pageCount: number,
): number {
  if (pageCount <= 0) return 0;
  if (viewMode === 'classic') return pageCount - 1;

  if (viewMode === 'journal') {
    let p = 0;
    for (;;) {
      const step = !(isSpreadCover && p === 0) ? 2 : 1;
      if (p < pageCount - step) p += step;
      else break;
    }
    return Math.min(Math.max(p, 0), pageCount - 1);
  }

  return 0;
}

export function clampReaderZoom(z: number, min = 0.65, max = 3): number {
  return Math.min(max, Math.max(min, z));
}
