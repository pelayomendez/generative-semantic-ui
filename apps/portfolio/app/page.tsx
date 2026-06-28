"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import {
  compile,
  registerAction,
  unregisterAction,
} from "@generative-semantic-ui/core";
import { portfolioRegistry } from "@/lib/adapter/registry";
import { portfolio } from "@/lib/data/portfolio";
import { Backdrop } from "@/lib/Backdrop";

const SUGGESTIONS = [
  "Introduce yourself",
  "Show me your selected work",
  "Tell me about Mugaritz: OFF-ROAD",
  "What are you working on now?",
  "How do I get in touch?",
];

type Answer = {
  jsx: string;
  element: ReactNode | null;
  error: string | null;
  truncated: boolean;
};

type Current = {
  question: string;
  answer: Answer | null;
};

export default function Page() {
  const [draft, setDraft] = useState("");
  // The chain of question/answer steps taken since landing. Card-driven
  // `ask` follow-ups and typed questions both append here, so the trail
  // is the path the visitor navigated. The deepest entry is on screen.
  const [history, setHistory] = useState<Current[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const reqIdRef = useRef(0);
  const constraintsRef = useRef<HTMLElement>(null);
  const dragControls = useDragControls();

  const hasStarted = history.length > 0;
  const current = history.length > 0 ? history[history.length - 1] : null;

  // Drag is started manually only when the user grabs an empty area / the grip
  // (NOT when they click into the textarea or the send button).
  function maybeStartDrag(e: PointerEvent<HTMLFormElement>) {
    const target = e.target as HTMLElement;
    if (target.closest("textarea, button")) return;
    dragControls.start(e);
  }

  async function ask(prompt: string) {
    const text = prompt.trim();
    if (!text || loading) return;
    const id = ++reqIdRef.current;
    setError(null);
    setDraft("");
    setHistory((h) => [...h, { question: text, answer: null }]);
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      if (reqIdRef.current !== id) return; // a reset or newer question superseded this
      if (!res.ok) {
        setError(data.error ?? `HTTP ${res.status}`);
        return;
      }
      const jsx = data.jsx as string;
      const truncated = Boolean(data.truncated);
      let element: ReactNode | null = null;
      let compileError: string | null = null;
      try {
        element = compile(jsx, portfolioRegistry);
      } catch (e) {
        compileError = e instanceof Error ? e.message : String(e);
        console.error("[portfolio] compile failed", { error: compileError, jsx });
      }
      if (truncated) {
        console.warn("[portfolio] response truncated", { reason: data.reason, jsx });
      }
      setHistory((h) => {
        const next = [...h];
        next[next.length - 1] = {
          question: text,
          answer: { jsx, element, error: compileError, truncated },
        };
        return next;
      });
    } catch (e) {
      if (reqIdRef.current !== id) return;
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      if (reqIdRef.current === id) {
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
  }

  // Reset the portfolio to its initial landing state (clicking the name/title).
  function reset() {
    reqIdRef.current++; // invalidate any in-flight request so it can't repopulate
    setHistory([]);
    setDraft("");
    setError(null);
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  // Jump back to a prior step in the trail: truncate the history to that
  // entry (dropping everything navigated after it) and put it back on
  // screen. Asking again from there extends the trail anew.
  function goTo(index: number) {
    reqIdRef.current++; // invalidate any in-flight request
    setError(null);
    setLoading(false);
    setHistory((h) => h.slice(0, index + 1));
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(draft);
  }

  // Re-ask the current (failed/truncated) step in place: drop the stale
  // entry first so the retry replaces it instead of extending the trail.
  function retry() {
    const q = current?.question;
    if (!q) return;
    setHistory((h) => h.slice(0, -1));
    ask(q);
  }

  // Generated cards/buttons emit `onClick="ask"` with a literal `prompt`
  // payload. Register one `ask` action that funnels that prompt back into
  // the chat, so clicking a card navigates to its follow-up answer. A ref
  // keeps the handler pointing at the latest `ask` without re-registering.
  const askRef = useRef(ask);
  askRef.current = ask;
  useEffect(() => {
    registerAction("ask", (payload) => {
      if (typeof payload === "string") askRef.current(payload);
    });
    return () => unregisterAction("ask");
  }, []);

  return (
    <main ref={constraintsRef} className="relative min-h-dvh">
      <Backdrop />

      {/* Brand bar */}
      <header className="relative z-20 mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_hsl(var(--accent))]" />
          <button
            type="button"
            onClick={reset}
            className="font-medium tracking-tight transition hover:text-accent"
            aria-label="Back to start"
          >
            {portfolio.profile.name}
          </button>
          <span className="hidden text-muted-foreground sm:inline">
            · {portfolio.profile.headline}
          </span>
        </div>
        <nav className="flex items-center gap-3 text-xs text-muted-foreground">
          <a className="hover:text-foreground" href={portfolio.contact.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="hover:text-foreground" href={portfolio.contact.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </nav>
      </header>

      {/* Landing intro — pinned to upper area so it doesn't overlap the
          centered input below it. pointer-events-none so it never blocks
          drag interactions from the input behind. */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none fixed inset-x-0 top-20 z-10 mx-auto max-w-2xl px-6 sm:top-24"
          >
            <Intro />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conversation — only when chat has started. Ample bottom padding so
          long answers never crowd the docked input. */}
      <AnimatePresence mode="wait" initial={false}>
        {hasStarted && (
          <motion.section
            key="conversation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 mx-auto max-w-3xl px-6 pb-64 pt-4"
          >
            {/* Breadcrumb trail — only once the visitor has drilled past the
                first answer. `Home` resets; any prior step returns to it. */}
            {history.length > 1 && (
              <Breadcrumbs
                steps={history.map((h) => h.question)}
                onHome={reset}
                onSelect={goTo}
              />
            )}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={history.length}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <p className="text-xs italic text-muted-foreground/80">
                  › {current!.question}
                </p>
                {!current!.answer ? (
                  <Thinking />
                ) : current!.answer.error || current!.answer.truncated ? (
                  <IncompleteAnswer onRetry={retry} disabled={loading} />
                ) : (
                  current!.answer.element
                )}
              </motion.div>
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Bottom fade — softens long content as it approaches the input. */}
      {hasStarted && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-t from-background via-background/85 to-transparent"
        />
      )}

      {/* Always-mounted, draggable chat input. Centered via auto margins
          (no CSS transforms) so Framer's drag transform is the *only*
          transform on the element — no fight between `layout` + Tailwind
          translates. Position swaps on hasStarted via className. */}
      <motion.form
        drag
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={false}
        dragConstraints={{ top: -200, bottom: 80, left: -240, right: 240 }}
        dragElastic={0.05}
        whileDrag={{ scale: 1.015 }}
        onPointerDown={maybeStartDrag}
        onSubmit={onSubmit}
        className={
          hasStarted
            ? "fixed inset-x-0 bottom-6 z-30 mx-auto w-full max-w-2xl cursor-grab px-6 active:cursor-grabbing"
            : "fixed inset-x-0 bottom-24 z-30 mx-auto h-fit w-full max-w-2xl cursor-grab px-6 active:cursor-grabbing"
        }
      >
        {/* Grip handle — visual cue that the form is draggable */}
        <div className="mb-1.5 flex justify-center">
          <span
            aria-hidden
            className="h-1 w-10 rounded-full bg-foreground/15 transition-colors group-hover:bg-foreground/30"
          />
        </div>

        <ChatInput
          ref={inputRef}
          value={draft}
          onChange={setDraft}
          onSubmit={() => ask(draft)}
          loading={loading}
          placeholder={hasStarted ? "Ask another question…" : "Ask me anything…"}
          autoFocus
        />
        {error && (
          <p className="mt-2 text-center text-xs text-red-500">{error}</p>
        )}
        <p className="mt-2 select-none text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          Drag the box · powered by Mistral · @generative-semantic-ui
        </p>

        {/* Suggestion chips — sit directly below the input on landing,
            scoped inside the form so they auto-center as a group. */}
        <AnimatePresence>
          {!hasStarted && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-4 flex flex-wrap justify-center gap-2"
            >
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  disabled={loading}
                  className="rounded-full border border-border bg-background/60 px-3.5 py-1.5 text-xs text-foreground/70 backdrop-blur-sm transition hover:border-foreground/40 hover:text-foreground disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </main>
  );
}

/* ---------------- Breadcrumb trail ---------------- */

function Breadcrumbs({
  steps,
  onHome,
  onSelect,
}: {
  steps: string[];
  onHome: () => void;
  onSelect: (index: number) => void;
}) {
  const lastIndex = steps.length - 1;
  return (
    <motion.nav
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      aria-label="Trail"
      className="mb-5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground"
    >
      <button
        type="button"
        onClick={onHome}
        className="shrink-0 transition hover:text-accent"
      >
        Home
      </button>
      {steps.map((step, i) => {
        const isCurrent = i === lastIndex;
        return (
          <span key={i} className="flex min-w-0 items-center gap-x-1.5">
            <span aria-hidden className="text-muted-foreground/50">
              ›
            </span>
            {isCurrent ? (
              <span
                aria-current="step"
                title={step}
                className="max-w-[16rem] truncate text-foreground/80"
              >
                {step}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onSelect(i)}
                title={step}
                className="max-w-[12rem] truncate transition hover:text-foreground"
              >
                {step}
              </button>
            )}
          </span>
        );
      })}
    </motion.nav>
  );
}

/* ---------------- Landing intro ---------------- */

function Intro() {
  return (
    <div className="flex flex-col">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent"
      >
        A portfolio that builds itself
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl"
      >
        Hi, I'm {portfolio.profile.name.split(" ")[0]}.
      </motion.h1>
    </div>
  );
}

/* ---------------- Thinking indicator ---------------- */

function Thinking() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      Composing the answer…
    </motion.div>
  );
}

/* ---------------- Incomplete-answer fallback ---------------- */

function IncompleteAnswer({
  onRetry,
  disabled,
}: {
  onRetry: () => void;
  disabled: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border bg-background/60 p-5 backdrop-blur-sm"
    >
      <p className="text-sm text-foreground/80">
        That answer came back incomplete. The model ran out of room mid-thought —
        try again, or ask a shorter question.
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={disabled}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs text-foreground/80 transition hover:border-foreground/40 hover:text-foreground disabled:opacity-50"
      >
        Try again
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </motion.div>
  );
}

/* ---------------- Chat input ---------------- */

const ChatInput = forwardRef<
  HTMLTextAreaElement,
  {
    value: string;
    onChange: (v: string) => void;
    onSubmit: () => void;
    loading: boolean;
    placeholder?: string;
    autoFocus?: boolean;
  }
>(function ChatInput(
  { value, onChange, onSubmit, loading, placeholder, autoFocus },
  ref,
) {
  return (
    <div className="group relative flex items-end gap-2 rounded-3xl border border-border bg-background/85 p-2 pl-5 shadow-xl backdrop-blur-md transition focus-within:border-foreground/40">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        rows={1}
        autoFocus={autoFocus}
        placeholder={placeholder ?? "Ask another question…"}
        className="flex-1 resize-none bg-transparent py-2.5 text-base outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background shadow-md transition hover:scale-105 disabled:scale-100 disabled:opacity-40"
        aria-label="Send"
      >
        {loading ? (
          <span className="block h-3 w-3 animate-spin rounded-full border-2 border-background/30 border-t-background" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12L19 12M19 12L13 6M19 12L13 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
});
