"use client";

import { useEffect, useRef } from "react";

// Official "DVD Video" logo outline (DVD Format/Logo Licensing ended 2024;
// the mark is no longer administered or licensed by any organization).
const DVD_PATH =
  "m91.053 0-13.719 57.707 102.28 0.039063h24c65.747 0 105.91 26.44 94.746 73.4-12.147 51.133-69.613 73.4-130.67 73.4h-22.947l29.787-125.45h-102.27l-43.521 183.2h145.05c109.07 0 212.76-57.573 231.01-131.15 3.3467-13.507 2.8806-47.253-5.3594-67.359-0.21299-0.787-0.42594-1.4-1.1855-3-0.293-0.653-0.56012-3.6412 1.1465-4.2812 0.947-0.36 2.7069 1.4944 2.9336 2.041 0.853 2.24 1.5059 3.9062 1.5059 3.9062l92.293 260.6 234.97-265.21 99.535-0.089844h24c65.76 0 106.25 26.44 95.092 73.4-12.147 51.133-69.947 73.4-131 73.4h-22.959l29.799-125.47h-102.27l-43.533 183.21h145.07c109.05 0 213.48-57.4 231-131.15 17.52-73.75-59.107-131.15-168.69-131.15h-216.4s-57.319 67.88-67.959 80.693c-57.12 68.787-67.241 87.226-68.961 91.986 0.24-4.8-1.8138-23.412-26.174-92.959-6.48-18.52-27.359-79.721-27.359-79.721h-389.25zm408.77 324.16c-276.04 0-499.83 31.72-499.83 70.84s223.79 70.84 499.83 70.84c276.04 0 499.83-31.72 499.83-70.84s-223.79-70.84-499.83-70.84zm-18.094 48.627c63.04 0 114.13 10.573 114.13 23.613s-51.095 23.613-114.13 23.613c-63.027 0-114.13-10.573-114.13-23.613s51.106-23.613 114.13-23.613z";
const VIEW_W = 1058.4;
const VIEW_H = 465.84;

const COLORS = [
  "#00e676",
  "#ffffff",
  "#ff5a5f",
  "#ffb03a",
  "#3ab6ff",
  "#8a7cff",
  "#ff6fd8",
  "#5ad17a",
];

/**
 * The classic bouncing DVD-logo screensaver using the real logo SVG. The logo
 * drifts, bounces off the walls (changing colour each time) and the whole tile
 * flashes on a rare exact corner hit. Static frame on reduced-motion.
 */
export default function DvdBounce() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const logo = logoRef.current;
    const flashEl = flashRef.current;
    if (!wrap || !logo) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let lw = 0;
    let lh = 0;
    let x = 16;
    let y = 16;
    let vx = 72;
    let vy = 56;
    let ci = 0;
    let flash = 0;

    const measure = () => {
      const r = wrap.getBoundingClientRect();
      W = r.width;
      H = r.height;
      lw = Math.max(70, Math.min(W * 0.46, 168));
      lh = lw * (VIEW_H / VIEW_W);
      logo.style.width = `${lw}px`;
      logo.style.height = `${lh}px`;
      x = Math.min(x, Math.max(0, W - lw));
      y = Math.min(y, Math.max(0, H - lh));
    };

    const apply = () => {
      logo.style.transform = `translate(${x}px, ${y}px)`;
      logo.style.color = COLORS[ci];
    };

    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    measure();
    apply();

    if (reduce) {
      x = (W - lw) / 2;
      y = (H - lh) / 2;
      apply();
      return () => ro.disconnect();
    }

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      x += vx * dt;
      y += vy * dt;

      let bx = false;
      let by = false;
      if (x <= 0) {
        x = 0;
        vx = Math.abs(vx);
        bx = true;
      } else if (x + lw >= W) {
        x = W - lw;
        vx = -Math.abs(vx);
        bx = true;
      }
      if (y <= 0) {
        y = 0;
        vy = Math.abs(vy);
        by = true;
      } else if (y + lh >= H) {
        y = H - lh;
        vy = -Math.abs(vy);
        by = true;
      }
      if (bx || by) {
        ci = (ci + 1) % COLORS.length;
        if (bx && by) flash = 0.55;
      }
      if (flash > 0) flash = Math.max(0, flash - dt);
      if (flashEl) {
        flashEl.style.opacity = String(Math.min(0.35, flash));
        flashEl.style.backgroundColor = COLORS[ci];
      }

      apply();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative h-full w-full overflow-hidden bg-[#0b0b0d]">
      <div ref={flashRef} className="pointer-events-none absolute inset-0" style={{ opacity: 0 }} />
      <div ref={logoRef} className="absolute left-0 top-0 will-change-transform" style={{ color: "#fff" }}>
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="h-full w-full" fill="currentColor" aria-hidden="true">
          <path d={DVD_PATH} />
        </svg>
      </div>
    </div>
  );
}
