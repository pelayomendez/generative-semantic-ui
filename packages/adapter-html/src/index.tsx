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
  <div
    style={{
      ...base,
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: scale(gap),
    }}
  >
    {children}
  </div>
);

export const Box = ({ padding = 0, children }: { padding?: number } & Children) => (
  <div style={{ ...base, padding: scale(padding) }}>{children}</div>
);

export const Text = ({ children }: Children) => <span>{children}</span>;

export const Paragraph = ({ children }: Children) => (
  <p style={{ margin: 0, lineHeight: 1.6, color: "#3f3f46" }}>{children}</p>
);

export const Heading = ({
  level = 2,
  children,
}: { level?: 1 | 2 | 3 | 4 } & Children) => {
  const sizes: Record<number, string> = {
    1: "2.25rem",
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

export const Section = ({
  title,
  subtitle,
  children,
}: { title?: string; subtitle?: string } & Children) => (
  <section style={{ ...base, display: "flex", flexDirection: "column", gap: scale(4) }}>
    {(title || subtitle) && (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {title && (
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>{title}</h2>
        )}
        {subtitle && (
          <p style={{ margin: 0, color: "#71717a", fontSize: 14 }}>{subtitle}</p>
        )}
      </div>
    )}
    {children}
  </section>
);

export const Grid = ({
  cols = 2,
  gap = 4,
  children,
}: { cols?: 1 | 2 | 3 | 4; gap?: number } & Children) => (
  <div
    style={{
      ...base,
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap: scale(gap),
    }}
  >
    {children}
  </div>
);

export const Card = ({ padding = 4, children }: { padding?: number } & Children) => (
  <div
    style={{
      ...base,
      padding: scale(padding),
      borderRadius: 8,
      border: "1px solid #e4e4e7",
      background: "#fff",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    }}
  >
    {children}
  </div>
);

export const Hero = ({
  eyebrow,
  children,
}: { eyebrow?: string } & Children) => (
  <div style={{ ...base, display: "flex", flexDirection: "column", gap: scale(4), padding: "32px 0" }}>
    {eyebrow && (
      <p
        style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#71717a",
        }}
      >
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
  const dims = { sm: 40, md: 64, lg: 96 }[size];
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: dims,
        height: dims,
        borderRadius: "50%",
        objectFit: "cover",
        border: "1px solid #e4e4e7",
      }}
    />
  );
};

export const Badge = ({
  variant = "default",
  children,
}: { variant?: "default" | "outline" | "accent" } & Children) => {
  const styles: Record<string, CSSProperties> = {
    default: { background: "#f4f4f5", color: "#18181b" },
    outline: { border: "1px solid #d4d4d8", color: "#18181b" },
    accent: { background: "rgba(59,130,246,0.1)", color: "#2563eb" },
  };
  return (
    <span
      style={{
        ...base,
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        ...styles[variant],
      }}
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
    style={{ color: "#2563eb", textUnderlineOffset: 4 }}
  >
    {children}
  </a>
);

export const List = ({
  variant = "bullet",
  children,
}: { variant?: "bullet" | "none" } & Children) => (
  <ul
    style={{
      listStyle: variant === "bullet" ? "disc" : "none",
      paddingLeft: variant === "bullet" ? 20 : 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}
  >
    {children}
  </ul>
);

export const ListItem = ({ children }: Children) => <li>{children}</li>;

export const Button = ({
  onClick,
  variant = "default",
  children,
}: { onClick: string; variant?: "default" | "outline" | "ghost" } & Children) => {
  const variants: Record<string, CSSProperties> = {
    default: { background: "#111", color: "#fff", border: "1px solid #111" },
    outline: { background: "transparent", color: "#111", border: "1px solid #d4d4d8" },
    ghost: { background: "transparent", color: "#111", border: "1px solid transparent" },
  };
  return (
    <button
      type="button"
      onClick={() => dispatchAction(onClick)}
      style={{
        ...base,
        height: 36,
        padding: "0 16px",
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
        ...variants[variant],
      }}
    >
      {children}
    </button>
  );
};

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

export const Video = ({ src, title }: { src: string; title?: string }) => (
  <figure style={{ ...base, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
    <div
      style={{
        ...base,
        position: "relative",
        width: "100%",
        paddingBottom: "56.25%",
        borderRadius: 8,
        overflow: "hidden",
        background: "#000",
        border: "1px solid #e4e4e7",
      }}
    >
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
      />
    </div>
    {title && (
      <figcaption style={{ fontSize: 12, color: "#71717a" }}>{title}</figcaption>
    )}
  </figure>
);

export const Divider = () => (
  <hr style={{ border: 0, borderTop: "1px solid #e4e4e7", margin: "8px 0" }} />
);

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
  Video,
  Divider,
};
