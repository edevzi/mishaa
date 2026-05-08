import ReadingHubClient from '@/app/reading/ReadingHubClient';
import { staticPageMetadata } from '@/lib/seo/page-metadata';

export const metadata = staticPageMetadata({
  title: 'Reading hub — guides, RSS & library',
  description:
    'Central index for reading manga and comics on iComics.wiki: editorial guides, RSS updates, FAQ, and the multi-source library.',
  path: '/reading',
  keywords: [
    'reading hub manga',
    'icomics wiki RSS',
    'manga library index',
    'comic guides',
    'read manga online',
    'manhwa resources',
    'FAQ comics',
    'how to find manga chapters',
  ],
});

export default function ReadingHubPage() {
  return <ReadingHubClient />;
}
