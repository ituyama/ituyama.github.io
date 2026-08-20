import type { Metadata, Viewport } from "next";
import { Fira_Code, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "@fontsource/line-seed-jp/400.css";
import "@fontsource/line-seed-jp/700.css";
import "@fontsource/line-seed-jp/800.css";
import "./globals.css";
import { profile } from "@/lib/profile";
import ProfileFacts from "@/components/ProfileFacts";
import Splash from "@/components/Splash";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-fira-code",
  display: "swap",
});

const factDescription = [
  `${profile.nameJa}（${profile.nameEn}）のポートフォリオ。`,
  profile.companies.length
    ? profile.companies.map((c) => `${c.name}（${c.role}）`).join("、") + "。"
    : "",
  profile.university ? `${profile.university}。` : "",
  profile.location ? `拠点は${profile.location}。` : "",
  profile.skills.length ? `主なスキル: ${profile.skills.join("、")}。` : "",
]
  .filter(Boolean)
  .join("");

export const metadata: Metadata = {
  metadataBase: new URL("https://ituyama.com"),
  title: { default: `${profile.nameEn}｜${profile.nameJa}`, template: "%s｜Yamano Itsuki" },
  description: factDescription,
  keywords: [
    profile.nameJa,
    profile.nameEn,
    ...profile.companies.map((c) => c.name),
    ...profile.skills,
    "ポートフォリオ",
    "portfolio",
  ],
  authors: [{ name: profile.nameEn }],
  creator: profile.nameEn,
  alternates: { canonical: "/" },
  icons: { icon: "/media/yamanopic.png" },
  openGraph: {
    title: `${profile.nameEn}｜${profile.nameJa}`,
    description: factDescription,
    url: "https://ituyama.com",
    siteName: "Yamano Itsuki",
    locale: "ja_JP",
    images: ["/media/ogp.png"],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.nameEn}｜${profile.nameJa}`,
    description: factDescription,
    images: ["/media/ogp.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#00e676",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.nameEn,
  alternateName: profile.nameJa,
  url: "https://ituyama.com",
  image: `https://ituyama.com${profile.avatar}`,
  email: profile.email || undefined,
  jobTitle: profile.companies[0]?.role,
  worksFor: profile.companies.map((c) => ({ "@type": "Organization", name: c.name })),
  address: profile.location
    ? { "@type": "PostalAddress", addressLocality: profile.location }
    : undefined,
  knowsAbout: profile.skills,
  sameAs: profile.socials.map((s) => s.url),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" dir="ltr">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap"
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={`${notoSansJp.variable} ${notoSerifJp.variable} ${firaCode.variable}`}>
        <ProfileFacts />
        <Splash />
        {children}
      </body>
    </html>
  );
}
