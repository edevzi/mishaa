import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function isAllowedUrl(url: URL) {
  if (url.protocol !== 'https:') return false;

  const hostname = url.hostname.toLowerCase();
  return hostname === 'mangadex.org' || hostname.endsWith('.mangadex.org');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const urlParam = searchParams.get('url');

  if (!urlParam) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(urlParam);
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }

  if (!isAllowedUrl(targetUrl)) {
    return NextResponse.json({ error: 'Invalid MangaDex image url' }, { status: 400 });
  }

  try {
    const res = await fetch(targetUrl.toString(), {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${res.status}` },
        { status: res.status }
      );
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const body = await res.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown image proxy error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
