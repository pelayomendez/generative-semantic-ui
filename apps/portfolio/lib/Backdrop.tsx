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
  // Per-ball gradient parameters: `tone` is the darker shade (HSL
  // lightness, 0-100), and (lx, ly) is the highlight direction as a
  // fraction of radius — gives each ball a unique soft-3D shading.
  tone: number;
  lx: number;
  ly: number;
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
    tone: rand(74, 86), // light HSL lightness — close to the original #cfcfcf
    lx: rand(-0.6, 0.6),
    ly: rand(-0.6, 0.6),
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
    let t = 0;
    // Each collision pushes a ripple at the impact angle (local
    // perimeter wobble) and gives the whole blob a velocity kick away
    // from the impact (the spring-damper below pulls it back to rest).
    const ripples: Array<{ angle: number; age: number }> = [];
    const RIPPLE_LIFE = 80;
    const RIPPLE_PUSH = 10; // softer perimeter indent
    const RIPPLE_SPREAD = 0.5; // slightly wider, smoother bump
    const RIPPLE_OMEGA = 0.13; // slow wobble (~1.6 rings/life)
    // Whole-body displacement: collisions kick the blob away from the
    // impact site; a spring-damper draws it back to rest. Critically
    // damped so the blob glides back without spring overshoot.
    let dispX = 0;
    let dispY = 0;
    let velX = 0;
    let velY = 0;
    const SPRING = 0.04;
    const DAMPING = 0.4; // 2·√SPRING ≈ critically damped
    const IMPULSE = 0.55; // px/frame velocity added per collision (soft nudge)
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
      t += 0.01;

      // Age ripples; drop the dead. (Sorted by age since insertions are
      // always appended with age=0, so the head is the oldest.)
      for (const rip of ripples) rip.age++;
      while (ripples.length && ripples[0].age > RIPPLE_LIFE) ripples.shift();

      // Integrate the spring-damper: acceleration toward rest, scaled by
      // displacement; velocity damped by DAMPING coefficient.
      const ax = -SPRING * dispX - DAMPING * velX;
      const ay = -SPRING * dispY - DAMPING * velY;
      velX += ax;
      velY += ay;
      dispX += velX;
      dispY += velY;

      // Resting motion is intentionally subtle; the displacement adds
      // collision-driven translation on top.
      const cx =
        big.x +
        dispX +
        Math.sin(t * 0.4) * 12 +
        Math.sin(t * 0.13) * 5;
      const cy =
        big.y +
        dispY +
        Math.cos(t * 0.31) * 10 +
        Math.cos(t * 0.17) * 4;
      const breath = Math.sin(t * 0.35) * 7;

      // Soft drop shadow gives the blob volume — wide blur, slight Y offset.
      ctx!.shadowColor = "rgba(0, 0, 0, 0.12)";
      ctx!.shadowBlur = 36;
      ctx!.shadowOffsetX = 0;
      ctx!.shadowOffsetY = 10;
      // Radial gradient: soft highlight in the upper-left, slightly darker
      // toward the lower-right edge. The gradient travels with the blob
      // (anchored to cx, cy) so the lighting reads as belonging to it.
      const blobGradient = ctx!.createRadialGradient(
        cx - big.r * 0.25,
        cy - big.r * 0.35,
        0,
        cx,
        cy,
        big.r * 1.4,
      );
      blobGradient.addColorStop(0, "#f5f5f5");
      blobGradient.addColorStop(1, "#dcdcdc");
      ctx!.fillStyle = blobGradient;
      ctx!.beginPath();
      const segments = 96;
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        let r =
          big.r +
          breath +
          Math.sin(a * 3 + t * 1.2) * 7 +
          Math.sin(a * 5 - t * 0.75) * 4 +
          Math.sin(a * 7 + t * 0.45) * 2;
        // Localised wobble: each active ripple bulges the perimeter at
        // its impact angle with a Gaussian falloff, ringing out as a
        // damped cosine over its lifetime.
        for (const rip of ripples) {
          let da = a - rip.angle;
          while (da > Math.PI) da -= 2 * Math.PI;
          while (da < -Math.PI) da += 2 * Math.PI;
          const localness = Math.exp(-(da * da) / RIPPLE_SPREAD);
          const decay = 1 - rip.age / RIPPLE_LIFE;
          // -cos so the impact area indents inward first (soft-body
          // squish), then rings out — feels less jumpy than a bulge.
          const wobble = -Math.cos(rip.age * RIPPLE_OMEGA) * decay;
          r += RIPPLE_PUSH * localness * wobble;
        }
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;
        if (i === 0) ctx!.moveTo(px, py);
        else ctx!.lineTo(px, py);
      }
      ctx!.closePath();
      ctx!.fill();

      // Small balls — elastic bounce off the blob (treated as a circle
      // at cx,cy with radius big.r). Each collision pushes a ripple at
      // the impact angle so the blob wobbles locally at the hit point.
      // Tighter shadow than the blob — each ball feels like it floats
      // just above the page.
      ctx!.shadowColor = "rgba(0, 0, 0, 0.18)";
      ctx!.shadowBlur = 6;
      ctx!.shadowOffsetX = 0;
      ctx!.shadowOffsetY = 2;
      for (const b of smalls) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < b.r || b.x > w - b.r) b.vx *= -1;
        if (b.y < b.r || b.y > h - b.r) b.vy *= -1;

        const dx = b.x - cx;
        const dy = b.y - cy;
        const minDist = big.r + b.r;
        const distSq = dx * dx + dy * dy;
        if (distSq < minDist * minDist && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const ny = dy / dist;
          // Push the ball out so it never sits inside the blob.
          b.x = cx + nx * minDist;
          b.y = cy + ny * minDist;
          // Reflect velocity along the surface normal (elastic).
          const vDotN = b.vx * nx + b.vy * ny;
          if (vDotN < 0) {
            b.vx -= 2 * vDotN * nx;
            b.vy -= 2 * vDotN * ny;
          }
          // Register a local wobble + kick the whole blob away from the
          // impact site (the spring will pull it back).
          ripples.push({ angle: Math.atan2(dy, dx), age: 0 });
          velX -= nx * IMPULSE;
          velY -= ny * IMPULSE;
        }

        // Per-ball radial gradient — highlight offset by (lx, ly), edge
        // tone unique to each ball. Gives the cloud subtle variety.
        const gradient = ctx!.createRadialGradient(
          b.x + b.r * b.lx,
          b.y + b.r * b.ly,
          0,
          b.x,
          b.y,
          b.r * 1.2,
        );
        gradient.addColorStop(0, `hsl(0, 0%, ${Math.min(b.tone + 14, 96)}%)`);
        gradient.addColorStop(1, `hsl(0, 0%, ${b.tone}%)`);
        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Reset shadow so clearRect on the next frame stays cheap.
      ctx!.shadowBlur = 0;
      ctx!.shadowOffsetY = 0;

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
