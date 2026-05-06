export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null);
    console.info('[analytics]', payload);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Analytics ingest error:', error);
    return new Response(null, { status: 204 });
  }
}
