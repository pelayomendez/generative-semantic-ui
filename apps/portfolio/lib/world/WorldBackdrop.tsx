"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { World, WorldOptions } from "./types";

type Props = WorldOptions & {
  /** Step keys from home to the current step. See `World.setPath`. */
  path: readonly string[];
  pending?: boolean;
  /** Rendered instead when WebGL is unavailable. */
  fallback?: ReactNode;
  className?: string;
};

/**
 * React binding for the world engine. Declarative: pass the visitor's
 * path and pending flag; the engine grows the world and flies the camera.
 * three.js is code-split and loaded after first paint.
 */
export function WorldBackdrop({ path, pending = false, fallback = null, className, ...options }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<World | null>(null);
  const [failed, setFailed] = useState(false);

  // Latest props, read when the async engine finishes loading.
  const latest = useRef({ path, pending, options });
  latest.current = { path, pending, options };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    import("./engine")
      .then(({ createWorld }) => {
        if (cancelled) return;
        const world = createWorld(canvas, latest.current.options);
        world.setPath(latest.current.path);
        world.setPending(latest.current.pending);
        worldRef.current = world;
      })
      .catch((e) => {
        console.warn("[world] falling back — WebGL unavailable", e);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      worldRef.current?.dispose();
      worldRef.current = null;
    };
  }, []);

  const pathKey = path.join("␞");
  useEffect(() => {
    worldRef.current?.setPath(latest.current.path);
  }, [pathKey]);

  useEffect(() => {
    worldRef.current?.setPending(pending);
  }, [pending]);

  const paletteKey = JSON.stringify(options.palette ?? null);
  useEffect(() => {
    if (options.palette) worldRef.current?.setPalette(options.palette);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paletteKey]);

  if (failed) return <>{fallback}</>;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className ?? "pointer-events-none fixed inset-0 z-0 h-full w-full"}
    />
  );
}
