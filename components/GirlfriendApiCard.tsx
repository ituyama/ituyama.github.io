"use client";

import { useEffect, useState } from "react";

import { GIRLFRIEND_API_PATH, type GirlfriendPayload } from "@/lib/girlfriend";
import { SITE_URL } from "@/lib/seo";

export default function GirlfriendApiCard() {
  const [payload, setPayload] = useState<GirlfriendPayload | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(GIRLFRIEND_API_PATH, { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<GirlfriendPayload>;
      })
      .then((data) => {
        if (!cancelled) {
          setPayload(data);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const absolute = `${SITE_URL}${GIRLFRIEND_API_PATH}`;
  const json = payload ? JSON.stringify(payload, null, 2) : error ? "/* fetch failed */" : "…";

  return (
    <div className="pop-girlfriend-api" aria-label="彼女在籍状況 API">
      <p className="pop-girlfriend-api-label">彼女存在判定API</p>
      <p className="pop-girlfriend-api-method">
        <span className="pop-girlfriend-api-verb">GET</span>{" "}
        <code className="pop-girlfriend-api-url">{absolute}</code>
      </p>
      <pre className="pop-girlfriend-api-body">
        <code>{json}</code>
      </pre>
    </div>
  );
}
