// Action dispatcher: maps string action names from LLM-generated JSX to real handlers.

type Handler = (payload?: unknown) => void;

const handlers = new Map<string, Handler>();

export function registerAction(name: string, fn: Handler) {
  handlers.set(name, fn);
}

export function dispatchAction(name: string, payload?: unknown) {
  const fn = handlers.get(name);
  if (!fn) {
    console.warn(`[ui-jsx] No handler registered for action "${name}"`);
    return;
  }
  fn(payload);
}
