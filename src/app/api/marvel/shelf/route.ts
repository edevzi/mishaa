export const runtime = "edge";
import { NextResponse } from "next/server";

const MARVEL_API_BASE = "https://marvel.emreparker.com/v1";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || "12"), 1), 50);
    const offset = Math.max(Number(searchParams.get("offset") || "0"), 0);

    // 1. Fetch list of issues
    const listRes = await fetch(`${MARVEL_API_BASE}/issues?limit=${limit}&offset=${offset}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!listRes.ok) throw new Error("Failed to fetch Marvel list");
    const listData = await listRes.json();
    const items = Array.isArray(listData?.items) ? listData.items : [];

    // 2. Fetch details for each in parallel (on edge/server)
    const detailedItems = await Promise.all(
      items.map(async (item: { id: string }) => {
        try {
          const detailRes = await fetch(`${MARVEL_API_BASE}/issues/${item.id}`, {
            headers: { Accept: "application/json" },
            cache: 'force-cache'
          });
          if (!detailRes.ok) return null;
          const detail = await detailRes.json();
          const issue = detail?.data?.results?.[0] || detail?.items?.[0] || detail;
          
          if (!issue) return null;

          const path = issue.cover?.path || issue.thumbnail?.path;
          const ext = issue.cover?.extension || issue.thumbnail?.extension;
          const directCoverUrl = path && ext
            ? `${path.replace('http://', 'https://')}/portrait_uncanny.${ext}`
            : null;
          const coverUrl = directCoverUrl 
            ? `/api/proxy/image?url=${encodeURIComponent(directCoverUrl)}`
            : '/logo.png';

          return {
            id: String(issue.id),
            title: issue.title || `Issue ${issue.issueNumber}`,
            description: issue.seriesName || 'Marvel Universe',
            coverUrl,
            source: 'marvel',
            href: `/library/marvel/${issue.id}`,
            meta: issue.issueNumber ? `ISSUE ${issue.issueNumber}` : 'MARVEL',
            rating: '4.8',
          };
        } catch {
          return null;
        }
      })
    );

    const filtered = detailedItems.filter(Boolean);

    return NextResponse.json({ items: filtered }, {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("Marvel shelf aggregation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
