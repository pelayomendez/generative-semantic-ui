// Generative world backdrop: a three.js scene that grows one region per
// navigation step and flies the camera along the visitor's path.
//
// Self-contained on purpose — nothing in here imports from the portfolio,
// so it can be lifted into its own package (e.g. as an interactive
// background for @generative-semantic-ui hosts) without changes.
//
//   engine.ts         framework-agnostic: createWorld(canvas, options) → World
//   WorldBackdrop.tsx thin React binding (declarative path + pending)

export { WorldBackdrop } from "./WorldBackdrop";
export { DEFAULT_PALETTE } from "./palette";
export type { World, WorldOptions, WorldPalette } from "./types";
