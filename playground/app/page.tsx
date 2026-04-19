"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  compile,
  registerAction,
  resetActions,
  type Registry,
} from "@generative-semantic-ui/core";
import { registry as shadcnRegistry } from "@generative-semantic-ui/shadcn";
import { registry as htmlRegistry } from "@generative-semantic-ui/html";
import { EXAMPLES } from "@/lib/examples";

type AdapterName = "shadcn" | "html";

const ADAPTERS: Record<AdapterName, Registry> = {
  shadcn: shadcnRegistry,
  html: htmlRegistry,
};

const KEY_STORAGE = "gsui-playground-mistral-key";

export default function Page() {
  const [prompt, setPrompt] = useState<string>(EXAMPLES[0].prompt);
  const [jsx, setJsx] = useState<string>(EXAMPLES[0].jsx);
  const [adapter, setAdapter] = useState<AdapterName>("shadcn");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [showKey, setShowKey] = useState(false);
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(KEY_STORAGE) : null;
    if (stored) {
      setApiKey(stored);
      setKeySaved(true);
    }
  }, []);

  useEffect(() => {
    resetActions();
    const logger = (name: string) => () => {
      const entry = `${new Date().toLocaleTimeString()} — ${name} fired`;
      setActionLog((prev) => [entry, ...prev].slice(0, 20));
    };
    const seen = new Set<string>();
    const handlerNames = extractActionNames(jsx);
    for (const name of handlerNames) {
      if (seen.has(name)) continue;
      seen.add(name);
      registerAction(name, logger(name));
    }
  }, [jsx]);

  const rendered = useMemo<{ element: ReactNode; error: string | null }>(() => {
    try {
      return { element: compile(jsx, ADAPTERS[adapter]), error: null };
    } catch (e) {
      return { element: null, error: e instanceof Error ? e.message : String(e) };
    }
  }, [jsx, adapter]);

  async function generate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, userApiKey: apiKey || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setJsx(data.jsx);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  function saveKey() {
    if (apiKey.trim()) {
      localStorage.setItem(KEY_STORAGE, apiKey.trim());
    } else {
      localStorage.removeItem(KEY_STORAGE);
    }
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 1500);
  }

  function loadExample(i: number) {
    setPrompt(EXAMPLES[i].prompt);
    setJsx(EXAMPLES[i].jsx);
    setError(null);
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Generative Semantic UI</h1>
        <p className="text-lg text-muted-foreground">
          It&apos;s like HTML for AI agents. Type a prompt → the model emits semantic JSX → your
          adapter renders it.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <a
            className="underline hover:no-underline"
            href="https://github.com/pelayomendez/generative-semantic-ui"
          >
            GitHub
          </a>
          <a
            className="underline hover:no-underline"
            href="https://github.com/pelayomendez/generative-semantic-ui/blob/main/ARTICLE.md"
          >
            Read the article
          </a>
          <a
            className="underline hover:no-underline"
            href="https://www.npmjs.com/package/@generative-semantic-ui/core"
          >
            npm
          </a>
        </div>
      </header>

      <section className="space-y-3">
        <label className="block text-sm font-medium">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          placeholder="e.g. a material picker with color, roughness, metalness, apply button"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={generate}
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate"}
          </button>
          <div className="flex gap-1 rounded-md border p-1">
            {(["shadcn", "html"] as AdapterName[]).map((a) => (
              <button
                key={a}
                onClick={() => setAdapter(a)}
                className={`rounded px-3 py-1 text-sm ${
                  a === adapter ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            Adapter:{" "}
            <code>@generative-semantic-ui/{adapter}</code>
          </span>
        </div>

        <details className="text-sm">
          <summary className="cursor-pointer text-muted-foreground">
            Your Mistral API key (optional — unlimited use, never leaves your browser via localStorage)
          </summary>
          <div className="mt-3 space-y-2">
            <div className="flex gap-2">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your Mistral API key"
                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
              />
              <button
                onClick={() => setShowKey((v) => !v)}
                className="rounded-md border px-3 py-1 text-sm"
              >
                {showKey ? "hide" : "show"}
              </button>
              <button
                onClick={saveKey}
                className="rounded-md border px-3 py-1 text-sm"
              >
                {keySaved ? "saved ✓" : "save"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Without a key: shared demo key with a small per-IP rate limit.
              Get a free key from{" "}
              <a
                className="underline"
                href="https://console.mistral.ai/"
                target="_blank"
                rel="noreferrer"
              >
                console.mistral.ai
              </a>
              .
            </p>
          </div>
        </details>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Rendered output
          </h2>
          {error && <span className="text-xs text-destructive">{error}</span>}
        </div>
        <div className="min-h-[160px] rounded-lg border p-6">
          {rendered.error ? (
            <pre className="whitespace-pre-wrap text-sm text-destructive">{rendered.error}</pre>
          ) : (
            rendered.element
          )}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Source JSX
          </h2>
          <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-xs">{jsx}</pre>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Action log
          </h2>
          <div className="h-full min-h-[120px] rounded-lg border bg-muted p-4 text-xs">
            {actionLog.length === 0 ? (
              <span className="text-muted-foreground">
                Click a button in the rendered output above — actions appear here.
              </span>
            ) : (
              <ul className="space-y-1">
                {actionLog.map((line, i) => (
                  <li key={i} className="font-mono">
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Examples (no API call — precomputed)
        </h2>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => loadExample(i)}
              className="rounded-md border px-3 py-1 text-sm hover:bg-accent"
            >
              {ex.prompt}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function extractActionNames(jsx: string): string[] {
  const names: string[] = [];
  const re = /onClick="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(jsx))) names.push(m[1]);
  return names;
}
