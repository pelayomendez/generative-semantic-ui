import * as THREE from "three";
import type { WorldPalette } from "./types";

export { DEFAULT_PALETTE } from "./palette";

/** Resources shared by every object in one world instance. */
export interface Shared {
  dot: THREE.Texture;
  glow: THREE.Texture;
  colors: Record<keyof WorldPalette, THREE.Color>;
  reducedMotion: boolean;
}

function radialTexture(size: number, stops: Array<[number, number]>) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [at, alpha] of stops) g.addColorStop(at, `rgba(255,255,255,${alpha})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createShared(palette: WorldPalette, reducedMotion: boolean): Shared {
  return {
    // Crisp point with a soft rim — reads as a lit neuron, not a square pixel.
    dot: radialTexture(64, [
      [0, 1],
      [0.35, 0.9],
      [0.55, 0.25],
      [1, 0],
    ]),
    // Gaussian falloff for halos and pulses: many stops so the edge has
    // no visible rings or hard rim once bloom amplifies it.
    glow: radialTexture(
      256,
      Array.from({ length: 17 }, (_, i): [number, number] => {
        const x = i / 16;
        return [x, Math.exp(-x * x * 9) * (1 - x)];
      }),
    ),
    colors: {
      background: new THREE.Color(palette.background),
      node: new THREE.Color(palette.node),
      line: new THREE.Color(palette.line),
      accent: new THREE.Color(palette.accent),
    },
    reducedMotion,
  };
}

/** Frame-rate independent exponential approach of `value` towards `target`. */
export function approach(value: number, target: number, dt: number, rate: number) {
  return target + (value - target) * Math.exp(-rate * dt);
}

export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function disposeObject(root: THREE.Object3D) {
  root.traverse((obj) => {
    const o = obj as THREE.Mesh;
    o.geometry?.dispose();
    const m = o.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(m)) m.forEach((x) => x.dispose());
    else m?.dispose();
  });
}
