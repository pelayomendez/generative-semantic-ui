import type { ActionHandler } from "./types";

// Action dispatcher: maps string action names from LLM-generated JSX to real handlers.
// LLMs can't emit real function references, so onClick="save" gets looked up here.

const handlers = new Map<string, ActionHandler>();

export function registerAction(name: string, fn: ActionHandler): void {
  handlers.set(name, fn);
}

export function unregisterAction(name: string): void {
  handlers.delete(name);
}

export function dispatchAction(name: string, payload?: unknown): void {
  const fn = handlers.get(name);
  if (!fn) {
    // eslint-disable-next-line no-console
    console.warn(`[semantic-html-ai] No handler registered for action "${name}"`);
    return;
  }
  fn(payload);
}

/** Clears all registered actions. Useful in tests. */
export function resetActions(): void {
  handlers.clear();
}
