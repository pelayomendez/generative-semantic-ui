import { useState, type ReactNode, type ComponentType } from "react";
import { compile, registerAction, type Registry } from "@generative-semantic-ui/core";
import { registry as shadcnRegistry } from "@generative-semantic-ui/shadcn";
import { registry as htmlRegistry } from "@generative-semantic-ui/html";
import { FIXTURES } from "./fixtures";
import * as Generated from "./components/generated";

registerAction("login", () => console.log("login fired"));
registerAction("save", () => console.log("save fired"));
registerAction("cancel", () => console.log("cancel fired"));
registerAction("searchFlights", () => console.log("searchFlights fired"));
registerAction("cancelBooking", () => console.log("cancelBooking fired"));
registerAction("saveProfile", () => console.log("saveProfile fired"));
registerAction("cancelProfile", () => console.log("cancelProfile fired"));

type FixtureKey = keyof typeof FIXTURES;
type Mode = "runtime" | "generated";
type AdapterName = "shadcn" | "html";

const GENERATED: Record<FixtureKey, ComponentType> = {
  login: Generated.Login,
  settings: Generated.Settings,
  flight: Generated.Flight,
  profile: Generated.Profile,
};

const ADAPTERS: Record<AdapterName, Registry> = {
  shadcn: shadcnRegistry,
  html: htmlRegistry,
};

const App = () => {
  const [key, setKey] = useState<FixtureKey>("login");
  const [mode, setMode] = useState<Mode>("runtime");
  const [adapter, setAdapter] = useState<AdapterName>("shadcn");

  let rendered: ReactNode = null;
  let error: string | null = null;

  if (mode === "runtime") {
    try {
      rendered = compile(FIXTURES[key], ADAPTERS[adapter]);
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  } else {
    const Component = GENERATED[key];
    rendered = <Component />;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Generative Semantic UI</h1>
        <p className="text-sm text-muted-foreground">
          It's like HTML for AI agents. Same semantic JSX → different adapter → different render.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {Object.keys(FIXTURES).map((k) => (
            <button
              key={k}
              onClick={() => setKey(k as FixtureKey)}
              className={`px-3 py-1 border rounded ${k === key ? "bg-primary text-primary-foreground" : ""}`}
            >
              {k}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-md border p-1">
          {(["runtime", "generated"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded text-sm ${m === mode ? "bg-primary text-primary-foreground" : ""}`}
            >
              {m}
            </button>
          ))}
        </div>
        {mode === "runtime" && (
          <div className="flex gap-1 rounded-md border p-1">
            {(["shadcn", "html"] as AdapterName[]).map((a) => (
              <button
                key={a}
                onClick={() => setAdapter(a)}
                className={`px-3 py-1 rounded text-sm ${a === adapter ? "bg-primary text-primary-foreground" : ""}`}
              >
                {a}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border rounded p-6">
        {error ? <pre className="text-red-600 whitespace-pre-wrap">{error}</pre> : rendered}
      </div>

      <details>
        <summary className="cursor-pointer text-sm text-muted-foreground">
          {mode === "runtime"
            ? `Source JSX (compiled with @generative-semantic-ui/${adapter})`
            : "Generated component source"}
        </summary>
        <pre className="text-xs bg-muted p-3 mt-2 rounded overflow-x-auto">
          {mode === "runtime"
            ? FIXTURES[key]
            : `// See src/components/generated/${key.charAt(0).toUpperCase() + key.slice(1)}.tsx`}
        </pre>
      </details>
    </div>
  );
};

export default App;
