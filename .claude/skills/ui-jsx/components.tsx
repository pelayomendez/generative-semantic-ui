import React from "react";
import { dispatchAction } from "./actions";

// Semantic component registry. Swap implementations to adapt to any UI lib.
// The LLM only knows the names and prop signatures below.

type Children = { children?: React.ReactNode };

export const Stack = ({ gap = 2, children }: { gap?: number } & Children) => (
  <div style={{ display: "flex", flexDirection: "column", gap: gap * 4 }}>
    {children}
  </div>
);

export const Row = ({ gap = 2, children }: { gap?: number } & Children) => (
  <div style={{ display: "flex", flexDirection: "row", gap: gap * 4 }}>
    {children}
  </div>
);

export const Box = ({ padding = 0, children }: { padding?: number } & Children) => (
  <div style={{ padding: padding * 4 }}>{children}</div>
);

export const Text = ({ children }: Children) => <span>{children}</span>;

export const Heading = ({ level = 2, children }: { level?: 1 | 2 | 3 | 4 } & Children) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag>{children}</Tag>;
};

export const Button = ({ onClick, children }: { onClick: string } & Children) => (
  <button onClick={() => dispatchAction(onClick)}>{children}</button>
);

export const Input = ({
  name,
  placeholder,
  type = "text",
}: {
  name: string;
  placeholder?: string;
  type?: string;
}) => <input name={name} placeholder={placeholder} type={type} />;

export const Image = ({ src, alt = "" }: { src: string; alt?: string }) => (
  <img src={src} alt={alt} />
);

export const Divider = () => <hr />;

// The registry the compiler uses to resolve tag names.
export const registry = {
  Stack,
  Row,
  Box,
  Text,
  Heading,
  Button,
  Input,
  Image,
  Divider,
} as const;

export type ComponentName = keyof typeof registry;
