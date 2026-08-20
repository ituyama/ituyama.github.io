const PLACEHOLDERS = [
  { featured: true },
  { featured: false },
  { featured: false },
  { featured: false },
  { featured: false },
];

export default function BentoSkeleton() {
  return (
    <div className="discover-grid">
      {PLACEHOLDERS.map((p, i) => (
        <div
          key={i}
          className={`skeleton-tile discover-card ${p.featured ? "discover-card-featured" : ""}`}
          style={{ animationDelay: `${i * 110}ms` }}
        >
          <div className="discover-card-media discover-media-fill" />
          <div className="discover-card-body gap-2">
            <div
              className="skeleton-bar h-2.5 w-1/3 rounded-full bg-bento-panel"
              style={{ animationDelay: `${i * 110}ms` }}
            />
            <div
              className="skeleton-bar h-4 w-2/3 rounded-full bg-bento-panel"
              style={{ animationDelay: `${i * 110 + 80}ms` }}
            />
            <div
              className="skeleton-bar h-2.5 w-1/2 rounded-full bg-bento-panel"
              style={{ animationDelay: `${i * 110 + 160}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
