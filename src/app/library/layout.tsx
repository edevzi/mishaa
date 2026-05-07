import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comic Library",
  description:
    "Browse and read comics, manga, manhwa, webtoons, and adult titles online. From Marvel classics to indie Japanese series—built for readers.",
};

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
