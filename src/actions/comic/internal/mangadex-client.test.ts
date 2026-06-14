import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('fetchJsonThroughProxy', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('parses JSON from a direct api.mangadex.org call (no proxy self-hop)', async () => {
    const payload = { data: [{ id: 'm1' }], total: 1 };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input);
      if (url.startsWith('https://api.mangadex.org/')) {
        return new Response(JSON.stringify(payload), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      throw new Error('should not reach fallback');
    });

    const { fetchJsonThroughProxy } = await import('./mangadex-client');

    await expect(fetchJsonThroughProxy('manga?page=1')).resolves.toEqual(payload);

    expect(fetchSpy).toHaveBeenCalled();
    const firstUrl = fetchSpy.mock.calls[0]?.[0] as string;
    expect(firstUrl).toBe('https://api.mangadex.org/manga?page=1');
    // Must NOT route through our own proxy route any more.
    expect(firstUrl).not.toContain('/api/proxy/mangadex');
  });

  it('retries the fallback endpoint when the primary fails', async () => {
    const payload = { ok: true };

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input);
      if (url === 'https://api.mangadex.org/unused') {
        return new Response('bad gateway', { status: 502 });
      }
      if (url === 'https://fallback.test/direct') {
        return new Response(JSON.stringify(payload), { status: 200 });
      }
      return new Response('not found', { status: 404 });
    });

    const { fetchJsonThroughProxy } = await import('./mangadex-client');

    await expect(
      fetchJsonThroughProxy('unused', 'https://fallback.test/direct'),
    ).resolves.toEqual(payload);
  });

  it('throws when all endpoints fail', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('error', { status: 500 }),
    );

    const { fetchJsonThroughProxy } = await import('./mangadex-client');

    await expect(fetchJsonThroughProxy('manga/x')).rejects.toThrow('MangaDex fetch failed');
  });
});
