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

// A Grid child may set `span={n}` (1–cols) to occupy n columns. The child
// component ignores the prop; the Grid wraps a spanned child in a motion
// grid item that both participates in the stagger and carries a responsive
// col-span (collapses to one column on mobile, mirroring `colsClass`).
const spanClass: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-1 sm:col-span-2",
  3: "col-span-1 sm:col-span-2 lg:col-span-3",
  4: "col-span-1 sm:col-span-2 lg:col-span-4",
};

function gridChildren(children: ReactNode): ReactNode {
  return Children.map(children, (child, i) => {
    const span = isValidElement(child)
      ? (child.props as { span?: number }).span
      : undefined;
    if (span && span > 1) {
      return (
        <motion.div key={i} variants={fadeUp} className={spanClass[span] ?? "col-span-1"}>
          {child}
        </motion.div>
      );
    }
    return wrapForStagger(child, i);
  });
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
  gap = 8,
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
      {gridChildren(children)}
    </motion.div>
  );
};

export const Card = ({
  padding = 8,
  onClick,
  prompt,
  children,
}: { padding?: number; onClick?: string; prompt?: string } & Children) => {
  const childArr = Children.toArray(children);
  const firstIsImage =
    childArr.length > 0 &&
    isValidElement(childArr[0]) &&
    childArr[0].type === Image;
  // SVG icons (e.g. /icons/github.svg) are inline content — only photographic
  // Images claim the full-bleed 16:9 cover slot.
  const firstProps = firstIsImage
    ? (childArr[0] as React.ReactElement<{ src?: string; alt?: string }>).props
    : {};
  const firstSrc = firstProps.src ?? "";
  const hasCover = firstIsImage && !firstSrc.endsWith(".svg");
  const rest = hasCover ? childArr.slice(1) : childArr;
  const interactive = Boolean(onClick);
  const fire = onClick ? () => dispatchAction(onClick, prompt) : undefined;
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      {...(interactive
        ? {
            role: "button",
            tabIndex: 0,
            onClick: fire,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fire?.();
              }
            },
          }
        : {})}
      className={`group relative overflow-hidden rounded-2xl border border-hair bg-card${
        interactive
          ? " cursor-pointer transition-colors hover:border-accent/60"
          : ""
      }`}
    >
      {hasCover && (
        // Cover is rendered straight from the first <Image>'s props — full-bleed
        // and frameless — so the standalone <Image> glass frame never leaks into
        // a card cover.
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={firstSrc}
            alt={firstProps.alt ?? ""}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}
      <div className={`relative space-y-3 p-${padding}`}>{rest}</div>
    </motion.div>
  );
};

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
        className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground"
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
    3: "font-sans text-xl font-medium tracking-tight",
    // Level 4 doubles as the "label-caps" used for metadata block labels in
    // the project detail view (designs/detail/).
    4: "font-sans text-[0.7rem] font-medium uppercase tracking-[0.2em] text-muted-foreground",
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
      className={`${sizes[size]} rounded-full object-cover ring-1 ring-hair`}
    />
  );
};

export const Badge = ({
  variant = "default",
  children,
}: { variant?: "default" | "outline" | "accent" } & Children) => {
  const variants = {
    default: "bg-secondary text-secondary-foreground",
    outline: "border border-hair text-foreground",
    accent: "bg-accent/10 text-accent",
  };
  return (
    <motion.span
      variants={fadeUp}
      className={`inline-flex items-center rounded px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wider ${variants[variant]}`}
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
    className="group inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:underline"
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
      ? "list-disc pl-5 space-y-1.5 marker:text-foreground/40"
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
  prompt,
  variant = "default",
  children,
}: {
  onClick: string;
  prompt?: string;
  variant?: "default" | "outline" | "ghost";
} & Children) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-hair bg-transparent hover:bg-secondary",
    ghost: "bg-transparent hover:bg-secondary",
  };
  return (
    <motion.button
      variants={fadeUp}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={() => dispatchAction(onClick, prompt)}
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
    className="h-10 w-full rounded-full border border-hair bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
  />
);

export const Image = ({ src, alt = "" }: { src: string; alt?: string }) => {
  // SVG icons render small + contained (e.g. /icons/github.svg).
  const isIcon = src.endsWith(".svg");
  if (isIcon) {
    return (
      <motion.img
        variants={fadeUp}
        src={src}
        alt={alt}
        className="h-8 w-8 object-contain"
      />
    );
  }
  // Photographic assets sit in a glassmorphic frame — a translucent, blurred,
  // hairline-bordered panel with a 1px inset — echoing the `.glass-surface p-1`
  // tiles in designs/detail/. (Card covers are rendered separately and stay
  // frameless, so the gallery grid is unaffected.)
  return (
    <motion.figure
      variants={fadeUp}
      className="overflow-hidden rounded-xl border border-hair bg-card/60 p-1 backdrop-blur-sm"
    >
      <img src={src} alt={alt} className="w-full rounded-lg object-cover" />
    </motion.figure>
  );
};

export const Video = ({ src, title }: { src: string; title?: string }) => (
  <motion.figure variants={fadeUp} className="space-y-2">
    <motion.div
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.3 }}
      className="relative aspect-video overflow-hidden rounded-2xl border border-hair bg-black"
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
    className="my-4 border-t border-hair"
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
  Video,
  Divider,
};
