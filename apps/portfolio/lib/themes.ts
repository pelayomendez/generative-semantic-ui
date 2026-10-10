"use client";

import { useEffect, useState } from "react";
import type { WorldPalette } from "@/lib/world";

// Colour themes for the world look. Each sets one highlight colour that
// drives both the UI accent (globals.css via [data-theme]) and the 3D
// world palette. Fonts are shared: Inter + JetBrains Mono.

export interface Theme {
  id: string;
  label: string;
  world: WorldPalette;
}

export const THEMES: Theme[] = [
  {
    id: "signal",
    label: "Signal",
    world: { background: "#06070a", node: "#e9eaef", line: "#7d8496", accent: "#ff3b30" },
  },
  {
    id: "ion",
    label: "Ion",
    world: { background: "#04070b", node: "#e6f4ff", line: "#6f8aa3", accent: "#38d9ff" },
  },
  {
    id: "aurum",
    label: "Aurum",
    world: { background: "#080706", node: "#f3eee6", line: "#8c8170", accent: "#ffb547" },
  },
  {
    id: "ultraviolet",
    label: "Ultraviolet",
    world: { background: "#06050b", node: "#eeeaff", line: "#7c7896", accent: "#a78bfa" },
  },
];

/** Active theme: `?theme=<id>` if given, otherwise a random pick per visit. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(THEMES[0]);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("theme");
    setTheme(
      THEMES.find((t) => t.id === id) ?? THEMES[Math.floor(Math.random() * THEMES.length)],
    );
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme.id;
  }, [theme]);

  return [theme, setTheme] as const;
}
