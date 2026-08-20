/**
 * Embeds the official Spotify player for a track / album / playlist / artist.
 * Accepts a normal Spotify URL (https://open.spotify.com/track/...) or URI
 * (spotify:track:...) and converts it to the /embed/ player URL. No auth needed.
 */
function toEmbedSrc(input: string): string | null {
  let path = "";
  const uri = input.match(/^spotify:(track|album|playlist|artist|episode|show):([A-Za-z0-9]+)/);
  if (uri) {
    path = `${uri[1]}/${uri[2]}`;
  } else {
    const url = input.match(
      /open\.spotify\.com\/(track|album|playlist|artist|episode|show)\/([A-Za-z0-9]+)/,
    );
    if (url) path = `${url[1]}/${url[2]}`;
  }
  if (!path) return null;
  return `https://open.spotify.com/embed/${path}?utm_source=generator&theme=0`;
}

export default function SpotifyEmbed({ url }: { url?: string }) {
  const src = url ? toEmbedSrc(url) : null;
  if (!src) {
    return (
      <div className="flex h-full items-center justify-center text-bento-muted">
        <i className="bi bi-spotify text-2xl" aria-hidden="true" />
      </div>
    );
  }
  return (
    <iframe
      title="Spotify プレーヤー"
      src={src}
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      className="block h-full w-full"
    />
  );
}
