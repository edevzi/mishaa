import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPublicSiteUrl } from '@/lib/og-metadata';
import { staticPageMetadata } from '@/lib/seo/page-metadata';
import { LinkToUsCopyBlock } from '@/app/link-to-us/LinkToUsCopyBlock';

export const metadata: Metadata = staticPageMetadata({
  title: 'Press & partners — official linking kit for iComics.wiki',
  description:
    'Official URL, HTML snippets, and localized deep links (ui=) for citing iComics.wiki. Independent manga & manhwa browser library—not MangaDex.org, not the legacy iOS iComics file app.',
  path: '/link-to-us',
  localeAlternates: true,
});

export default function LinkToUsPage() {
  const site = getPublicSiteUrl().replace(/\/$/, '');

  const canonicalUrl = `${site}/`;
  const htmlDescriptive = `<a href="${canonicalUrl}">iComics.wiki — manga &amp; manhwa browser library</a>`;
  const htmlAccessible = `<a href="${canonicalUrl}" title="iComics.wiki — read manga &amp; manhwa in your browser">iComics.wiki</a>`;
  const htmlMinimal = `<a href="${canonicalUrl}" rel="noopener noreferrer">iComics.wiki</a>`;
  const markdownInline = `[iComics.wiki](${canonicalUrl})`;

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-white pt-nav-catalog text-neutral-900 dark:bg-[#06070b] dark:text-neutral-100">
        <div className="pointer-events-none absolute inset-0 opacity-[0.14] dark:opacity-[0.22] halftone-bg" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,90,31,0.08),transparent_36%),radial-gradient(circle_at_top_right,rgba(115,247,255,0.06),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,90,31,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(115,247,255,0.08),transparent_28%)]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:max-w-4xl lg:px-8 lg:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-4 py-2 text-[9px] font-black uppercase tracking-[0.4em] text-neutral-600 dark:border-white/10 dark:bg-black/40 dark:text-white/55">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a1f]" />
            Press · partnerships · directories
          </div>

          <h1 className="mt-6 font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-neutral-900 sm:text-4xl md:text-5xl dark:text-white">
            Official linking kit
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-white/68 md:text-base">
            Use these assets when you cite or recommend <strong className="font-semibold text-neutral-900 dark:text-white">iComics.wiki</strong>.
            The site is an independent browser library for manga, manhwa, and vertical webtoons—it is{' '}
            <span className="whitespace-nowrap">not MangaDex.org</span>, not the discontinued DRM iOS “iComics” comic file
            manager, and not unrelated Fan wikis.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-neutral-500 dark:text-white/45">
            Partnerships or corrections:{' '}
            <a
              href="mailto:info@icomics.wiki?subject=iComics.wiki%20—%20link%20%2F%20press"
              className="font-semibold text-[#ff5a1f] underline decoration-[#ff5a1f]/35 underline-offset-4 hover:decoration-[#ff5a1f]"
            >
              info@icomics.wiki
            </a>
            . For branding context see{' '}
            <Link href="/icomics-wiki" className="font-semibold text-[#ff5a1f] underline decoration-[#ff5a1f]/35 underline-offset-4">
              /icomics-wiki
            </Link>
            .
          </p>

          <div className="mt-12 space-y-6">
            <LinkToUsCopyBlock
              id="snippet-canonical"
              title="Canonical URL"
              description="Best default when a plain link is enough (no tracking parameters on our side)."
              code={canonicalUrl}
              copyLabel="Copy URL"
              copiedLabel="Copied"
            />
            <LinkToUsCopyBlock
              id="snippet-html-desc"
              title="HTML — descriptive anchor"
              description="Clear for readers; adjust wording if your style guide prefers shorter labels."
              code={htmlDescriptive}
              copyLabel="Copy HTML"
              copiedLabel="Copied"
            />
            <LinkToUsCopyBlock
              id="snippet-html-a11y"
              title="HTML — accessible short anchor"
              description="Keeps visible text short while exposing a fuller label to assistive tech."
              code={htmlAccessible}
              copyLabel="Copy HTML"
              copiedLabel="Copied"
            />
            <LinkToUsCopyBlock
              id="snippet-html-min"
              title="HTML — minimal + security attrs"
              description="Typical for blog sidebars. Change rel if your policy requires nofollow or sponsored."
              code={htmlMinimal}
              copyLabel="Copy HTML"
              copiedLabel="Copied"
            />
            <LinkToUsCopyBlock
              id="snippet-md"
              title="Markdown"
              description="For README files, wikis, or static generators."
              code={markdownInline}
              copyLabel="Copy Markdown"
              copiedLabel="Copied"
            />
          </div>

          <section
            className="mt-14 rounded-[1.75rem] border border-black/10 bg-white/75 p-6 dark:border-white/10 dark:bg-white/3 sm:p-8"
            aria-labelledby="localized-v1"
          >
            <h2 id="localized-v1" className="text-[11px] font-black uppercase tracking-[0.32em] text-neutral-500 dark:text-white/50">
              Localized interface (SEO hreflang)
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-white/65">
              Appending <code className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[11px] dark:bg-white/10">?ui=</code> to
              any path sets the UI language for that visit and matches our{' '}
              <code className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[11px] dark:bg-white/10">hreflang</code> alternates.
              Example library entry in Korean:
            </p>
            <p className="mt-4 font-mono text-[11px] text-neutral-800 dark:text-white/80 sm:text-xs">
              {`${site}/library?ui=ko`}
            </p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-black/8 dark:border-white/10">
              <table className="w-full min-w-[280px] border-collapse text-left text-[11px] sm:text-xs">
                <caption className="sr-only">Supported ui parameter values</caption>
                <thead>
                  <tr className="border-b border-black/10 bg-neutral-50/90 dark:border-white/10 dark:bg-black/40">
                    <th scope="col" className="px-4 py-3 font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-white/45">
                      ui=
                    </th>
                    <th scope="col" className="px-4 py-3 font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-white/45">
                      Interface
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/8 dark:divide-white/10">
                  {[
                    ['en', 'English'],
                    ['ja', 'Japanese'],
                    ['ko', 'Korean'],
                    ['zh', 'Chinese (Simplified)'],
                    ['ru', 'Russian'],
                  ].map(([code, label]) => (
                    <tr key={code} className="bg-white/60 dark:bg-transparent">
                      <td className="px-4 py-3 font-mono font-medium text-neutral-800 dark:text-white/85">{code}</td>
                      <td className="px-4 py-3 text-neutral-600 dark:text-white/65">{label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10 border-t border-black/10 pt-10 dark:border-white/10">
            <h2 className="text-[11px] font-black uppercase tracking-[0.32em] text-neutral-500 dark:text-white/50">
              Optional logo
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-white/65">
              Square mark:{' '}
              <a
                href={`${site}/logo.png`}
                className="font-semibold text-[#ff5a1f] underline decoration-[#ff5a1f]/35 underline-offset-4"
              >
                {site}/logo.png
              </a>{' '}
              (512×512). Do not crop into misleading badges or imply endorsement by third-party catalogs.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
