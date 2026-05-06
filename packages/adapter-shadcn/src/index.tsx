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
  <div className={`flex flex-row flex-wrap gap-${gap}`}>{children}</div>
);

export const Box = ({ padding = 0, children }: { padding?: number } & Children) => (
  <div className={`p-${padding}`}>{children}</div>
);

export const Text = ({ children }: Children) => <span>{children}</span>;

export const Paragraph = ({ children }: Children) => (
  <p className="text-base leading-relaxed text-foreground/80">{children}</p>
);

export const Heading = ({
  level = 2,
  children,
}: { level?: 1 | 2 | 3 | 4 } & Children) => {
  const sizes: Record<number, string> = {
    1: "text-4xl",
    2: "text-2xl",
    3: "text-xl",
    4: "text-lg",
  };
  const className = `${sizes[level]} font-semibold tracking-tight`;
  if (level === 1) return <h1 className={className}>{children}</h1>;
  if (level === 2) return <h2 className={className}>{children}</h2>;
  if (level === 3) return <h3 className={className}>{children}</h3>;
  return <h4 className={className}>{children}</h4>;
};

export const Section = ({
  title,
  subtitle,
  children,
}: { title?: string; subtitle?: string } & Children) => (
  <section className="space-y-4">
    {(title || subtitle) && (
      <div className="space-y-1">
        {title && <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>}
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    )}
    {children}
  </section>
);

export const Grid = ({
  cols = 2,
  gap = 4,
  children,
}: { cols?: 1 | 2 | 3 | 4; gap?: number } & Children) => {
  const colsClass: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };
  return <div className={`grid ${colsClass[cols]} gap-${gap}`}>{children}</div>;
};

export const Card = ({ padding = 4, children }: { padding?: number } & Children) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm p-${padding}`}>
    {children}
  </div>
);

export const Hero = ({
  eyebrow,
  children,
}: { eyebrow?: string } & Children) => (
  <div className="space-y-4 py-8">
    {eyebrow && (
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {eyebrow}
      </p>
    )}
    {children}
  </div>
);

export const Avatar = ({
  src,
  alt = "",
  size = "md",
}: {
  src: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
}) => {
  const sizes = { sm: "h-10 w-10", md: "h-16 w-16", lg: "h-24 w-24" };
  return (
    <img
      src={src}
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover ring-1 ring-border`}
    />
  );
};

export const Badge = ({
  variant = "default",
  children,
}: { variant?: "default" | "outline" | "accent" } & Children) => {
  const variants = {
    default: "bg-secondary text-secondary-foreground",
    outline: "border border-border text-foreground",
    accent: "bg-primary/10 text-primary",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

export const Link = ({
  href,
  external = false,
  children,
}: { href: string; external?: boolean } & Children) => (
  <a
    href={href}
    {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    className="text-primary underline-offset-4 hover:underline"
  >
    {children}
  </a>
);

export const List = ({
  variant = "bullet",
  children,
}: { variant?: "bullet" | "none" } & Children) => {
  const className = variant === "bullet" ? "list-disc pl-5 space-y-1" : "space-y-1";
  return <ul className={className}>{children}</ul>;
};

export const ListItem = ({ children }: Children) => <li>{children}</li>;

export const Button = ({
  onClick,
  variant = "default",
  children,
}: { onClick: string; variant?: "default" | "outline" | "ghost" } & Children) => (
  <ButtonPrimitive variant={variant} onClick={() => dispatchAction(onClick)}>
    {children}
  </ButtonPrimitive>
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
  <img src={src} alt={alt} className="rounded-md" />
);

export const Divider = () => <hr className="my-2 border-t" />;

export const registry: Registry = {
  Stack,
  Row,
  Box,
  Text,
  Paragraph,
  Heading,
  Section,
  Grid,
  Card,
  Hero,
  Avatar,
  Badge,
  Link,
  List,
  ListItem,
  Button,
  Input,
  Image,
  Divider,
};

export { ButtonPrimitive, InputPrimitive } from "./primitives";
