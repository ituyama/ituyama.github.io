import type { MetadataRoute } from "next";

import { profile } from "@/lib/profile";
import { siteDescription } from "@/lib/seo";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.nameJa}｜${profile.nameEn}`,
    short_name: profile.nameJa,
    description: siteDescription,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#00e676",
    lang: "ja",
    dir: "ltr",
    icons: [
      {
        src: profile.avatar,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
