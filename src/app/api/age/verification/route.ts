export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { AGE_VERIFICATION_COOKIE } from '@/lib/age-verification';

const cookieOptions = {
  path: '/',
  maxAge: 60 * 60 * 24,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AGE_VERIFICATION_COOKIE, 'true', cookieOptions);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AGE_VERIFICATION_COOKIE, '', {
    ...cookieOptions,
    maxAge: 0,
  });
  return response;
}
