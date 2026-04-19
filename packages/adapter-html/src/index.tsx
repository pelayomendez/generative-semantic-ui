import type { CSSProperties, ReactNode } from "react";
import { dispatchAction, type Registry } from "@generative-semantic-ui/core";

// Plain-HTML adapter. Zero CSS framework required. Inline styles only.
// Gap/padding units follow a 4px scale to match common design-system conventions.

const UNIT = 4;
const scale = (n: number) => n * UNIT;

type Children = { children?: ReactNode };

const base: CSSProperties = { boxSizing: "border-box" };

export const Stack = ({ gap = 2, children }: { gap?: number } & Children) => (
  <div style={{ ...base, display: "flex", flexDirection: "column", gap: scale(gap) }}>
    {children}
  </div>
);

export const Row = ({ gap = 2, children }: { gap?: number } & Children) => (
  <div style={{ ...base, display: "flex", flexDirection: "row", gap: scale(gap) }}>
    {children}
  </div>
);

export const Box = ({ padding = 0, children }: { padding?: number } & Children) => (
  <div style={{ ...base, padding: scale(padding) }}>{children}</div>
);

export const Text = ({ children }: Children) => <span>{children}</span>;

export const Heading = ({
  level = 2,
  children,
}: { level?: 1 | 2 | 3 | 4 } & Children) => {
  const sizes: Record<number, string> = {
    1: "1.875rem",
    2: "1.5rem",
    3: "1.25rem",
    4: "1.125rem",
  };
  const style: CSSProperties = {
    fontSize: sizes[level],
    fontWeight: 600,
    lineHeight: 1.2,
    margin: 0,
  };
  if (level === 1) return <h1 style={style}>{children}</h1>;
  if (level === 2) return <h2 style={style}>{children}</h2>;
  if (level === 3) return <h3 style={style}>{children}</h3>;
  return <h4 style={style}>{children}</h4>;
};

export const Button = ({
  onClick,
  children,
}: { onClick: string } & Children) => (
  <button
    type="button"
    onClick={() => dispatchAction(onClick)}
    style={{
      ...base,
      height: 36,
      padding: "0 16px",
      borderRadius: 6,
      border: "1px solid #111",
      background: "#111",
      color: "#fff",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
    }}
  >
    {children}
  </button>
);

export const Input = ({
  name,
  placeholder,
  type = "text",
}: {
  name: string;
  placeholder?: string;
  type?: string;
}) => (
  <input
    name={name}
    placeholder={placeholder}
    type={type}
    style={{
      ...base,
      height: 36,
      padding: "0 12px",
      borderRadius: 6,
      border: "1px solid #d4d4d8",
      fontSize: 14,
      width: "100%",
    }}
  />
);

export const Image = ({ src, alt = "" }: { src: string; alt?: string }) => (
  <img src={src} alt={alt} style={{ maxWidth: "100%", height: "auto" }} />
);

export const Divider = () => (
  <hr style={{ border: 0, borderTop: "1px solid #e4e4e7", margin: "8px 0" }} />
);

export const registry: Registry = {
  Stack,
  Row,
  Box,
  Text,
  Heading,
  Button,
  Input,
  Image,
  Divider,
};
