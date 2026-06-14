// Metadata for /library is owned entirely by library/page.tsx's generateMetadata
// (localized title/description, canonical, hreflang, OG/Twitter). Defining a second,
// divergent static metadata block here leaked conflicting OG/title signals via the
// layout→page deep-merge, so this layout is now a pure pass-through.
export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
