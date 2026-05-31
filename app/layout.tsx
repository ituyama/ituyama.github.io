import type { Metadata, Viewport } from "next";
import { Fira_Code, Noto_Sans_JP } from "next/font/google";
import "@fontsource/line-seed-jp/400.css";
import "@fontsource/line-seed-jp/700.css";
import "@fontsource/line-seed-jp/800.css";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ituyama.com"),
  title: "Yamano Itsuki",
  description: "山野一樹のポートフォリオ。LLM が応答を Bento グリッドとして組み立てます。",
  icons: { icon: "/media/yamanopic.png" },
  openGraph: {
    title: "Yamano Itsuki",
    description: "LLM × Bento UI のポートフォリオ。",
    url: "https://ituyama.com",
    siteName: "YamanoItsuki",
    images: ["/media/ogp.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yamano Itsuki",
    description: "LLM × Bento UI のポートフォリオ。",
    images: ["/media/ogp.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
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
      </head>
      <body className={`${notoSansJp.variable} ${firaCode.variable}`}>
        {children}
      </body>
    </html>
  );
}
