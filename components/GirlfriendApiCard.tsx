"use client";

import { useEffect, useState } from "react";

import { SITE_URL } from "@/lib/seo";

type Payload = {
  hasGirlfriend: boolean;
};

const ENDPOINT = "/api/girlfriend";

export default function GirlfriendApiCard() {
  const [payload, setPayload] = useState<Payload | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(ENDPOINT);
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as Payload;
        if (!cancelled) setPayload(data);
      } catch {
        try {
          const res = await fetch("/data/girlfriend.json");
          if (!res.ok) throw new Error(String(res.status));
          const data = (await res.json()) as Payload;
          if (!cancelled) setPayload(data);
        } catch {
          if (!cancelled) setPayload({ hasGirlfriend: false });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const json = JSON.stringify(payload ?? { hasGirlfriend: false }, null, 2);
  const absolute = `${SITE_URL}${ENDPOINT}`;

  return (
    <div className="pop-girlfriend-api" aria-label="彼女在籍状況 API">
      <p className="pop-girlfriend-api-label">REST API（ネタ）</p>
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
