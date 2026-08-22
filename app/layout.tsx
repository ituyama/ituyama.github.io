import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fira_Code, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "@fontsource/line-seed-jp/400.css";
import "@fontsource/line-seed-jp/700.css";
import "@fontsource/line-seed-jp/800.css";
import "./globals.css";
import ContactFormProvider from "@/components/ContactFormProvider";
import ProfileFacts from "@/components/ProfileFacts";
import Splash from "@/components/Splash";
import { profile } from "@/lib/profile";
import {
  jsonLdGraph,
  ogImages,
  SITE_URL,
  siteDescription,
  siteKeywords,
  siteTitle,
  twitterHandle,
} from "@/lib/seo";

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

const GA_MEASUREMENT_ID = "G-C6TSYXVQ9R";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: siteTitle, template: `%s｜${profile.nameJa}` },
  description: siteDescription,
  keywords: siteKeywords,
  applicationName: profile.nameJa,
  authors: [{ name: profile.nameEn, url: SITE_URL }, { name: profile.nameJa, url: SITE_URL }],
  creator: profile.nameEn,
  publisher: profile.nameEn,
  category: "portfolio",
  alternates: {
    canonical: "/",
    languages: { "ja-JP": "/" },
    types: {
      "application/ld+json": `${SITE_URL}/`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, email: false, address: false },
  icons: {
    icon: [{ url: profile.avatar, type: "image/png" }],
    apple: profile.avatar,
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: SITE_URL,
    siteName: siteTitle,
    locale: "ja_JP",
    alternateLocale: ["en_US"],
    countryName: "Japan",
    images: ogImages,
    type: "profile",
    firstName: "Itsuki",
    lastName: "Yamano",
    username: "ituyama",
    emails: profile.email ? [profile.email] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ogImages,
    creator: twitterHandle ? `@${twitterHandle}` : undefined,
    site: twitterHandle ? `@${twitterHandle}` : undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#00e676",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph()) }}
        />
        {profile.socials.map((social) => (
          <link key={social.url} rel="me" href={social.url} />
        ))}
      </head>
      <body className={`${notoSansJp.variable} ${notoSerifJp.variable} ${firaCode.variable}`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <ContactFormProvider>
          <ProfileFacts />
          <Splash />
          {children}
        </ContactFormProvider>
      </body>
    </html>
  );
}
