
const JIKAN_API_BASE = 'https://api.jikan.moe/v4';

export interface JikanManga {
  mal_id: number;
  url: string;
  images: {
    jpg: { image_url: string; small_image_url: string; large_image_url: string };
    webp: { image_url: string; small_image_url: string; large_image_url: string };
  };
  title: string;
  title_english: string;
  title_japanese: string;
  type: string;
  chapters: number;
  volumes: number;
  status: string;
  publishing: boolean;
  published: { from: string; to: string; prop: any; string: string };
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  authors: { mal_id: number; type: string; name: string; url: string }[];
  genres: { mal_id: number; type: string; name: string; url: string }[];
}

export async function fetchJikanManga(malId: string | number): Promise<JikanManga | null> {
  if (!malId) return null;

  try {
    const response = await fetch(`${JIKAN_API_BASE}/manga/${malId}`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('[Jikan] Fetch Error:', error);
    return null;
  }
}
