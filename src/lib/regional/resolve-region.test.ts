import { describe, expect, it } from 'vitest';
import { resolveRegionSignals } from '@/lib/regional/resolve-region';

describe('resolveRegionSignals', () => {
  it('treats unknown or empty country as default', () => {
    expect(resolveRegionSignals('')).toEqual({
      analyticsConsentRequired: false,
      eastAsiaAgeCopy: false,
      europeAgeCopy: false,
    });
  });

  it('flags Germany for analytics + Europe copy, not East Asia', () => {
    expect(resolveRegionSignals('de')).toEqual({
      analyticsConsentRequired: true,
      eastAsiaAgeCopy: false,
      europeAgeCopy: true,
    });
  });

  it('flags Korea for analytics + both regional age notes', () => {
    expect(resolveRegionSignals('kr')).toEqual({
      analyticsConsentRequired: true,
      eastAsiaAgeCopy: true,
      europeAgeCopy: false,
    });
  });

  it('flags US as permissive defaults', () => {
    expect(resolveRegionSignals('us')).toEqual({
      analyticsConsentRequired: false,
      eastAsiaAgeCopy: false,
      europeAgeCopy: false,
    });
  });
});
