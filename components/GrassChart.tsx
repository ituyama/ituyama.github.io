"use client";

import { buildGrassWeeks, type GrassDay, type GrassFeed } from "@/lib/grass";

type Props = {
  contributions: GrassDay[];
  total: number;
};

export default function GrassChart({ contributions, total }: Props) {
  const weeks = buildGrassWeeks(contributions);

  return (
    <div className="pop-grass">
      <p className="pop-grass-total">
        過去1年 <strong>{total.toLocaleString("ja-JP")}</strong> contributions
      </p>
      <div className="pop-grass-grid" role="img" aria-label={`GitHub 草。過去1年 ${total} 件。`}>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="pop-grass-week" aria-hidden="true">
            {week.map((day, dayIndex) =>
              day ? (
                <span
                  key={day.date}
                  className={`pop-grass-cell level-${day.level}`}
                  title={`${day.date}: ${day.count}`}
                />
              ) : (
                <span key={`empty-${weekIndex}-${dayIndex}`} className="pop-grass-cell is-empty" />
              ),
            )}
          </div>
        ))}
      </div>
      <ul className="pop-grass-legend" aria-hidden="true">
        <li>少</li>
        {[0, 1, 2, 3, 4].map((level) => (
          <li key={level}>
            <span className={`pop-grass-cell level-${level}`} />
          </li>
        ))}
        <li>多</li>
      </ul>
    </div>
  );
}
