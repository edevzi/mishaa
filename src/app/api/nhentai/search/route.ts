export const runtime = 'edge';
import { NextResponse } from 'next/server';

const NHENTAI_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
  'Referer': 'https://nhentai.net/',
};

const MIRRORS = ['nhentai.net', 'nhentai.xxx', 'nhentai.to'];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';
  const page = Math.max(1, Number(searchParams.get('page') || '1'));

  for (const mirror of MIRRORS) {
    try {
      const url = `https://${mirror}/api/v2/search?query=${encodeURIComponent(query)}&page=${page}`;
      const res = await fetch(url, {
        headers: NHENTAI_HEADERS,
        signal: AbortSignal.timeout(6000),
        cache: 'no-store', // Always fresh for pagination
      });

      if (res.ok) {
        const data = await res.json();
        const results = Array.isArray(data?.result) ? data.result : [];
        
        return NextResponse.json({
          result: results,
          numPages: data?.num_pages || 0,
          perPage: data?.per_page || 25,
        }, {
          headers: { 'Cache-Control': 'no-store' }
        });
      }
    } catch {
      continue;
    }
  }

  return NextResponse.json({ result: [], numPages: 0, perPage: 25 }, { status: 200 });
}
