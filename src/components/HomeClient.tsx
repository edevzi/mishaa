'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  Search,
  Flame,
  TrendingUp,
  LayoutGrid,
  Star,
  Sparkles,
  Heart,
  Zap
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  MANGA_LANGUAGE_OPTIONS,
  MangaLanguage,
  readStoredMangaLanguage,
  persistStoredMangaLanguage,
} from '@/lib/manga-language';
import { readAgeVerification, persistAgeVerification } from '@/lib/age-verification';

// --- Types ---
type ComicSource = 'mangadex' | 'marvel' | 'nhentai';
type ShelfKey = 'all' | 'featured' | 'manga-hub' | 'webtoons' | 'manhwa' | 'marvel' | 'trending' | 'for-you' | 'new' | 'doujinshi' | 'milf' | 'ntr';

interface LibraryComic {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  bannerUrl?: string;
  source: ComicSource;
  href?: string;
  meta: string;
  rating?: string;
  year?: string;
  timestamp?: number;
  progressPercent?: number;
  progressStatus?: string;
}

type NhentaiGallery = {
  id?: number | string;
  gallery_id?: number | string;
  english_title?: string;
  title?: { english?: string; japanese?: string };
  num_pages?: number;
  thumbnail?: string | { path?: string };
};

interface ShelfDefinition {
  key: ShelfKey;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const DEFAULT_IMAGE_SRC = '/logo.png';

function resolveImageSrc(src?: string | null) {
  return typeof src === 'string' && src.trim().length > 0 ? src : DEFAULT_IMAGE_SRC;
}

function resolveComicHref(comic: LibraryComic) {
  return comic.href || `/library/${comic.source}/${comic.id}`;
}

type SafeCoverImageProps = {
  src?: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

function SafeCoverImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: SafeCoverImageProps) {
  const [currentSrc, setCurrentSrc] = useState(() => resolveImageSrc(src));

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes={sizes}
      preload={priority}
      unoptimized
      onError={() => {
        if (currentSrc !== DEFAULT_IMAGE_SRC) {
          setCurrentSrc(DEFAULT_IMAGE_SRC);
        }
      }}
      className={className}
    />
  );
}

const SHELVES: ShelfDefinition[] = [
  {
    key: 'trending',
    title: 'Trending',
    subtitle: 'Popular now',
    icon: <Flame className="text-orange-500" size={18} />,
  },
  {
    key: 'for-you',
    title: 'For You',
    subtitle: 'Based on your activity',
    icon: <Sparkles className="text-[#ffca3a]" size={18} />,
  },
  {
    key: 'manga-hub',
    title: 'Manga',
    subtitle: 'Japanese comics',
    icon: <LayoutGrid className="text-pink-500" size={18} />,
  },
  {
    key: 'new',
    title: 'New',
    subtitle: 'Recently added',
    icon: <Clock className="text-green-500" size={18} />,
  },
  {
    key: 'doujinshi',
    title: 'Doujinshi',
    subtitle: 'Fan comics',
    icon: <Star className="text-yellow-500" size={18} />,
  },
  {
    key: 'milf',
    title: 'Mature',
    subtitle: '18+ titles',
    icon: <Heart className="text-red-500" size={18} />,
  },
  {
    key: 'ntr',
    title: 'NTR',
    subtitle: 'Drama-focused',
    icon: <Zap className="text-purple-500" size={18} />,
  },
  {
    key: 'manhwa',
    title: 'Manhwa',
    subtitle: 'Korean comics',
    icon: <TrendingUp className="text-cyan-500" size={18} />,
  },
  {
    key: 'webtoons',
    title: 'Webtoons',
    subtitle: 'Vertical reads',
    icon: <Clock className="text-amber-500" size={18} />,
  },
];

import JsonLd from '@/components/JsonLd';
import AgeGateOverlay from './AgeGateOverlay';
import { isAdultComic } from '@/lib/age-verification';

type HomeClientProps = {
  initialData?: Record<string, LibraryComic[]>;
  initialAgeVerified?: boolean;
  initialIsTouchDevice?: boolean;
};

export default function HomeClient({
  initialData,
  initialAgeVerified = false,
  initialIsTouchDevice = false,
}: HomeClientProps) {
  const [isAgeVerified, setIsAgeVerified] = useState(() => Boolean(initialAgeVerified));
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(() => Boolean(initialIsTouchDevice));
  const [previewCardKey, setPreviewCardKey] = useState<string | null>(null);
  const hasCompleteInitialData = SHELVES.every((shelf) => (initialData?.[shelf.key]?.length ?? 0) > 0);
  const visibleShelves = isAgeVerified
    ? SHELVES
    : SHELVES.filter((shelf) => !['doujinshi', 'milf', 'ntr'].includes(shelf.key));

  const [shelfState, setShelfState] = useState<Record<string, { items: LibraryComic[]; loading: boolean }>>(() => {
    const base = {} as Record<string, { items: LibraryComic[]; loading: boolean }>;
    SHELVES.forEach(s => {
      base[s.key] = { items: initialData?.[s.key] || [], loading: !(initialData?.[s.key]?.length) };
    });
    base['trending'] = { items: initialData?.['trending'] || [], loading: !(initialData?.['trending']?.length) };
    return base;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ShelfKey>('all');

  // Infinite Scroll State
  const [infiniteItems, setInfiniteItems] = useState<LibraryComic[]>([]);
  const [infiniteOffset, setInfiniteOffset] = useState(0);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const [hasMoreInfinite, setHasMoreInfinite] = useState(true);
  const [loaderInView, setLoaderInView] = useState(false);
  const spicyThresholdRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMoreInfinite = useCallback(async () => {
    if (!isAgeVerified) {
      setShowAgeGate(true);
      return;
    }

    if (infiniteLoading || !hasMoreInfinite) return;
    setInfiniteLoading(true);

    try {
      const page = Math.floor(infiniteOffset / 25) + 1;
      const res = await fetch(`/api/proxy/nhentai?path=${encodeURIComponent(`galleries?page=${page}`)}`);
      if (!res.ok) {
        if (res.status === 403) {
          setShowAgeGate(true);
          setHasMoreInfinite(false);
          return;
        }
        throw new Error('Search failed');
      }
      const data = await res.json();
      const results = Array.isArray(data?.result) ? data.result : [];

      if (results.length > 0) {
        const items: LibraryComic[] = results.map((item: NhentaiGallery) => {
          const thumbnailPath = typeof item.thumbnail === 'object'
            ? item.thumbnail?.path
            : item.thumbnail;

          return {
            id: (item.id || item.gallery_id || '').toString(),
            title: item.english_title || item.title?.english || item.title?.japanese || 'Untitled',
            description: `${item.num_pages || '?'} pages`,
            coverUrl: thumbnailPath
              ? `/api/proxy/nhentai/image?path=${encodeURIComponent(thumbnailPath)}`
              : '/logo.png',
            source: 'nhentai' as const,
            href: `/library/nhentai/${item.id || item.gallery_id}`,
            meta: '18+',
            rating: '5.0',
          };
        });
        setInfiniteItems(prev => [...prev, ...items]);
        setInfiniteOffset(prev => prev + results.length);
        setHasMoreInfinite(true);
      } else {
        setHasMoreInfinite(true);
        setInfiniteOffset(prev => prev + 25);
      }
    } catch (e) {
      console.error(e);
      setHasMoreInfinite(false);
    } finally {
      setInfiniteLoading(false);
    }
  }, [infiniteLoading, hasMoreInfinite, infiniteOffset, isAgeVerified]);

  useEffect(() => {
    const target = loaderRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setLoaderInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px 400px 0px',
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!loaderInView || infiniteLoading || !hasMoreInfinite) return;
    const timer = window.setTimeout(() => {
      void loadMoreInfinite();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loaderInView, infiniteLoading, hasMoreInfinite, loadMoreInfinite]);

  // Scroll Trigger for Age Verification
  useEffect(() => {
    if (isAgeVerified) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isAgeVerified) {
          setShowAgeGate(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    if (spicyThresholdRef.current) {
      observer.observe(spicyThresholdRef.current);
    }

    return () => observer.disconnect();
  }, [isAgeVerified]);

  const handleVerify = () => {
    persistAgeVerification();
    setIsAgeVerified(true);
    setShowAgeGate(false);
  };
  const [mangaLanguage, setMangaLanguage] = useState<MangaLanguage>('en');
  const [personalRecs, setPersonalRecs] = useState<LibraryComic[]>([]);
  const [isRecsLoading, setIsRecsLoading] = useState(false);
  const hasTrendingInitialItems = Boolean(initialData?.['trending']?.length);

  useEffect(() => {
    const saved = readStoredMangaLanguage();
    const t = setTimeout(() => setMangaLanguage(prev => (saved !== prev ? saved : prev)), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const verified = readAgeVerification() || initialAgeVerified;
    const timer = window.setTimeout(() => {
      setIsAgeVerified(verified);
      if (verified) persistAgeVerification();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [initialAgeVerified]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setIsTouchDevice(media.matches);

    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const fetchShelves = async (lang: MangaLanguage) => {
    setShelfState(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(key => newState[key].loading = true);
      return newState;
    });

    try {
      const res = await fetch(`/api/home/data?lang=${lang}`, { next: { revalidate: 3600 } });
      if (!res.ok) throw new Error('Home data fetch failed');
      const data = await res.json();

      if (data?.shelves) {
        setShelfState({
          'trending': { items: data.shelves['trending'] || [], loading: false },
          'manga-hub': { items: data.shelves['manga-hub'] || [], loading: false },
          'new': { items: data.shelves['new'] || [], loading: false },
          webtoons: { items: data.shelves['webtoons'] || [], loading: false },
          manhwa: { items: data.shelves['manhwa'] || [], loading: false },
          marvel: { items: data.shelves['marvel'] || [], loading: false },
          'doujinshi': { items: data.shelves['doujinshi'] || [], loading: false },
          'milf': { items: data.shelves['milf'] || [], loading: false },
          'ntr': { items: data.shelves['ntr'] || [], loading: false },
          'for-you': { items: [], loading: false },
        });
      }
    } catch (error) {
      console.error('Home data error:', error);
      setShelfState(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(key => newState[key].loading = false);
        return newState;
      });
    }
  };

  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current && hasCompleteInitialData) {
      isFirstMount.current = false;
      return;
    }
    const t = setTimeout(() => {
      void fetchShelves(mangaLanguage);
    }, 0);
    return () => clearTimeout(t);
  }, [hasCompleteInitialData, isAgeVerified, mangaLanguage]);

  useEffect(() => {
    if (isTouchDevice) return;

    const loadPersonalRecs = async () => {
      if (typeof window === 'undefined') return;
      setIsRecsLoading(true);
      try {
        const history = JSON.parse(localStorage.getItem('reading_history') || '{}');
        const ids = Object.keys(history);
        if (ids.length === 0) {
          setIsRecsLoading(false);
          return;
        }

        const historyEntries = Object.values(history) as Array<{ aniListId?: number | string }>;
        const aniListIds = historyEntries
          .map(entry => entry.aniListId)
          .filter(Boolean);

        const backupIds = Object.keys(history).slice(-5).map(id => id.split(':')[1]);

        const res = await fetch('/api/recommendations', {
          method: 'POST',
          body: JSON.stringify({
            history: aniListIds.length > 0 ? aniListIds.slice(-5) : backupIds
          }),
        });
        const data = await res.json();
        if (data.items?.length > 0) {
          setPersonalRecs(data.items);
          setActiveTab(prev => (prev === 'for-you' || !hasTrendingInitialItems) ? 'for-you' : prev);
        }
      } catch (e) {
        console.error('Recs error:', e);
      } finally {
        setIsRecsLoading(false);
      }
    };
    loadPersonalRecs();
  }, [hasTrendingInitialItems, isTouchDevice]);

  const handleLanguageChange = (newLang: MangaLanguage) => {
    setMangaLanguage(newLang);
    persistStoredMangaLanguage(newLang);
  };

  const featuredComic = useMemo(() => {
    const pool = activeTab === 'all'
      ? (personalRecs.length > 0 ? personalRecs : shelfState.trending?.items || [])
      : (activeTab === 'for-you' ? personalRecs : (shelfState[activeTab]?.items || []));
    if (!pool.length) return null;
    return pool[0];
  }, [activeTab, shelfState, personalRecs]);

  const featuredBackgroundSrc = featuredComic?.bannerUrl || featuredComic?.coverUrl || DEFAULT_IMAGE_SRC;
  const featuredPosterSrc = featuredComic?.coverUrl || featuredComic?.bannerUrl || DEFAULT_IMAGE_SRC;
  const renderedShelves = activeTab === 'all'
    ? visibleShelves
    : visibleShelves.filter((shelf) => shelf.key === activeTab);
  const shelfCardLimit = isTouchDevice ? 4 : 6;
  const showInfiniteDiscover = !isTouchDevice;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "iComics.wiki Studio",
    "url": "https://icomics.wiki",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://icomics.wiki/library?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "iComics.wiki Studio",
    "url": "https://icomics.wiki",
    "logo": "https://icomics.wiki/logo.png",
    "sameAs": [
      "https://twitter.com/icomics_studio",
      "https://t.me/icomics_studio"
    ]
  };

  return (
    <div className="min-h-screen bg-[#05060a] text-white">
      <JsonLd data={websiteSchema} />
      <JsonLd data={orgSchema} />
      <Navbar />

      <main className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-[-10%] top-[8rem] h-[30rem] w-[30rem] rounded-full bg-[#ff5a1f]/10 blur-[140px]" />
          <div className="absolute right-[-12%] top-[18rem] h-[26rem] w-[26rem] rounded-full bg-[#ffd36b]/8 blur-[160px]" />
          <div className="absolute inset-x-0 top-[20rem] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* --- DYNAMIC HERO BANNER --- */}
        <section className="relative w-full">
          <AnimatePresence mode="wait">
            {!featuredComic && (shelfState[activeTab]?.loading || isRecsLoading) ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full"
              >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pb-16">
                  <div className="grid gap-6 rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-3xl lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:p-8">
                    <div className="space-y-6">
                      <div className="h-9 w-48 rounded-full bg-white/5 animate-pulse" />
                      <div className="h-24 w-full rounded-[2rem] bg-white/5 animate-pulse" />
                      <div className="h-20 w-4/5 rounded-[2rem] bg-white/5 animate-pulse" />
                      <div className="flex flex-wrap gap-3">
                        <div className="h-12 w-40 rounded-full bg-white/5 animate-pulse" />
                        <div className="h-12 w-40 rounded-full bg-white/5 animate-pulse" />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="h-24 rounded-[1.5rem] bg-white/5 animate-pulse" />
                        <div className="h-24 rounded-[1.5rem] bg-white/5 animate-pulse" />
                        <div className="h-24 rounded-[1.5rem] bg-white/5 animate-pulse" />
                      </div>
                    </div>
                    <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] animate-pulse" />
                  </div>
                </div>
              </motion.div>
            ) : featuredComic ? (
              <motion.div
                key={featuredComic.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full"
              >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-14 lg:pb-18">
                  <div className="relative overflow-hidden rounded-[2.75rem] bg-black shadow-[0_50px_140px_rgba(0,0,0,0.72)]">
                    <div className="absolute inset-0">
                      {!isTouchDevice && (
                        <>
                          <SafeCoverImage
                            key={featuredBackgroundSrc}
                            src={featuredBackgroundSrc}
                            alt={featuredComic.title}
                            priority
                            sizes="100vw"
                            className="object-cover object-center scale-105 opacity-[0.2] blur-[2px]"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,10,0.96)_0%,rgba(5,6,10,0.9)_42%,rgba(5,6,10,0.54)_100%)]" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(255,90,31,0.14),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(255,211,107,0.09),transparent_20%),radial-gradient(circle_at_70%_72%,rgba(255,90,31,0.08),transparent_26%)]" />
                        </>
                      )}
                      {isTouchDevice && (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,90,31,0.18),transparent_34%),linear-gradient(180deg,rgba(5,6,10,0.98)_0%,rgba(5,6,10,0.92)_100%)]" />
                      )}
                    </div>

                    <div className="relative grid gap-8 px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14 lg:px-12 lg:py-12">
                      <div className="relative z-20 max-w-3xl lg:py-12">
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/42">
                          {featuredComic.source}
                        </p>

                        <h1 className="mt-6 text-display text-5xl leading-[0.9] text-white sm:text-6xl xl:text-[5.9rem]">
                          {featuredComic.title}
                        </h1>

                        <div className="mt-8 flex items-baseline gap-4">
                          <span className="text-[9px] font-black uppercase tracking-[0.55em] text-white/32">
                            Rating
                          </span>
                          <span className="text-2xl font-black uppercase tracking-[0.18em] text-white">
                            {featuredComic.rating || '8.5'}
                          </span>
                        </div>

                        <Link
                          href={featuredComic.href}
                          className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-[10px] font-black uppercase tracking-[0.4em] text-black transition-transform hover:scale-[1.02] active:scale-95"
                        >
                          Read
                        </Link>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.06, duration: 0.75 }}
                        className="relative z-20 mx-auto w-full max-w-[26rem] lg:mx-0 lg:ml-auto lg:translate-y-2"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden rounded-[2.25rem] bg-black shadow-[0_35px_110px_rgba(0,0,0,0.62)]">
                          <SafeCoverImage
                            key={featuredPosterSrc}
                            src={featuredPosterSrc}
                            alt={featuredComic.title}
                            priority
                            sizes="(max-width: 1024px) 78vw, 420px"
                            className="object-cover object-center"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.12)_58%,rgba(0,0,0,0.58)_100%)]" />
                          <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/55 px-4 py-2 text-[9px] font-black uppercase tracking-[0.35em] text-white/70 backdrop-blur-xl">
                            {featuredComic.rating || '8.5'}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>
        {/* --- BROWSE CONTROLS --- */}
        <section id="browse-categories" className="relative z-20 px-4 pb-12 sm:px-6 md:px-8 lg:pb-16">
          <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[#ff5a1f]">
                  Browse
                </p>
                <h2 className="mt-3 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                  Browse categories
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
                  Pick a category to refine the experience. The section stays clean and category-first, without showing a manga preview.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('all')}
                  className={`group flex items-center gap-4 rounded-[1.5rem] border p-4 text-left transition-all duration-300 cursor-pointer ${
                    activeTab === 'all'
                      ? 'border-[#ff5a1f]/70 bg-[#ff5a1f]/12'
                      : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                    activeTab === 'all' ? 'bg-[#ff5a1f] text-white' : 'bg-white/[0.06] text-white/70'
                  }`}>
                    <LayoutGrid size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-black uppercase tracking-[0.25em] text-white">
                        All categories
                      </h3>
                      {activeTab === 'all' && (
                        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[8px] font-black uppercase tracking-[0.35em] text-white">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-white/42">
                      Show all categories
                    </p>
                  </div>
                </motion.button>

                {visibleShelves.map((shelf) => {
                  const isActive = activeTab === shelf.key;
                  return (
                    <motion.button
                      key={shelf.key}
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(shelf.key)}
                      className={`group flex items-center gap-4 rounded-[1.5rem] border p-4 text-left transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'border-[#ff5a1f]/70 bg-[#ff5a1f]/12'
                          : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        isActive ? 'bg-[#ff5a1f] text-white' : 'bg-white/[0.06] text-white/70'
                      }`}>
                        {shelf.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-sm font-black uppercase tracking-[0.25em] text-white">
                            {shelf.title}
                          </h3>
                          {isActive && (
                            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[8px] font-black uppercase tracking-[0.35em] text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-[11px] leading-5 text-white/42">
                          {shelf.subtitle}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-6 grid gap-4 rounded-[1.6rem] border border-white/10 bg-black/20 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                  <span className="shrink-0 text-[9px] font-black uppercase tracking-[0.35em] text-white/30">
                    Language
                  </span>
                  {MANGA_LANGUAGE_OPTIONS.filter(o => ['en', 'ru', 'es', 'fr', 'all'].includes(o.value)).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleLanguageChange(opt.value)}
                      className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
                        mangaLanguage === opt.value
                          ? 'bg-white text-black shadow-lg'
                          : 'border border-white/10 bg-white/[0.03] text-white/45 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {opt.value === 'all' ? 'Mixed' : opt.value}
                    </button>
                  ))}
                </div>

                <label className="relative min-w-[280px] lg:min-w-[340px]">
                  <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    type="text"
                    placeholder="Search titles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#ff5a1f] transition-colors"
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Shelves Layout */}
        <section className="relative z-20 px-4 sm:px-6 md:px-8 pb-24 sm:pb-28 lg:pb-32">
          <div className="space-y-20">
            {renderedShelves.every(s => shelfState[s.key]?.items.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0) &&
              searchQuery && (
                <div className="py-20 text-center">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/5 mb-6 text-white/20">
                    <Search size={40} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">No results found</h3>
                  <p className="text-white/40">We couldn&apos;t find any comics matching &quot;{searchQuery}&quot;</p>
                </div>
              )}

            <AnimatePresence>
              {renderedShelves.map((shelf) => {
                const state = shelf.key === 'for-you' ? { items: personalRecs, loading: isRecsLoading } : shelfState[shelf.key];
                if (!state) return null;

                const filteredItems = state.items.filter(comic =>
                  comic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  comic.description.toLowerCase().includes(searchQuery.toLowerCase())
                );

                if (shelf.key === 'for-you' && filteredItems.length === 0 && !isRecsLoading) return null;
                if (searchQuery && filteredItems.length === 0) return null;

                return (
                  <motion.div
                    key={shelf.key}
                    id={shelf.key}
                    ref={shelf.key === 'doujinshi' ? spicyThresholdRef : null}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-1">
                          {shelf.icon}
                          {shelf.subtitle}
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tight text-white">{shelf.title}</h2>
                      </div>
                      <Link href={`/library?tab=${encodeURIComponent(shelf.title)}`} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ffca3a]">
                        View All
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                      {state.loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="aspect-[2/3] animate-pulse rounded-2xl bg-white/5" />
                        ))
                      ) : (
                        filteredItems.slice(0, shelfCardLimit).map((comic) => {
                          const cardKey = `${shelf.key}:${comic.source}:${comic.id}`;
                          const adultContent = isAdultComic(comic);
                          const isPreviewOpen = adultContent && previewCardKey === cardKey;
                          const shouldBlur = adultContent && !isAgeVerified;

                          return (
                            <motion.article
                              key={comic.id}
                              initial={false}
                              whileHover={{ y: -12 }}
                              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                              className="group relative cursor-pointer"
                            >
                              <Link
                                href={resolveComicHref(comic)}
                                onClickCapture={(event) => {
                                  if (!isTouchDevice || !adultContent) return;
                                  if (!isPreviewOpen) {
                                    event.preventDefault();
                                    setPreviewCardKey(cardKey);
                                  }
                                }}
                              >
                                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl transition-all duration-700 group-hover:border-[#ff5a1f]/40 group-hover:shadow-[0_30px_60px_-15px_rgba(255,90,31,0.25)]">
                                  <SafeCoverImage
                                    key={comic.coverUrl}
                                    src={comic.coverUrl}
                                    alt={comic.title}
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
                                    className={`object-cover transition-all duration-1000 ${
                                      shouldBlur ? 'scale-110 blur-[8px]' : 'scale-100'
                                    } group-hover:scale-115`}
                                  />
                                  
                                  {/* Glassy Gradient Overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-100" />

                                  {shouldBlur && (
                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md opacity-100">
                                      <Zap size={24} className="text-[#ffca3a] mb-3 animate-pulse" />
                                      <div className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.3em] text-white backdrop-blur-xl">
                                        RESTRICTED
                                      </div>
                                    </div>
                                  )}

                                  <div className={`absolute inset-x-0 bottom-0 p-5 space-y-2 transition-all duration-700 ${
                                    shouldBlur
                                      ? 'translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                                      : 'translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                                  } ${isPreviewOpen ? '!translate-y-0 !opacity-100' : ''}`}>
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1 rounded-md bg-[#ffca3a] px-1.5 py-0.5 text-[8px] font-black text-black">
                                        <Star size={8} fill="currentColor" />
                                        {comic.rating}
                                      </div>
                                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Full Access</span>
                                    </div>
                                    <h4 className="line-clamp-2 text-sm font-black uppercase tracking-tight text-white leading-tight">{comic.title}</h4>
                                  </div>

                                  {/* Status Chip */}
                                  <div className={`absolute right-4 top-4 rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-xl transition-all duration-700 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 ${isPreviewOpen ? 'scale-100 opacity-100' : ''}`}>
                                    READ
                                  </div>
                                </div>
                              </Link>
                            </motion.article>

                          );
                        })
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>

        {showInfiniteDiscover ? (
          <section className="py-20 bg-black/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-1.5 h-8 bg-[#ff4d00] rounded-full" />
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight italic">More</h2>
                  <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em]">Scroll for more titles</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                {infiniteItems.map((comic, idx) => {
                  const cardKey = `discover:${comic.source}:${comic.id}`;
                  const adultContent = isAdultComic(comic);
                  const isPreviewOpen = adultContent && previewCardKey === cardKey;
                  const shouldBlur = adultContent && !isAgeVerified;

                  return (
                    <motion.div
                      key={`${comic.id}-${idx}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (idx % 6) * 0.05, duration: 0.6 }}
                    >
                      <Link
                        href={comic.href || `/library/${comic.source}/${comic.id}`}
                        className="group block"
                        onClickCapture={(event) => {
                          if (!isTouchDevice || !adultContent) return;
                          if (!isPreviewOpen) {
                            event.preventDefault();
                            setPreviewCardKey(cardKey);
                          }
                        }}
                      >
                        <div className="relative aspect-[2/3] overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.02] transition-all duration-700 group-hover:border-[#ff5a1f]/30 group-hover:shadow-[0_25px_50px_rgba(255,90,31,0.15)] group-hover:-translate-y-3">
                          <SafeCoverImage
                            key={comic.coverUrl || '/logo.png'}
                            src={comic.coverUrl || '/logo.png'}
                            alt={comic.title}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                            className={`object-cover transition-all duration-1000 ${
                              shouldBlur ? 'scale-110 blur-[10px]' : 'scale-100'
                            } group-hover:scale-115`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                          
                          {shouldBlur && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-md opacity-100">
                              <div className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[7px] font-black uppercase tracking-[0.3em] text-white">
                                RESTRICTED
                              </div>
                            </div>
                          )}
                          
                          <div className="absolute bottom-5 left-5 right-5 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                            <div className="text-[8px] font-black uppercase tracking-[0.3em] text-[#ff5a1f] mb-2">{comic.meta}</div>
                            <div className="text-[11px] font-black uppercase tracking-tight text-white line-clamp-2 leading-tight">{comic.title}</div>
                          </div>

                          <div className="absolute right-4 top-4 h-8 w-8 rounded-full border border-white/10 bg-black/40 flex items-center justify-center text-white/40 scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 backdrop-blur-xl">
                            <ArrowRight size={14} />
                          </div>
                        </div>
                      </Link>
                    </motion.div>

                  );
                })}
              </div>

              <div ref={loaderRef} className="py-20 flex flex-col items-center justify-center gap-6">
                {hasMoreInfinite ? (
                  <>
                    <div className="w-12 h-12 relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-[#ff4d00] rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-4 bg-[#ff4d00]/20 rounded-full"
                      />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Loading more</div>
                  </>
                ) : (
                  <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ff4d00]">No more titles</div>
                )}
              </div>
            </div>
          </section>
        ) : (
          <section className="py-16 bg-black/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[#ff5a1f]">More</p>
                <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white">
                  Open the full library
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
                  Mobile users get a lighter homepage first. Jump into the full catalog when you need more titles.
                </p>
                <Link
                  href="/library"
                  className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-[10px] font-black uppercase tracking-[0.4em] text-black transition-transform hover:scale-[1.02] active:scale-95"
                >
                  Browse Library
                </Link>
              </div>
            </div>
          </section>
        )}

      </main>

      <AnimatePresence>
        {showAgeGate && (
          <AgeGateOverlay
            title="AGE RESTRICTED"
            description="YOU MUST BE AT LEAST 18 YEARS OLD TO ACCESS THIS CONTENT."
            confirmLabel="I AM 18+"
            cancelLabel="EXIT"
            confirmAction={handleVerify}
            cancelAction={() => setShowAgeGate(false)}
          />
        )}
      </AnimatePresence>

      {/* Footer minimal */}
      <footer className="border-t border-white/10 py-12 text-center">
        <div className="container mx-auto px-4">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            iComics.wiki // Sequential Narrative Archive 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
