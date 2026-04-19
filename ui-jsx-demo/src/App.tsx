import { useState, type ReactNode } from "react";
import { compile } from "./ui-jsx/compile";
import { registerAction } from "./ui-jsx/actions";
import { FIXTURES } from "./fixtures";

// Register some demo actions
registerAction("login", () => console.log("login fired"));
registerAction("save", () => console.log("save fired"));
registerAction("cancel", () => console.log("cancel fired"));
registerAction("apply", () => console.log("apply fired"));
registerAction("saveProfile", () => console.log("saveProfile fired"));
registerAction("cancelProfile", () => console.log("cancelProfile fired"));

type FixtureKey = keyof typeof FIXTURES;

const App = () => {
  const [key, setKey] = useState<FixtureKey>("login");
  let rendered: ReactNode = null;
  let error: string | null = null;

  try {
    rendered = compile(FIXTURES[key]);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
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
      <div className="border rounded p-6">
        {error ? <pre className="text-red-600 whitespace-pre-wrap">{error}</pre> : rendered}
      </div>
      <details>
        <summary className="cursor-pointer text-sm text-muted-foreground">Source JSX</summary>
        <pre className="text-xs bg-muted p-3 mt-2 rounded overflow-x-auto">{FIXTURES[key]}</pre>
      </details>
    </div>
  );
};

export default App;
