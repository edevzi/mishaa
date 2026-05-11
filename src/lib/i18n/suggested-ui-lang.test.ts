import { describe, expect, it } from 'vitest';
import { suggestedUiLangFromCountry } from '@/lib/i18n/suggested-ui-lang';

describe('suggestedUiLangFromCountry', () => {
  it('maps regions to UI languages', () => {
    expect(suggestedUiLangFromCountry('jp')).toBe('ja');
    expect(suggestedUiLangFromCountry('KR')).toBe('ko');
    expect(suggestedUiLangFromCountry('cn')).toBe('zh');
    expect(suggestedUiLangFromCountry('tw')).toBe('zh');
    expect(suggestedUiLangFromCountry('hk')).toBe('zh');
    expect(suggestedUiLangFromCountry('ru')).toBe('ru');
    expect(suggestedUiLangFromCountry('kz')).toBe('ru');
  });

  it('defaults to English for unlisted countries', () => {
    expect(suggestedUiLangFromCountry('us')).toBe('en');
    expect(suggestedUiLangFromCountry('fr')).toBe('en');
    expect(suggestedUiLangFromCountry('')).toBe('en');
    expect(suggestedUiLangFromCountry(undefined)).toBe('en');
  });
});
