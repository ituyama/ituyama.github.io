import { calcAge, profile } from "@/lib/profile";
import { llmsTxtBody } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * Serves /llms.txt — an emerging convention that hands LLMs a concise,
 * authoritative markdown summary of the site so they can answer questions
 * about Yamano Itsuki accurately without scraping the JS-rendered UI.
 */
export function GET() {
  const age = profile.birthday ? calcAge(profile.birthday) : null;

  return new Response(llmsTxtBody(age), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
