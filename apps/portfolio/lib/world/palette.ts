import type { WorldPalette } from "./types";

// Kept apart from three.js so importing it doesn't pull the engine into
// the host's main bundle.
export const DEFAULT_PALETTE: WorldPalette = {
  background: "#06070a",
  node: "#e9eaef",
  line: "#7d8496",
  accent: "#ff3b30",
};
