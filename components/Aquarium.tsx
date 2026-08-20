"use client";

import { useEffect, useRef } from "react";

type Fish = {
  x: number;
  y: number;
  speed: number;
  dir: 1 | -1;
  scale: number;
  baseY: number;
  bobAmp: number;
  bobSpeed: number;
  phase: number;
  hue: string;
};

type Bubble = { x: number; y: number; r: number; speed: number; drift: number };
type Weed = { x: number; blades: number; height: number; hue: string; phase: number };
type Pellet = { x: number; y: number; vy: number; t: number; eaten: boolean };
type Ripple = { x: number; y: number; r: number; alpha: number };

/**
 * A self-contained, dependency-free aquarium — a calm replacement for the old
 * Flash blog part. Goldfish drift with waving tails, seaweed sways, light rays
 * fall and bubbles rise. Click/tap the water to drop food; the nearest fish
 * darts over to eat it. Sizes to its container; static when reduced-motion.
 */
export default function Aquarium() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    const fishes: Fish[] = [];
    const bubbles: Bubble[] = [];
    const weeds: Weed[] = [];
    const pellets: Pellet[] = [];
    const ripples: Ripple[] = [];

    const FISH_HUES = ["#ff7a3d", "#ff9d5c", "#ef5a4f", "#ffc14d", "#c0c4cc"];

    const seed = () => {
      fishes.length = 0;
      bubbles.length = 0;
      weeds.length = 0;

      const fishDefs = [
        { yf: 0.32, speed: 28, dir: 1, scale: 1.0, bob: 0.06, bobS: 0.9 },
        { yf: 0.55, speed: 19, dir: -1, scale: 0.74, bob: 0.05, bobS: 1.2 },
        { yf: 0.72, speed: 23, dir: 1, scale: 0.58, bob: 0.045, bobS: 1.5 },
        { yf: 0.45, speed: 15, dir: -1, scale: 0.66, bob: 0.05, bobS: 1.05 },
      ] as const;

      fishDefs.forEach((d, i) => {
        fishes.push({
          x: W * (0.18 + ((i * 0.21) % 0.7)),
          y: H * d.yf,
          speed: d.speed,
          dir: d.dir,
          scale: d.scale,
          baseY: H * d.yf,
          bobAmp: H * d.bob,
          bobSpeed: d.bobS,
          phase: i * 1.7,
          hue: FISH_HUES[i % FISH_HUES.length],
        });
      });

      for (let i = 0; i < 11; i++) {
        bubbles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 1 + Math.random() * 2.5,
          speed: 8 + Math.random() * 18,
          drift: Math.random() * Math.PI * 2,
        });
      }

      const weedDefs = [
        { xf: 0.1, blades: 3, hf: 0.42, hue: "#7fa88a" },
        { xf: 0.24, blades: 2, hf: 0.3, hue: "#9bbf9f" },
        { xf: 0.78, blades: 4, hf: 0.5, hue: "#6f9f86" },
        { xf: 0.9, blades: 2, hf: 0.34, hue: "#9bbf9f" },
      ];
      weeds.length = 0;
      weedDefs.forEach((d, i) =>
        weeds.push({
          x: W * d.xf,
          blades: d.blades,
          height: H * d.hf,
          hue: d.hue,
          phase: i * 0.8,
        }),
      );
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const feed = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      ripples.push({ x, y, r: 2, alpha: 0.5 });
      const n = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < n; i++) {
        pellets.push({
          x: x + (Math.random() - 0.5) * 14,
          y: y + (Math.random() - 0.5) * 8,
          vy: 14 + Math.random() * 10,
          t: 0,
          eaten: false,
        });
      }
    };

    const onPointer = (e: PointerEvent) => feed(e.clientX, e.clientY);

    const drawFish = (f: Fish, t: number, hungry: boolean) => {
      const wag = hungry ? 9 : 6;
      const tail = Math.sin(t * wag + f.phase) * 0.5;
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.scale(f.dir * f.scale, f.scale);

      ctx.beginPath();
      ctx.moveTo(-14, 0);
      ctx.quadraticCurveTo(-26, -10 + tail * 8, -30, -2 + tail * 10);
      ctx.quadraticCurveTo(-24, 0, -30, 2 - tail * 10);
      ctx.quadraticCurveTo(-26, 10 - tail * 8, -14, 0);
      ctx.fillStyle = f.hue;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 9.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = f.hue;
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(2, 2.5, 11, 5.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-2, -8);
      ctx.quadraticCurveTo(2, -16 - tail * 4, 8, -7);
      ctx.fillStyle = f.hue;
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.arc(10, -1.5, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = "#1f1f24";
      ctx.fill();

      ctx.restore();
    };

    const drawWeed = (wd: Weed, t: number) => {
      const spacing = 5;
      for (let b = 0; b < wd.blades; b++) {
        const bx = wd.x + (b - (wd.blades - 1) / 2) * spacing;
        const h = wd.height * (0.7 + (b % 2) * 0.3);
        const sway = Math.sin(t * 1.1 + wd.phase + b) * 9;
        ctx.beginPath();
        ctx.moveTo(bx - 2.5, H);
        ctx.quadraticCurveTo(bx + sway * 0.5, H - h * 0.55, bx + sway, H - h);
        ctx.quadraticCurveTo(bx + sway * 0.5 + 3, H - h * 0.55, bx + 2.5, H);
        ctx.fillStyle = wd.hue;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    const drawScene = (t: number) => {
      ctx.clearRect(0, 0, W, H);

      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#eef4f7");
      g.addColorStop(1, "#dde8ee");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 3; i++) {
        const rx = W * (0.2 + i * 0.3) + Math.sin(t * 0.3 + i) * 12;
        ctx.beginPath();
        ctx.moveTo(rx - 10, 0);
        ctx.lineTo(rx + 10, 0);
        ctx.lineTo(rx + 40, H);
        ctx.lineTo(rx + 14, H);
        ctx.closePath();
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fill();
      }
      ctx.restore();

      weeds.forEach((wd) => drawWeed(wd, t));

      ctx.fillStyle = "#cdd6dc";
      ctx.fillRect(0, H - 10, W, 10);
      ctx.fillStyle = "#bcc7cf";
      for (let i = 0; i < W; i += 9) {
        const r = 2 + ((i * 7) % 3);
        ctx.beginPath();
        ctx.arc(i + 4, H - 6 + (i % 2 ? 2 : 0), r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Food pellets
      pellets.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = "#b9742f";
        ctx.fill();
      });

      // Ripples from feeding
      ripples.forEach((rp) => {
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(120,150,170,${rp.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      ctx.fillStyle = "rgba(255,255,255,0.6)";
      bubbles.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x + Math.sin(t + b.drift) * 4, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      const hungry = pellets.length > 0;
      fishes.forEach((f) => drawFish(f, t, hungry));
    };

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      // Food sinks and ages.
      pellets.forEach((p) => {
        p.t += dt;
        p.y = Math.min(H - 12, p.y + p.vy * dt);
      });

      fishes.forEach((f) => {
        // Seek the nearest piece of food, if any.
        let target: Pellet | null = null;
        let best = Infinity;
        for (const p of pellets) {
          if (p.eaten) continue;
          const d = Math.hypot(p.x - f.x, p.y - f.y);
          if (d < best) {
            best = d;
            target = p;
          }
        }

        if (target) {
          const dx = target.x - f.x;
          const dy = target.y - f.y;
          const len = Math.hypot(dx, dy) || 1;
          const sp = f.speed * 2.1;
          f.dir = dx >= 0 ? 1 : -1;
          f.x += (dx / len) * sp * dt;
          f.y += (dy / len) * sp * dt;
          f.baseY = f.y;
          if (best < 11) target.eaten = true;
        } else {
          f.x += f.speed * f.dir * dt;
          const margin = 34 * f.scale;
          if (f.x > W - margin) {
            f.x = W - margin;
            f.dir = -1;
          } else if (f.x < margin) {
            f.x = margin;
            f.dir = 1;
          }
          f.y = f.baseY + Math.sin(t * f.bobSpeed + f.phase) * f.bobAmp;
        }
      });

      // Cull eaten / expired food.
      for (let i = pellets.length - 1; i >= 0; i--) {
        if (pellets[i].eaten || pellets[i].t > 14) pellets.splice(i, 1);
      }

      ripples.forEach((rp) => {
        rp.r += 28 * dt;
        rp.alpha -= 0.9 * dt;
      });
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (ripples[i].alpha <= 0) ripples.splice(i, 1);
      }

      bubbles.forEach((b) => {
        b.y -= b.speed * dt;
        if (b.y < -4) {
          b.y = H + 4;
          b.x = Math.random() * W;
        }
      });

      drawScene(t);
      raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    if (reduce) {
      drawScene(0);
    } else {
      canvas.addEventListener("pointerdown", onPointer);
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onPointer);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full cursor-pointer touch-none"
      aria-hidden="true"
    />
  );
}
