import type { MetadataRoute } from "next";
import { SITE_URL, siteModified } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: siteModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified: siteModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
