import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | The iComics.wiki Vision",
  description: "Learn about iComics.wiki Studio and our mission to empower independent comic creators with cutting-edge AI technology.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
