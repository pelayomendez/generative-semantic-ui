import React from "react";
import { dispatchAction, type Registry } from "@generative-semantic-ui/core";
import { ButtonPrimitive, InputPrimitive } from "./primitives";

// shadcn/ui-style adapter. Self-contained: ships the Button and Input
// primitives bundled (built on Radix + cva). Requires Tailwind and the
// design-token CSS — import `@generative-semantic-ui/shadcn/styles.css` once.

type Children = { children?: React.ReactNode };

export const Stack = ({ gap = 2, children }: { gap?: number } & Children) => (
  <div className={`flex flex-col gap-${gap}`}>{children}</div>
);

export const Row = ({ gap = 2, children }: { gap?: number } & Children) => (
  <div className={`flex flex-row gap-${gap}`}>{children}</div>
);

export const Box = ({ padding = 0, children }: { padding?: number } & Children) => (
  <div className={`p-${padding}`}>{children}</div>
);

export const Text = ({ children }: Children) => <span>{children}</span>;

export const Heading = ({
  level = 2,
  children,
}: { level?: 1 | 2 | 3 | 4 } & Children) => {
  const sizes: Record<number, string> = {
    1: "text-3xl",
    2: "text-2xl",
    3: "text-xl",
    4: "text-lg",
  };
  const className = `${sizes[level]} font-semibold`;
  if (level === 1) return <h1 className={className}>{children}</h1>;
  if (level === 2) return <h2 className={className}>{children}</h2>;
  if (level === 3) return <h3 className={className}>{children}</h3>;
  return <h4 className={className}>{children}</h4>;
};

export const Button = ({
  onClick,
  children,
}: { onClick: string } & Children) => (
  <ButtonPrimitive onClick={() => dispatchAction(onClick)}>{children}</ButtonPrimitive>
);

export const Input = ({
  name,
  placeholder,
  type = "text",
}: {
  name: string;
  placeholder?: string;
  type?: string;
}) => <InputPrimitive name={name} placeholder={placeholder} type={type} />;

export const Image = ({ src, alt = "" }: { src: string; alt?: string }) => (
  <img src={src} alt={alt} />
);

export const Divider = () => <hr className="my-2 border-t" />;

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

export { ButtonPrimitive, InputPrimitive } from "./primitives";
