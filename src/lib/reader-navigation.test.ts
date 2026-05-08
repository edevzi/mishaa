import { describe, expect, it } from 'vitest';
import {
  clampReaderZoom,
  computeLastPageIndexForAdjacentChapter,
} from '@/lib/reader-navigation';

describe('reader-navigation', () => {
  it('clampReaderZoom clamps to sane bounds', () => {
    expect(clampReaderZoom(10)).toBe(3);
    expect(clampReaderZoom(-1)).toBe(0.65);
    expect(clampReaderZoom(1.5)).toBe(1.5);
  });

  it('computeLastPageIndexForAdjacentChapter classic uses last image index', () => {
    expect(computeLastPageIndexForAdjacentChapter('classic', true, 0)).toBe(0);
    expect(computeLastPageIndexForAdjacentChapter('classic', true, 1)).toBe(0);
    expect(computeLastPageIndexForAdjacentChapter('classic', true, 5)).toBe(4);
  });

  it('computeLastPageIndexForAdjacentChapter journal aligns with pager steps', () => {
    expect(computeLastPageIndexForAdjacentChapter('journal', true, 6)).toBe(5);
    expect(computeLastPageIndexForAdjacentChapter('journal', true, 5)).toBe(3);
  });

  it('computeLastPageIndexForAdjacentChapter flow stays at chapter start semantics', () => {
    expect(computeLastPageIndexForAdjacentChapter('flow', true, 12)).toBe(0);
  });
});
