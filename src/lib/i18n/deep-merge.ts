type PlainObject = Record<string, unknown>;

/** Shallow `Partial` does not allow nested patches; locale shards need deep partials. */
export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

function isPlainObject(v: unknown): v is PlainObject {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Deep-merge plain objects; `patch` wins. Arrays / non-objects copied from patch. */
export function deepMergeUi<T extends PlainObject>(base: T, patch: DeepPartial<T>): T {
  const out = { ...base };
  const patchRecord = patch as Record<string, unknown>;
  for (const key of Object.keys(patchRecord) as (keyof T)[]) {
    const pv = patchRecord[key as string];
    const bv = base[key];
    if (pv === undefined) continue;
    if (isPlainObject(pv) && isPlainObject(bv as unknown)) {
      out[key] = deepMergeUi(bv as PlainObject, pv as PlainObject) as T[keyof T];
    } else {
      out[key] = pv as T[keyof T];
    }
  }
  return out;
}

export function mergeUiChain<T extends PlainObject>(base: T, parts: Array<DeepPartial<T>>): T {
  return parts.reduce((acc, p) => deepMergeUi(acc, p), base) as T;
}
