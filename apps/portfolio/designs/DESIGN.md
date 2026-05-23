---
name: Semantic Lab
colors:
  surface: '#faf9fe'
  surface-dim: '#dad9df'
  surface-bright: '#faf9fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f8'
  surface-container: '#eeedf3'
  surface-container-high: '#e9e7ed'
  surface-container-highest: '#e3e2e7'
  on-surface: '#1a1b1f'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3034'
  inverse-on-surface: '#f1f0f5'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dcdddd'
  on-secondary-container: '#5f6161'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c1b1a'
  on-tertiary-container: '#868382'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e6e2df'
  tertiary-fixed-dim: '#cac6c4'
  on-tertiary-fixed: '#1c1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#faf9fe'
  on-background: '#1a1b1f'
  surface-variant: '#e3e2e7'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 4.5rem
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 128px
---

> **Source of truth.** When this prose contradicts a
> `designs/{mode}/code.html` reference, the `code.html` wins. The
> prose below is commentary on intent; the visual artefacts in each
> mode folder are canonical. Future visual specs should read
> `code.html` first, this prose second.

## Brand & Style

The design system embodies a "Hyper-Minimalist Lab" aesthetic, positioning the product as an intelligent, generative environment rather than a static portfolio. The personality is cerebral, precise, and forward-leaning, evoking the feeling of a clean-room laboratory where data and creativity intersect.

The visual narrative relies on extreme reductionism. By removing traditional UI scaffolding like heavy borders and solid containers, the focus shifts entirely to content and the underlying AI logic. Subtle motion—specifically an interactive particle background—functions as a "digital heartbeat," indicating that the system is alive and processing. The user should feel a sense of calm authority and effortless technological sophistication.

## Colors

The palette is strictly functional, utilizing a high-contrast foundation to ensure absolute legibility and a "logic-first" feel.

- **Primary (#1A1A1A):** Used for all core text, iconography, and high-priority structural elements. It provides the "ink" on the digital canvas.
- **Secondary (#F5F5F5):** The primary surface color. It is a neutral, warm-leaning grey that reduces eye strain compared to pure white while maintaining a clinical feel.
- **Accent (#FF3B30):** "Process Red." Reserved exclusively for status indicators (e.g., "Live," "Recording," "Active") and micro-interactions. It should never be used for large surfaces.
- **Neutral (#8E8E93):** Used for secondary meta-data, breadcrumbs, and inactive states.

## Typography

This design system utilizes a dual-font strategy to balance human-centric communication with technical precision.

- **Headlines:** Set in **Inter**, a high-performance Neo-Grotesk. Tight tracking and significant scale differences create a clear hierarchy. Large headlines should use negative letter spacing to feel "locked" and architectural.
- **Body & Data:** Set in **JetBrains Mono**. This monospaced typeface reinforces the "Lab" aesthetic, suggesting that every line of text is a piece of data or a generative output.
- **Labels:** Small caps and increased tracking are used for "meta" information (e.g., timestamps, technical tags) to distinguish them from standard body text.

## Layout & Spacing

The layout is governed by a fluid grid that prioritizes "Negative Space" as a functional element. 

- **Grid Model:** A 12-column system for desktop, collapsing to 1 column for mobile. 
- **The "Breath" Principle:** Elements are never crowded. Use a generous 128px gap between major vertical sections.
- **Alignment:** Content is generally center-aligned to create a focal "stage" for AI-generated responses.
- **Safe Areas:** Maintain substantial outer margins (64px+) on desktop to create a "floating" effect for the central content block.

## Elevation & Depth

This design system rejects traditional shadows in favor of tonal layering and glassmorphism.

- **Base Layer:** The `secondary` (#F5F5F5) background is the foundation.
- **Surface Layer:** Overlays (modals, floating inputs) use a translucent white (rgba(255, 255, 255, 0.7)) with a heavy `backdrop-filter: blur(20px)`.
- **Depth:** Depth is conveyed through "floating" elements. Instead of shadows, use a 1px neutral-low-opacity outline (rgba(0, 0, 0, 0.05)) to define edges of glass surfaces.
- **Interaction:** On hover, elements may subtly increase in scale (1.02x) rather than lifting with a shadow, maintaining the "flat-lab" aesthetic.

## Shapes

The shape language is "Soft-Modern." While the layout is rigid and structured, individual components have rounded corners to feel approachable and sophisticated.

- **Small Components (Chips/Tags):** 0.5rem radius.
- **Interactive Containers (Input Fields/Cards):** 1rem (rounded-lg) to 1.5rem (rounded-xl) radius.
- **Special Elements:** The main search/input bar uses a "pill" shape (max roundedness) to emphasize its role as the primary interaction point.

## Components

### Buttons & Inputs
- **Primary Input:** A floating, pill-shaped white container with a glassmorphic blur. It has no border, only a subtle inner glow or a very soft, light-grey stroke. 
- **Action Buttons:** Circular or pill-shaped, using the `primary` charcoal color for the icon/label and a transparent or glass background.

### Chips & Tags
- **Technical Tags:** Small, monospaced text inside a subtle grey (#E0E0E0) container with a 0.5rem radius. Used for categorization of portfolio projects.

### Cards
- **Project Cards:** Borderless with a clean white background. Images should have the same corner radius as the card (1rem). Typography inside cards follows a strict monospaced body style for descriptions.

### AI Indicators
- **Process Red Dot:** A 8px pulsating circle used next to "Live" or "Processing" text to signal active computation.
- **Particle Background:** A canvas-based layer of grey dots that move slowly in response to mouse position, suggesting a fluid data field.

### Lists
- Clean, unstyled lists with generous vertical padding (24px) between items, separated only by a hairline 1px stroke (rgba(0, 0, 0, 0.05)).