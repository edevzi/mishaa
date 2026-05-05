export const runtime = "edge";
import { NextRequest, NextResponse } from 'next/server';
import { AGE_VERIFICATION_COOKIE } from '@/lib/age-verification';

export const dynamic = 'force-dynamic';

function isSafePath(path: string) {
  return path.length > 0 && !path.includes('://') && !path.includes('..');
}

export async function GET(req: NextRequest) {
  const ageVerified = req.cookies.get(AGE_VERIFICATION_COOKIE)?.value === 'true';
  if (!ageVerified) {
    return NextResponse.json(
      { error: 'Age verification required', code: 'AGE_VERIFICATION_REQUIRED' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path') || '';

  if (!isSafePath(path)) {
    return NextResponse.json({ error: 'Invalid nhentai image path' }, { status: 400 });
  }

  // Common nhentai image mirrors
  const isThumbnail = path.includes('/thumb.') || path.includes('/1t.');
  const hosts = isThumbnail 
    ? ['t.nhentai.net', 't2.nhentai.net', 't3.nhentai.net', 't5.nhentai.net']
    : ['i.nhentai.net', 'i2.nhentai.net', 'i3.nhentai.net', 'i5.nhentai.net', 'i7.nhentai.net'];

  const fetchImage = async (host: string) => {
    const res = await fetch(`https://${host}/${path}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://nhentai.net/',
      },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`Host ${host} failed`);
    return res;
  };

  const fetchViaWeserv = async () => {
    // Weserv can fetch from any URL and is very fast
    const primaryHost = hosts[0];
    const targetUrl = `https://${primaryHost}/${path}`;
    const weservUrl = `https://images.weserv.nl/?url=${encodeURIComponent(targetUrl)}&output=webp&q=80`;
    
    const res = await fetch(weservUrl, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error("Weserv failed");
    return res;
  };

  try {
    // Try mirrors and Weserv in parallel
    const res = await Promise.any([
      ...hosts.slice(0, 2).map(h => fetchImage(h)),
      fetchViaWeserv()
    ]);

    return new NextResponse(res.body, {
      status: 200,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('Nhentai Image Proxy Error:', error.message || error, 'Path:', path);
    
    // Final fallback to the primary host if parallel fails
    try {
      const primaryRes = await fetch(`https://${hosts[0]}/${path}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', 'Referer': 'https://nhentai.net/' }
      });
      if (primaryRes.ok) {
        return new NextResponse(primaryRes.body, {
          status: 200,
          headers: { 'Content-Type': primaryRes.headers.get('content-type') || 'image/jpeg', 'Cache-Control': 'public, max-age=86400' }
        });
      }
    } catch {}

    return NextResponse.json({ error: 'Failed to fetch image from any mirror' }, { status: 502 });
  }
}
