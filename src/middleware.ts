import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withIcsGeoRequestHeaders } from '@/lib/regional/geo-headers';
import { resolveRegionSignals } from '@/lib/regional/resolve-region';

const COOKIE_SECURE = process.env.NODE_ENV === 'production';

const cookieDefaults = {
  path: '/' as const,
  maxAge: 60 * 60 * 24 * 14,
  sameSite: 'lax' as const,
  secure: COOKIE_SECURE,
};

/** Dot-path routes (`feed.xml`) sometimes skip registration on Edge adapters; RSS is served from `/feed`. */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === '/feed.xml') {
    const url = request.nextUrl.clone();
    url.pathname = '/feed';
    return NextResponse.rewrite(url);
  }

  const headers = withIcsGeoRequestHeaders(request);
  const res = NextResponse.next({ request: { headers } });

  const country = request.headers.get('x-vercel-ip-country') ?? '';
  const signals = resolveRegionSignals(country);
  res.cookies.set('ics_analytics_consent_required', signals.analyticsConsentRequired ? '1' : '0', cookieDefaults);

  return res;
}

export const config = {
  matcher: [
    '/feed.xml',
    '/((?!_next/static|_next/image|favicon.ico|icon.png|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
