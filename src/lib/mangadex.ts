export const MANGADEX_LONG_STRIP_TAG_ID = '3e2b8dae-350e-4ab8-a8ce-016e844b9f0d';

export type MangaDexCoverRelationship = {
  type?: string;
  attributes?: {
    fileName?: string;
    volume?: string | null;
    locale?: string | null;
    createdAt?: string;
    updatedAt?: string;
    version?: number;
  };
};

type CoverSize = 'small' | 'medium' | 'original';

const coverExtensionBySize: Record<CoverSize, string> = {
  small: '.256.jpg',
  medium: '.512.jpg',
  original: '',
};

function proxyImageUrl(url: string) {
  return `/api/proxy/image?url=${encodeURIComponent(url)}`;
}

export function buildMangaDexCoverUrl(
  mangaId: string,
  fileName?: string | null,
  size: CoverSize = 'medium',
) {
  if (!mangaId || !fileName) return '';

  return proxyImageUrl(
    `https://uploads.mangadex.org/covers/${mangaId}/${fileName}${coverExtensionBySize[size]}`
  );
}

export function pickMangaDexCoverFileName(relationships: MangaDexCoverRelationship[] | undefined | null) {
  const covers = (relationships || []).filter((relationship) => relationship?.type === 'cover_art');
  if (covers.length === 0) return '';

  const preferred = covers.find((relationship) => {
    const volume = relationship.attributes?.volume;
    return volume === undefined || volume === null || volume === '';
  });

  if (preferred?.attributes?.fileName) {
    return preferred.attributes.fileName;
  }

  const sortedByVolume = [...covers].sort((left, right) => {
    const leftVolume = Number.parseFloat(left.attributes?.volume || '');
    const rightVolume = Number.parseFloat(right.attributes?.volume || '');

    if (Number.isNaN(leftVolume) && Number.isNaN(rightVolume)) return 0;
    if (Number.isNaN(leftVolume)) return 1;
    if (Number.isNaN(rightVolume)) return -1;
    if (leftVolume !== rightVolume) return leftVolume - rightVolume;

    const leftCreated = left.attributes?.createdAt ? Date.parse(left.attributes.createdAt) : Number.POSITIVE_INFINITY;
    const rightCreated = right.attributes?.createdAt ? Date.parse(right.attributes.createdAt) : Number.POSITIVE_INFINITY;
    return leftCreated - rightCreated;
  });

  return sortedByVolume[0]?.attributes?.fileName || '';
}

export function appendMangaDexFilters(
  params: URLSearchParams,
  options: {
    contentRatings: string[];
    includedTagIds?: string[];
    excludedTagIds?: string[];
    originalLanguages?: string[];
    translatedLanguages?: string[];
  },
) {
  options.contentRatings.forEach((rating) => params.append('contentRating[]', rating));
  options.includedTagIds?.forEach((tagId) => params.append('includedTags[]', tagId));
  options.excludedTagIds?.forEach((tagId) => params.append('excludedTags[]', tagId));
  options.originalLanguages?.forEach((language) => params.append('originalLanguage[]', language));
  options.translatedLanguages?.forEach((language) => params.append('availableTranslatedLanguage[]', language));
}
