import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

export const metadata: Metadata = {
  title: 'iComics.wiki Wiki - Read Manga, Manhwa & Marvel Comics Online',
  description: 'Explore a massive library of Manga, Manhwa, and Marvel comics. Read online, discover new series, and use our AI-powered studio to create your own visual narratives.',
  keywords: 'read manga online, manhwa wiki, marvel comics archive, free comic reader, ai comic creator, digital comics library',
  openGraph: {
    title: 'iComics.wiki Wiki - The Ultimate Digital Comic Archive',
    description: 'Read thousands of comics online and create your own stories with AI.',
    url: 'https://icomics.wiki',
    siteName: 'iComics.wiki Wiki',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'iComics.wiki Wiki & Studio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iComics.wiki Wiki - Read & Create Comics',
    description: 'The ultimate synthesis environment for comic readers and creators.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://icomics.wiki',
  },
};

import JsonLd from '@/components/JsonLd';

import { getHomeData } from '@/lib/home-data';

export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const initialData = await getHomeData((lang as any) || 'en');

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "iComics.wiki Wiki",
    "url": "https://icomics.wiki",
    "logo": "https://icomics.wiki/logo.png",
    "sameAs": [
      "https://twitter.com/icomics.wiki",
      "https://github.com/icomics.wiki"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "iComics.wiki Wiki",
    "url": "https://icomics.wiki",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://icomics.wiki/library?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <HomeClient initialData={initialData} />
    </>
  );
}
