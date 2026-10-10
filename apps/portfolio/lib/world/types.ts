// Public contract of the world engine. Kept free of React and of any
// portfolio-specific types so the engine can move into a package later.

export interface WorldPalette {
  /** Clear colour + fog. The look is tuned for dark backgrounds (additive light). */
  background: string;
  /** Neuron points and inactive structure. */
  node: string;
  /** Plexus filaments and dim trails. */
  line: string;
  /** The current node and the active navigation path. */
  accent: string;
}

export interface WorldOptions {
  palette?: Partial<WorldPalette>;
  /** Cut camera flights and idle drift. Defaults to the OS preference. */
  reducedMotion?: boolean;
  /** Bloom post-processing. Off is cheaper; on is the intended look. */
  bloom?: boolean;
  /** Pointer parallax on the camera. */
  parallax?: boolean;
  /** Upper bound on the device pixel ratio. */
  maxPixelRatio?: number;
  /**
   * Where the focused node sits on screen, as a fraction of the viewport
   * from centre (x right, y up). Lets the host keep its UI column clear.
   */
  focusOffset?: { x: number; y: number };
}

export interface World {
  /**
   * Declarative navigation. `path` is the ordered list of step keys from
   * home to the current step (e.g. the questions asked). The engine diffs
   * it against the world: unseen steps grow new nodes, known ones are
   * revisited, the camera flies to the last step, and an empty path
   * returns home. Abandoned branches stay in the world, dimmed.
   */
  setPath(path: readonly string[]): void;
  /** The current step is waiting on content (e.g. an LLM call). */
  setPending(pending: boolean): void;
  setPalette(palette: Partial<WorldPalette>): void;
  dispose(): void;
}
