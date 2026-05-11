import ReadingHubClient from '@/app/reading/ReadingHubClient';
import { staticPageMetadata } from '@/lib/seo/page-metadata';

export const metadata = staticPageMetadata({
  title: 'Reading hub — guides, RSS & progress',
  description:
    'Start here for icomics.wiki: guides for the manga/manhwa/webtoon fullscreen browser reader, RSS for chapters, FAQs & Support—and why “iComics wiki” here is not other apps or Fandom hosts.',
  path: '/reading',
  localeAlternates: true,
});

export default function ReadingHubPage() {
  return <ReadingHubClient />;
}
