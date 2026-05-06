"use client";

import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { dispatchAction, type Registry } from "@generative-semantic-ui/core";

// Portfolio adapter. All components are styled and animated specifically for
// Pelayo's portfolio — Framer Motion handles entrance and hover; layout is
// Tailwind. Children of Stack/Grid/Hero/Section are auto-staggered.

type Children = { children?: ReactNode };

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

// Wrap a primitive child in a motion variant so it participates in
// parent-driven stagger animation. Plain text children are wrapped in a span.
function wrapForStagger(node: ReactNode, key: number): ReactNode {
  if (isValidElement(node)) {
    // If the child is already a motion-aware component, pass through.
    return cloneElement(node, { key });
  }
  return (
    <motion.span key={key} variants={fadeUp}>
      {node}
    </motion.span>
  );
}

function staggerChildren(children: ReactNode): ReactNode {
  return Children.map(children, (child, i) => wrapForStagger(child, i));
}

export const Stack = ({ gap = 4, children }: { gap?: number } & Children) => (
  <motion.div
    variants={stagger}
    initial="hidden"
    animate="show"
    className={`flex flex-col gap-${gap}`}
  >
    {staggerChildren(children)}
  </motion.div>
);

export const Row = ({ gap = 3, children }: { gap?: number } & Children) => (
  <motion.div
    variants={stagger}
    initial="hidden"
    animate="show"
    className={`flex flex-row flex-wrap items-center gap-${gap}`}
  >
    {staggerChildren(children)}
  </motion.div>
);

export const Box = ({ padding = 0, children }: { padding?: number } & Children) => (
  <motion.div variants={fadeUp} className={`p-${padding}`}>
    {children}
  </motion.div>
);

export const Section = ({
  title,
  subtitle,
  children,
}: { title?: string; subtitle?: string } & Children) => (
  <motion.section
    variants={stagger}
    initial="hidden"
    animate="show"
    className="space-y-6"
  >
    {(title || subtitle) && (
      <motion.div variants={fadeUp} className="space-y-1.5">
        {title && (
          <h2 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </motion.div>
    )}
    {staggerChildren(children)}
  </motion.section>
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
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className={`grid ${colsClass[cols]} gap-${gap}`}
    >
      {staggerChildren(children)}
    </motion.div>
  );
};

export const Card = ({ padding = 6, children }: { padding?: number } & Children) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -2, transition: { duration: 0.2 } }}
    className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-${padding} shadow-sm backdrop-blur-sm transition-colors hover:border-border`}
  >
    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
    </div>
    <div className="relative space-y-3">{children}</div>
  </motion.div>
);

export const Hero = ({ eyebrow, children }: { eyebrow?: string } & Children) => (
  <motion.div
    variants={stagger}
    initial="hidden"
    animate="show"
    className="space-y-5 py-10"
  >
    {eyebrow && (
      <motion.p
        variants={fadeUp}
        className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent"
      >
        {eyebrow}
      </motion.p>
    )}
    {staggerChildren(children)}
  </motion.div>
);

export const Heading = ({
  level = 2,
  children,
}: { level?: 1 | 2 | 3 | 4 } & Children) => {
  const styles: Record<number, string> = {
    1: "font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl",
    2: "font-display text-3xl tracking-tight sm:text-4xl",
    3: "font-sans text-xl font-semibold tracking-tight",
    4: "font-sans text-base font-semibold tracking-tight",
  };
  const className = styles[level];
  const inner = <span className="block">{children}</span>;
  if (level === 1)
    return (
      <motion.h1 variants={fadeUp} className={className}>
        {inner}
      </motion.h1>
    );
  if (level === 2)
    return (
      <motion.h2 variants={fadeUp} className={className}>
        {inner}
      </motion.h2>
    );
  if (level === 3)
    return (
      <motion.h3 variants={fadeUp} className={className}>
        {inner}
      </motion.h3>
    );
  return (
    <motion.h4 variants={fadeUp} className={className}>
      {inner}
    </motion.h4>
  );
};

export const Text = ({ children }: Children) => (
  <span className="text-foreground">{children}</span>
);

export const Paragraph = ({ children }: Children) => (
  <motion.p
    variants={fadeUp}
    className="max-w-prose text-base leading-relaxed text-foreground/75"
  >
    {children}
  </motion.p>
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
  const sizes = {
    sm: "h-12 w-12",
    md: "h-20 w-20",
    lg: "h-28 w-28",
  };
  return (
    <motion.img
      variants={fadeUp}
      src={src}
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover ring-1 ring-border shadow-lg`}
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
    accent: "bg-accent/10 text-accent",
  };
  return (
    <motion.span
      variants={fadeUp}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </motion.span>
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
    className="group inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-accent hover:underline"
  >
    {children}
    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
      →
    </span>
  </a>
);

export const List = ({
  variant = "bullet",
  children,
}: { variant?: "bullet" | "none" } & Children) => {
  const className =
    variant === "bullet"
      ? "list-disc pl-5 space-y-1.5 marker:text-accent"
      : "space-y-1.5";
  return (
    <motion.ul variants={stagger} className={className}>
      {staggerChildren(children)}
    </motion.ul>
  );
};

export const ListItem = ({ children }: Children) => (
  <motion.li variants={fadeUp} className="text-foreground/80">
    {children}
  </motion.li>
);

export const Button = ({
  onClick,
  variant = "default",
  children,
}: {
  onClick: string;
  variant?: "default" | "outline" | "ghost";
} & Children) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-border bg-transparent hover:bg-secondary",
    ghost: "bg-transparent hover:bg-secondary",
  };
  return (
    <motion.button
      variants={fadeUp}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={() => dispatchAction(onClick)}
      className={`inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors ${variants[variant]}`}
    >
      {children}
    </motion.button>
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
  <motion.input
    variants={fadeUp}
    name={name}
    type={type}
    placeholder={placeholder}
    className="h-10 w-full rounded-full border border-border bg-background/60 px-4 text-sm shadow-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-ring"
  />
);

export const Image = ({ src, alt = "" }: { src: string; alt?: string }) => (
  <motion.img
    variants={fadeUp}
    src={src}
    alt={alt}
    className="rounded-xl object-cover"
  />
);

export const Video = ({ src, title }: { src: string; title?: string }) => (
  <motion.figure variants={fadeUp} className="space-y-2">
    <motion.div
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.3 }}
      className="relative aspect-video overflow-hidden rounded-2xl border border-border/60 bg-black shadow-lg"
    >
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </motion.div>
    {title && (
      <figcaption className="text-xs text-muted-foreground">{title}</figcaption>
    )}
  </motion.figure>
);

export const Divider = () => (
  <motion.hr
    variants={fadeUp}
    className="my-4 border-t border-border/60"
  />
);

export const portfolioRegistry: Registry = {
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
