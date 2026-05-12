"use client";

import { useEffect, useRef } from "react";

// Recreates the bouncing-balls aesthetic from pelayomendez.dev's Pixi.js
// backdrop in plain Canvas 2D — one large central anchor + ~50 small balls
// drifting and bouncing off viewport edges.

interface Ball {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
}

const SMALL_COUNT = 50;
const BIG_RADIUS = 120;

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function makeSmall(w: number, h: number): Ball {
  return {
    x: rand(0, w),
    y: rand(0, h),
    r: rand(2, 9),
    vx: rand(-0.4, 0.4),
    vy: rand(-0.4, 0.4),
  };
}

export function Backdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    let w = window.innerWidth;
    let h = window.innerHeight;
    let raf = 0;
    let smalls: Ball[] = Array.from({ length: SMALL_COUNT }, () => makeSmall(w, h));
    const big = { x: w / 2, y: h / 2, r: BIG_RADIUS };

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      big.x = w / 2;
      big.y = h / 2;
    }

    function tick() {
      ctx!.clearRect(0, 0, w, h);

      // Big anchor — soft, low-contrast disc behind the content
      ctx!.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx!.beginPath();
      ctx!.arc(big.x, big.y, big.r, 0, Math.PI * 2);
      ctx!.fill();

      // Small bouncing balls
      ctx!.fillStyle = "rgba(0, 0, 0, 0.5)";
      for (const b of smalls) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < b.r || b.x > w - b.r) b.vx *= -1;
        if (b.y < b.r || b.y > h - b.r) b.vy *= -1;
        ctx!.beginPath();
        ctx!.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    // z-0 (not -z-10) so the canvas stacks above body's bg-background.
    // Negative z-index would render behind the body fill and stay invisible.
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
