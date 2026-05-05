
const ANILIST_API = 'https://graphql.anilist.co';

export interface AniListMedia {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred?: string;
  };
  description: string;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  status: string;
  genres: string[];
  averageScore: number;
  meanScore: number;
  popularity: number;
  trending: number;
  favourites: number;
  tags: {
    name: string;
    description: string;
    category: string;
    rank: number;
  }[];
  bannerImage: string;
  coverImage: {
    extraLarge: string;
    large: string;
    medium: string;
    color: string;
  };
  externalLinks: {
    url: string;
    site: string;
  }[];
  siteUrl: string;
  recommendations?: {
    nodes: Array<{
      mediaRecommendation?: {
        id: number;
        title?: {
          userPreferred?: string;
          english?: string;
        };
        coverImage?: {
          large?: string;
        };
        type?: string;
      };
    }>;
  };
}

const query = `
query ($id: Int) {
  Media (id: $id, type: MANGA) {
    id
    title {
      romaji
      english
      native
      userPreferred
    }
    description
    startDate {
      year
      month
      day
    }
    status
    genres
    averageScore
    meanScore
    popularity
    trending
    favourites
    tags {
      name
      description
      category
      rank
    }
    bannerImage
    coverImage {
      extraLarge
      large
      medium
      color
    }
    externalLinks {
      url
      site
    }
    siteUrl
    recommendations (limit: 6, sort: [RATING_DESC]) {
      nodes {
        mediaRecommendation {
          id
          title {
            userPreferred
            english
          }
          coverImage {
            large
          }
          type
        }
      }
    }
    characters (limit: 12, sort: [ROLE, RELEVANCE]) {
      edges {
        role
        node {
          id
          name {
            userPreferred
            full
          }
          image {
            large
          }
          description
        }
      }
    }
  }
}
`;

export async function fetchAniListManga(aniListId: string | number): Promise<AniListMedia | null> {
  if (!aniListId) return null;
  
  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: { id: Number(aniListId) }
      }),
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    const data = await response.json();
    return data.data?.Media || null;
  } catch (error) {
    console.error('[AniList] Fetch Error:', error);
    return null;
  }
}

export async function fetchTrendingAniListManga(limit = 12): Promise<AniListMedia[]> {
  const trendingQuery = `
    query ($limit: Int) {
      Page (page: 1, perPage: $limit) {
        media (type: MANGA, sort: TRENDING_DESC) {
          id
          title {
            userPreferred
            english
            romaji
          }
          coverImage {
            large
            extraLarge
            color
          }
          description
          averageScore
          popularity
          genres
        }
      }
    }
  `;

  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: trendingQuery,
        variables: { limit }
      }),
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    const data = await response.json();
    return data.data?.Page?.media || [];
  } catch (error) {
    console.error('[AniList Trending] Fetch Error:', error);
    return [];
  }
}
