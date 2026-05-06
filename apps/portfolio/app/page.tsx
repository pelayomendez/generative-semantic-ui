"use client";

import { forwardRef, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { compile } from "@generative-semantic-ui/core";
import { portfolioRegistry } from "@/lib/adapter/registry";
import { portfolio } from "@/lib/data/portfolio";

const SUGGESTIONS = [
  "Introduce yourself",
  "Show me your selected work",
  "What are you working on now?",
  "What's your background?",
  "How do I get in touch?",
];

type Turn =
  | { role: "user"; text: string }
  | { role: "assistant"; jsx: string; element: ReactNode | null; error: string | null };

export default function Page() {
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasStarted = turns.length > 0 || loading;

  // Auto-scroll on new turn
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns.length, loading]);

  async function ask(prompt: string) {
    const text = prompt.trim();
    if (!text || loading) return;
    setError(null);
    setInput("");
    setTurns((t) => [...t, { role: "user", text }]);
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
      setTurns((t) => [
        ...t,
        { role: "assistant", jsx, element, error: compileError },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(input);
  }

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <div aria-hidden className="gsui-backdrop fixed inset-0 -z-10" />

      {/* Top brand bar */}
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
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

      {/* Conversation area */}
      <div
        ref={scrollRef}
        className="relative z-0 mx-auto max-w-3xl overflow-y-auto px-6 pb-48"
        style={{ maxHeight: "calc(100dvh - 80px)" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {!hasStarted ? (
            <Landing key="landing" onAsk={ask} loading={loading} />
          ) : (
            <motion.div
              key="conversation"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-12 pt-8"
            >
              {turns.map((t, i) => (
                <TurnView key={i} turn={t} />
              ))}
              {loading && <Thinking />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating chat input (hidden on landing — landing has its own) */}
      {hasStarted && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={onSubmit}
          className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-3xl px-6 pb-6"
        >
          <ChatInput
            ref={inputRef}
            value={input}
            onChange={setInput}
            onSubmit={() => ask(input)}
            loading={loading}
          />
          {error && (
            <p className="mt-2 text-center text-xs text-red-500">{error}</p>
          )}
          <p className="mt-2 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
            Generated UI · powered by Mistral · vocabulary by @generative-semantic-ui
          </p>
        </motion.form>
      )}
    </main>
  );
}

/* ---------------- Landing ---------------- */

function Landing({ onAsk, loading }: { onAsk: (q: string) => void; loading: boolean }) {
  const [draft, setDraft] = useState("");
  return (
    <motion.div
      key="landing-inner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.6 }}
      className="mx-auto flex min-h-[calc(100dvh-80px)] max-w-2xl flex-col justify-center py-12"
    >
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
        className="mt-4 font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl"
      >
        Hi, I'm {portfolio.profile.name.split(" ")[0]}.
        <br />
        <span className="text-muted-foreground">Ask me anything.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-6 max-w-xl text-base leading-relaxed text-foreground/70"
      >
        Type a question and the page renders the answer — no fixed pages, no
        layouts. The UI is generated live from a constrained vocabulary I built
        for language models.
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        onSubmit={(e) => {
          e.preventDefault();
          onAsk(draft);
        }}
        className="mt-10"
      >
        <ChatInput
          value={draft}
          onChange={setDraft}
          onSubmit={() => onAsk(draft)}
          loading={loading}
          placeholder="e.g. what kind of work do you do?"
          autoFocus
        />
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.65 }}
        className="mt-6 flex flex-wrap gap-2"
      >
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onAsk(s)}
            disabled={loading}
            className="rounded-full border border-border bg-background/40 px-3.5 py-1.5 text-xs text-foreground/70 backdrop-blur-sm transition hover:border-foreground/40 hover:text-foreground disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Turn view ---------------- */

function TurnView({ turn }: { turn: Turn }) {
  if (turn.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-end"
      >
        <div className="rounded-2xl rounded-br-md bg-foreground px-4 py-2.5 text-sm text-background shadow-sm">
          {turn.text}
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-3"
    >
      {turn.error ? (
        <div className="rounded-lg border border-red-300/50 bg-red-50 p-4 text-xs text-red-700 dark:bg-red-950/30 dark:text-red-300">
          <p className="font-medium">Failed to render generated JSX</p>
          <p className="mt-1 font-mono text-[11px] opacity-80">{turn.error}</p>
          <pre className="mt-2 overflow-x-auto text-[10px] opacity-70">{turn.jsx}</pre>
        </div>
      ) : (
        turn.element
      )}
    </motion.div>
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
>(function ChatInput({ value, onChange, onSubmit, loading, placeholder, autoFocus }, ref) {
  return (
    <div className="group relative flex items-end gap-2 rounded-3xl border border-border bg-background/80 p-2 pl-5 shadow-lg backdrop-blur-md transition focus-within:border-foreground/40">
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
        onClick={(e) => {
          e.preventDefault();
          onSubmit();
        }}
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
