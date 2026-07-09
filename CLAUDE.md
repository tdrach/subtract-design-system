# @subtract/ds — Design System Rules

This document describes codebase conventions for integrating Figma designs via MCP.

---

## Project overview

`@subtract/ds` is a React component library + SCSS design token system consumed by Next.js apps. The package root is the library source; `preview/` is a Next.js app that previews components locally and can be captured into Figma via the MCP Figma capture script.

**Stack:** React 19 · Next.js 16 · SCSS Modules · Visx (SVG charts) · Radix UI primitives · Phosphor Icons · TypeScript (strict)

---

## 1. Design tokens

All tokens live in **`src/styles/tokens.scss`** as SCSS variables. Every component module must import them with:

```scss
@use '../../styles/tokens' as *;
```

### Color palette

Canonical names + values mirror the Figma Colors page (SDS → Colors).

| Variable | Value | Semantic use |
|---|---|---|
| `$ink-dark` | `#191918` | Primary text; dark surfaces |
| `$ink-light` | `#8d8a86` | Secondary text (warm gray) |
| `$demure` | `#dcddd7` | Borders, dividers, subtle fills |
| `$light` | `#faf9f8` | Page background |
| `$white` | `#ffffff` | Card / elevated surfaces |
| `$primary` | `#11a0ff` | Primary CTA, links, focus rings |
| `$positive` | `#06d021` | Success, positive |
| `$error` | `#ff2111` | Error states |
| `$warning` | `#ffa811` | Warning states |
| `$muted-light` | `rgba(255,255,255,0.7)` | Secondary text on dark |

**Deprecated aliases** (compile but prefer canonical): `$black` → `$ink-dark`, `$blue` → `$primary`, `$green` → `$positive`, `$muted` → `$ink-light`. ⚠️ `$ink-light` changed meaning — it was white text-on-dark (use `$white` for that now); today it is the secondary-text gray.

Chart components use these as inline constants (not SCSS vars) since they are SVG:
- `MUTED = 'rgba(12,12,12,0.28)'` — axis labels
- `GRID = 'rgba(12,12,12,0.07)'` — grid lines
- `BLACK = '#0c0c0c'` — callout values

CSS custom properties for the subset of tokens used in JS are set in `global.scss`:
`--black`, `--light`, `--white`, `--demure`, `--ink-dark`, `--ink-light`, `--blue`, `--error`, `--nav-height`

### Typography

Font: **Indivisible** by Connary Fagen (custom web font, `.woff2`). Loaded via `next/font/local`, exposed as CSS variable `--font-indivisible`.

**Font tokens:** `$font-display` / `$font-text` (Indivisible) · `$font-mono` · `$font-dense` — the system UI stack (`-apple-system…` → SF Pro on macOS) used by the **Dense system**: the `size="sm"` variants of tool controls (`TextInput`, `NumberInput`, `Select`, `Textarea`) plus `Button size="dense"`, for inspectors and toolbars. All share one metric set — 28px tall, `$text-small`, `$font-dense`, `$radius-micro` (5px), 1px `$demure` border, 8px (`$space-4`) inline padding — so a dropdown, dimension fields, and action buttons line up edge-to-edge as one family (Figma: the Gridfinity build-plate properties panel). Indivisible stays the brand voice at `md`+; dense surfaces borrow the platform's own UI font. `NumberInput` also takes an inline `label` prop (a muted prefix inside the field) so a labelled dimension collapses into one dense control — `<NumberInput size="sm" label="W" suffix="mm" …>` renders "W 42 mm" (Figma: the Flatland inspector field).

### Type styles (high-level tokens)

**Prefer these over raw size/weight combinations.** One token per Figma text style (SDS → Styles → Text styles); each bundles family + size + weight + tracking from the base tokens. Apply with the mixin:

```scss
h1 { @include type-style($text-display-1); }
```

| Token (1 / 2 / 3) | Family | Size | Tracking | Weights |
|---|---|---|---|---|
| `$text-display-1/2/3` | `$font-display` | `$text-3xl` 144px | −7% (`$letter-spacing-hero`) | 800 / 500 / 400 |
| `$text-title-1/2/3` | `$font-display` | `$text-2xl` 56px | −3% | 800 / 500 / 400 |
| `$text-subtitle-1/2/3` | `$font-display` | `$text-xl` 42px | −2.5% | 800 / 500 / 400 |
| `$text-text-1/2` | `$font-text` | `$text-large` 28px | −2% | 500 / 400 |
| `$text-body-1/2` | `$font-text` | `$text-base` 17px | −2.5% | 500 / 400 |
| `$text-label-1/2` | `$font-dense` (SF Pro) | `$text-small` 12.8px | −2.5% | 500 / 400 |

Numbered variants step down in weight: **1** = Bold cut (`$weight-extrabold` 800), **2** = Medium, **3** = Regular. Labels sit on the Dense system font. Line-height is auto in Figma, so the mixin leaves it inherited — set it locally when needed.

```tsx
// In the consuming app's root layout:
const indivisible = localFont({
  src: [
    { path: './public/fonts/IndivisibleWebRegular.woff2',        weight: '400', style: 'normal' },
    { path: './public/fonts/IndivisibleWebMedium.woff2',         weight: '500', style: 'normal' },
    { path: './public/fonts/IndivisibleWebSemiBold.woff2',       weight: '600', style: 'normal' },
    { path: './public/fonts/IndivisibleWebSemiBold.woff2',       weight: '700', style: 'normal' },
    { path: './public/fonts/IndivisibleWebBold.woff2',          weight: '800', style: 'normal' },
    { path: './public/fonts/IndivisibleWebRegularItalic.woff2', weight: '400', style: 'italic' },
    { path: './public/fonts/IndivisibleWebSemiBoldItalic.woff2', weight: '600', style: 'italic' },
    { path: './public/fonts/IndivisibleWebSemiBoldItalic.woff2', weight: '700', style: 'italic' },
    { path: './public/fonts/IndivisibleWebBoldItalic.woff2',     weight: '800', style: 'italic' },
  ],
  variable: '--font-indivisible',
})
// Copy fonts from ds/public/fonts/ to the consuming app's public/fonts/
```

This is the complete, canonical type scale — there are no other font-size tokens. Every text style in the DS must use one of these; pick the closest size rather than introducing a new value.

| Variable | px | Use |
|---|---|---|
| `$text-small` | 12.8px | Labels, meta, captions, small UI text |
| `$text-base` | 17px | UI: buttons, navigation, body |
| `$text-large` | 28px | Body / editorial |
| `$text-xl` | 42px | Section headings |
| `$text-2xl` | 56px | Large display |
| `$text-3xl` | 144px | Hero title |

Letter-spacing tokens: `$letter-spacing-hero` (`-0.07em`), `$letter-spacing-tight` (`-0.025rem`), `$letter-spacing-normal` (`0`), `$letter-spacing-label` (`0.08em`).

Font weights: `$weight-regular` (400), `$weight-medium` (500), `$weight-semibold` (600), `$weight-bold` (700, SemiBold face), `$weight-extrabold` (800, Bold face).

### Spacing

Not a linear scale — numbers are not pixel values. Full token table:

| Token | px |
|---|---|
| `$space-1` | 2px |
| `$space-2` | 4px |
| `$space-3` | 6px |
| `$space-4` | 8px |
| `$space-5` | 10px |
| `$space-6` | 14px |
| `$space-7` | 15px |
| `$space-8` | 17px |
| `$space-10` | 20px |
| `$space-12` | 24px |
| `$space-16` | 32px |
| `$space-20` | 40px |
| `$space-24` | 48px |
| `$space-32` | 64px |
| `$space-40` | 80px |
| `$space-48` | 96px |
| `$space-64` | 128px |

Note: there is no `$space-9` or `$space-11`.

### Layout

| Variable | Value |
|---|---|
| `$max-width-content` | 680px |
| `$max-width-text` | 980px |
| `$max-width-wide` | 1080px |
| `$nav-height` | 48px |
| `$sidebar-width` | 18rem |
| `$border-width` | 3px |

### Border radius

`$radius-micro` (5px), `$radius-sm` (8px), `$radius` (8px), `$radius-md` (11px), `$radius-lg` (12px), `$radius-pill` (980px), `$radius-circle` (50%).

### Motion

**Semantic easing** — choose based on what the element is doing:

| Variable | Curve | Use |
|---|---|---|
| `$ease-enter` | `cubic-bezier(0,0,0.2,1)` | Entering the screen (decelerate in) |
| `$ease-exit` | `cubic-bezier(0.4,0,1,1)` | Leaving the screen (accelerate out) |
| `$ease-move` | `cubic-bezier(0.4,0,0.2,1)` | Moving on-screen |
| `$ease-hover` | `cubic-bezier(0.25,0.1,0.25,1)` | Hover / color change (fast feedback) |

**Expressive curves:** `$ease-breeze` (gentle spring), `$ease-silk` (ultra-smooth), `$ease-swift`, `$ease-nova`, `$ease-crisp`, `$ease-glide`.

**Durations:**

| Variable | Value | Use |
|---|---|---|
| `$t-micro` | 120ms | Color, opacity, hover feedback |
| `$t-fast` | 220ms | Small elements (tooltips, chips) |
| `$t-medium` | 320ms | Standard UI transitions |
| `$t-slow` | 480ms | Page-level motion |
| `$t-glacial` | 700ms | Hero reveals |

**Transition shorthands:** `$transition-fast` (`$t-micro $ease-hover`), `$transition-base` (`$t-fast $ease-move`), `$transition-slow` (`$t-medium $ease-enter`).

---

## 2. Styling approach

**SCSS Modules** exclusively. Every component has a `ComponentName.module.scss` file.

```scss
// All module files begin with:
@use '../../styles/tokens' as *;
```

No Tailwind, no CSS-in-JS, no styled-components.

Global styles in `src/styles/global.scss` — import once in the root layout:
```tsx
import '@subtract/ds/styles/global.scss'
```

Global styles define: box-sizing reset, base font/color on `body`, heading styles (`h1–h6`), link styles, button reset, `:focus-visible` ring (2px solid `$blue`), `.sr-only` utility.

**Responsive design** uses standard media queries (`max-width: 640px`) directly in SCSS modules — no breakpoint tokens or utility classes.

---

## 3. Animation system

Mixins live in `src/styles/animations.scss`. Import with `@use '../../styles/animations' as *;`.

**Trigger classes** (applied via JS — IntersectionObserver or mount):
- `.is-loaded` — on page/component mount
- `.is-visible` — scrolled into view
- `.is-scrolled` — passed the visible window
- `.is-hovered` — mouse-entered the sibling group
- `.is-faded` — dimmed sibling in hover-fade group

**Key mixins:**
- `sp-fade-in-up($distance, $duration, $delay)` — hero content
- `sp-fade-in-down($distance, $duration, $delay)` — cards, scroll-revealed
- `sp-scale-in($initial-scale, $duration, $delay)` — dialogs, popovers
- `sp-fade-in-on-scroll($distance, $duration)` — IntersectionObserver reveals
- `sp-stagger-wave($base-delay, $stagger, $max-items)` — cascaded list entrances
- `sp-clip-reveal($direction, $duration, $delay, $easing)` — text/image wipes
- `sp-blur-in($blur, $duration, $delay)` — overlays, modals
- `sp-slide-from-edge($direction, $distance, $duration, $delay)` — drawers, sheets

All mixins include `@media (prefers-reduced-motion: reduce)` handling. Animate **transforms + opacity only** (GPU-composited).

---

## 4. Component library

**Location:** `src/components/` — each component in its own directory.

**Structure per component:**
```
ComponentName/
  ComponentName.tsx         # main component
  ComponentName.module.scss # styles (if needed)
  index.ts                  # re-export
```

**All exports flow through** `src/components/index.ts` → `src/index.ts`.

### UI components

| Component | Description | Key props |
|---|---|---|
| `Button` | Primary action button | `variant` (primary/secondary/gray), `size` (sm/md/**dense**), `href`, `iconBefore`, `iconAfter`, `split`, `iconOnly`. `dense` = 28px SF Pro, pairs with `size="sm"` dense fields |
| `Header` | Sticky top nav | `wordmark`, `navLinks`, `rightSlot` |
| `Footer` | Page footer | `FooterProps` |
| `Dialog` | Modal dialog (Radix) | Composable: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogBody`, `DialogClose` |
| `DropdownMenu` | Dropdown (Radix) | Composable: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator` |
| `TabBar` / `Tab` | Tab navigation | `active`, `border`, `ariaLabel` |
| `Tag` | Status tag, 5 semantic tones (Figma: Tag) | `tone` (active/positive/warning/error/neutral) |
| `TagSelector` / `TagPill` | Multi-tag input with create | `tags`, `selected`, `onSelect`, `onDeselect`, `onCreate`, `compact` |
| `TextInput` | Styled `<input>` | All native input attrs |
| `ChecklistItem` | Checkbox row with drag handle | `checked`, `done`, `trailing`, `dragHandleProps` |
| `ExpandPanel` | Collapsible panel | Composable: `ExpandPanel`, `ExpandPanelTrigger`, `ExpandPanelContent`, `ExpandPanelBody`, `ExpandPanelClose` |
| `Skeleton` | Loading placeholder | `width`, `height`, `radius` |
| `SegmentedControl` | Pill-style mutually-exclusive button group | `options` (`{ label, value }[]`), `value`, `onChange`, `size` (sm/md) |

### Data visualization (SVG / Visx)

All chart components are `'use client'`, SVG-based, and built on `@visx/*`. They accept a `uid` prop (default `'a'`) for unique SVG gradient/clip IDs when multiple instances appear on one page.

| Component | Description |
|---|---|
| `LineChart` | Multi-series line chart with area fill, glow, dot texture, tooltips. Props: `series`, `dates`, `xLabels`, `width`, `height`, `showYAxis`, `valueFormat`, `dots`, `uid`, `sparkline` |
| `Sparkline` | Minimal sparkline wrapper |
| `SegmentBar` | Proportional horizontal bar with gaps + tooltips. Props: `segments`, `width`, `height`, `gap`, `radius`, `valueFormat`, `uid` |
| `GanttChart` | Horizontal bar timeline. Props: `tasks`, `width`, `rowHeight`, `labelWidth`, `domain`, `tickCount`, `valueFormat`, `height`, `sparkline`, `uid` |
| `FunnelChart` | Smooth funnel visualization with curved paths |
| `CalendarChart` | Activity calendar heatmap. Includes `onDayClick` |
| `WeightChart` | Specialized weight/metric chart |
| `BubbleMatrix` | Grid of sized/colored bubbles with column headers |

**Chart tooltip pattern** (used across all charts):
```tsx
const TOOLTIP_STYLES: React.CSSProperties = {
  ...defaultStyles,           // from @visx/tooltip
  background: '#0c0c0c',
  color: '#fff',
  padding: '8px 12px',
  borderRadius: 8,
  fontSize: 13,
  fontFamily: 'inherit',
  boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
  lineHeight: 1,
}
```

**Chart DS token constants** (used inline in SVG components):
```ts
const MUTED = 'rgba(12,12,12,0.28)'   // axis labels, secondary
const GRID  = 'rgba(12,12,12,0.07)'   // horizontal/vertical grid lines
const BLACK = '#0c0c0c'               // callout values
```

---

## 5. Icon system

Library: **Phosphor Icons** (`@phosphor-icons/react`)

```tsx
import { X, DotsSix, Plus } from '@phosphor-icons/react'

// Usage (props: size, weight) — always bold
<X size={14} weight="bold" />
<Plus size={16} weight="bold" />
```

Icons are used at `size={14}` (sm buttons), `size={15–16}` (normal UI), `size={20–24}` (larger actions). Always use `weight="bold"`.

No custom icon SVG files — all icons sourced from `@phosphor-icons/react`.

---

## 6. Asset management

**Fonts:** `public/fonts/` — Indivisible family in `.woff2`, `.woff`, `.eot` formats. The preview app copies them at build time from `ds/public/fonts/` → `preview/public/fonts/` via a `predev`/`prebuild` script.

Consuming apps must copy the font files to their own `public/fonts/` directory and load them with `next/font/local`.

No CDN configuration — fonts are self-hosted.

---

## 7. Project structure

```
ds/
├── src/
│   ├── index.ts                   # library entry (re-exports components)
│   ├── components/
│   │   ├── index.ts               # all component exports
│   │   └── ComponentName/
│   │       ├── ComponentName.tsx
│   │       ├── ComponentName.module.scss
│   │       └── index.ts
│   └── styles/
│       ├── tokens.scss            # ALL design tokens
│       ├── global.scss            # reset + base styles (import once)
│       └── animations.scss        # animation mixins
├── public/
│   └── fonts/                     # Indivisible .woff2/.woff/.eot files
├── preview/                       # Next.js preview app
│   └── src/app/
│       ├── layout.tsx             # loads font, imports global.scss
│       └── page.tsx               # component showcase
└── package.json                   # peerDependencies: react, next, @visx/*, sass, radix, phosphor
```

**Package exports:**
```json
{
  ".": "./src/index.ts",
  "./styles/tokens": "./src/styles/tokens.scss",
  "./styles/global": "./src/styles/global.scss",
  "./styles/*": "./src/styles/*",
  "./src/*": "./src/*"
}
```

**Publishing workflow — changes only exist once they're pushed.** Consuming apps (e.g. the OS) install this package from GitHub (`github:tdrach/subtract-design-system`) and import the *source* files. The only way a DS change reaches a consumer — locally or in a deploy — is: commit + push here → `npm update @clawmachine/ds` in the consumer → commit the consumer's lockfile bump. **Never prototype by editing a consumer's `node_modules/@clawmachine/ds` in place**: it renders in their local dev (source imports) but is invisible to git/Vercel and is wiped by the next install. If a consumer's local UI mysteriously differs from its deploy, diff their `node_modules` copy against this repo at their lockfile-pinned commit.

---

## 8. Figma → code conventions

When implementing a Figma design into this codebase:

1. **Map colors to tokens** — never use raw hex values in SCSS; use `$black`, `$blue`, `$demure`, etc. For chart SVG inline styles, use the `MUTED`/`GRID`/`BLACK` constants pattern.

2. **Map spacing to `$space-*` tokens** — e.g. `padding: $space-12 $space-16` (not `24px 32px`).

3. **Map border radii to `$radius-*` tokens** — `$radius-sm` (8px), `$radius-md` (11px), `$radius-lg` (12px).

4. **Typography** — always use `$font-text`/`$font-display` (Indivisible via CSS var), and `$text-*` size tokens with `$weight-*`.

5. **New UI components** get a `ComponentName/` directory with a `.module.scss` and `index.ts`. Start the SCSS with `@use '../../styles/tokens' as *;`.

6. **Radix UI** for interactive overlay patterns (dialog, dropdown, popover). The DS wraps Radix with SCSS-styled shell components.

7. **Charts** use Visx. Match the existing `'use client'` + `useMemo` layout-computation + `useTooltip`/`useTooltipInPortal` pattern. Add a `uid` prop for multi-instance safety.

8. **Animations** — apply the `animations.scss` mixins; trigger via JS class toggling (`.is-loaded`, `.is-visible`). Never animate layout properties — transforms + opacity only.

9. **`'use client'`** — required for any component using hooks, event handlers, or Radix primitives. Omit for pure presentational server components (Header, Footer, Skeleton, TextInput).

10. **Figma capture** — the preview app includes `https://mcp.figma.com/mcp/html-to-design/capture.js` in the root layout, enabling the MCP server to capture live rendered pages back into Figma.
