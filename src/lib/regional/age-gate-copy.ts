export type LibraryAgeBlocks = {
  ageDesc: string;
  ageDescEastAsia?: string;
  ageDescEurope?: string;
};

/**
 * Stacks optional jurisdiction lines (EU framing, then East Asia) above the base 18+ line.
 * Product copy only — local counsel should validate age rules per market.
 */
export function buildAgeGateDescription(
  t: LibraryAgeBlocks,
  opts: { eastAsiaAgeCopy: boolean; europeAgeCopy: boolean },
): string {
  const chunks: string[] = [];
  if (opts.europeAgeCopy && t.ageDescEurope) chunks.push(t.ageDescEurope);
  if (opts.eastAsiaAgeCopy && t.ageDescEastAsia) chunks.push(t.ageDescEastAsia);
  chunks.push(t.ageDesc);
  if (chunks.length === 1) return t.ageDesc;
  return chunks.join('\n\n');
}
