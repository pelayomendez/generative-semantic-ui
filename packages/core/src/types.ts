import type { ComponentType } from "react";

/**
 * A registry maps semantic component names (as emitted by the LLM) to the
 * actual React components that should render them. The keys are the public
 * vocabulary; the values are an adapter to your UI library (shadcn, MUI,
 * Chakra, HeadlessUI, plain HTML, anything).
 */
export type Registry = Record<string, ComponentType<any>>;

/** A string-named action, dispatched at click time. */
export type ActionHandler = (payload?: unknown) => void;
