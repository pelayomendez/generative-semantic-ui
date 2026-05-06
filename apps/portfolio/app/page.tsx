"use client";

import {
  forwardRef,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { compile } from "@generative-semantic-ui/core";
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
};

type Current = {
  question: string;
  answer: Answer | null;
};

export default function Page() {
  const [draft, setDraft] = useState("");
  const [current, setCurrent] = useState<Current | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const constraintsRef = useRef<HTMLElement>(null);
  const dragControls = useDragControls();

  const hasStarted = current !== null;

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
    setError(null);
    setDraft("");
    setCurrent({ question: text, answer: null });
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? `HTTP ${res.status}`);
        return;
      }
      const jsx = data.jsx as string;
      let element: ReactNode | null = null;
      let compileError: string | null = null;
      try {
        element = compile(jsx, portfolioRegistry);
      } catch (e) {
        compileError = e instanceof Error ? e.message : String(e);
      }
      setCurrent({
        question: text,
        answer: { jsx, element, error: compileError },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(draft);
  }

  return (
    <main ref={constraintsRef} className="relative min-h-dvh">
      <Backdrop />

      {/* Brand bar */}
      <header className="relative z-20 mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_hsl(var(--accent))]" />
          <span className="font-medium tracking-tight">{portfolio.profile.name}</span>
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
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current!.question}
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
                ) : current!.answer.error ? (
                  <div className="rounded-lg border border-red-300/50 bg-red-50 p-4 text-xs text-red-700">
                    <p className="font-medium">Failed to render generated JSX</p>
                    <p className="mt-1 font-mono text-[11px] opacity-80">
                      {current!.answer.error}
                    </p>
                    <pre className="mt-2 overflow-x-auto text-[10px] opacity-70">
                      {current!.answer.jsx}
                    </pre>
                  </div>
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

      {/* Always-mounted, draggable chat input. Anchor changes between
          centered (landing) and bottom-docked (chat) — Framer's `layout`
          prop animates the move. Drag works on top of that anchor. */}
      <motion.form
        layout
        drag
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        dragElastic={0.05}
        whileDrag={{ scale: 1.015 }}
        onPointerDown={maybeStartDrag}
        onSubmit={onSubmit}
        transition={{ layout: { type: "spring", stiffness: 260, damping: 32 } }}
        className={
          hasStarted
            ? "fixed bottom-6 left-1/2 z-30 w-full max-w-2xl -translate-x-1/2 cursor-grab px-6 active:cursor-grabbing"
            : "fixed left-1/2 top-[58%] z-30 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 cursor-grab px-6 active:cursor-grabbing"
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
      </motion.form>

      {/* Suggestion chips — sit just below the centered input on landing. */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="fixed inset-x-0 top-[76%] z-10 mx-auto max-w-2xl px-6"
          >
            <div className="flex flex-wrap justify-center gap-2">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
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
        <br />
        <span className="text-muted-foreground">Ask me anything.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/70 sm:text-base"
      >
        Type a question and the page renders the answer — no fixed pages, no
        layouts. The UI is generated live from a constrained vocabulary I built
        for language models.
      </motion.p>
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
