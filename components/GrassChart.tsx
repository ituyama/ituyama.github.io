"use client";

import { buildGrassWeeks, type GrassDay } from "@/lib/grass";

type Props = {
  contributions: GrassDay[];
  total: number;
  compact?: boolean;
};

export default function GrassChart({ contributions, total, compact = false }: Props) {
  const weeks = buildGrassWeeks(contributions);

  if (compact) {
    return (
      <div
        className="pop-grass pop-grass-compact"
        role="img"
        aria-label={`GitHub 草。過去1年 ${total} 件。`}
      >
        <div className="pop-grass-grid" aria-hidden="true">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="pop-grass-week">
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
      </div>
    );
  }

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
    </div>
  );
}
