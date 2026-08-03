# Building with @subtract/ds

## Setup: there is no provider

Components are plain React — **no `ThemeProvider`, no context wrapper, no theme prop**. Import and render.
All styling arrives via `styles.css` (already bound) which `@import`s the fonts and the compiled component
CSS. Interactive components (Dialog, DropdownMenu, Slider, TabBar, TagSelector, charts) already declare
`'use client'` internally, so they drop into a Next.js App Router page without further ceremony.

Two typefaces carry the design language: **Indivisible** (the brand voice, `var(--font-indivisible)`) at
`md` sizes and above, and the **platform UI stack** (SF Pro on macOS) for the Dense family below.

## Styling idiom: props first, then inline styles

This is an **SCSS-Modules** system. Every component ships its own compiled, hash-named CSS.
**There are no utility classes and no exported class names — never invent a `className` to restyle a DS
component.** Change appearance through props (`variant`, `size`, `tone`, `active`). For *your own* layout
glue (wrappers, grids, spacing) use inline styles or your own CSS.

At runtime exactly **ten** design tokens exist as CSS custom properties:

```
--black #191918   --ink-dark #191918   --ink-light #8d8a86   --muted #8d8a86
--demure #dcddd7  --light #faf9f8      --white #ffffff
--blue #11a0ff    --error #ff2111      --nav-height 48px      (+ --font-indivisible)
```

**Everything else is compiled to literals.** `var(--space-4)`, `var(--radius-md)`, `var(--positive)` and
`var(--text-small)` **do not exist** and render broken. Use literal values from the real scale instead:

- **Spacing** (px): `2 4 6 8 10 14 15 17 20 24 32 40 48 64 80 96 128` — not a linear scale.
- **Radius** (px): `5` micro · `8` sm · `11` md · `12` lg · `980` pill · `50%` circle
- **Type** (px): `12.8` label · `17` body/UI · `28` large · `42` heading · `56` display · `144` hero
- **Colors with no var()**: positive `#06d021`, warning `#ffa811`

## Two control families — pick one and stay in it

- **Default (`md`)** — Indivisible, 44px controls. Forms and primary surfaces.
- **Dense (28px)** — `size="sm"` on `TextInput`/`NumberInput`/`Select`/`Textarea`, plus
  `Button size="dense"` and `IconButton`. Platform UI font, `5px` radius, 1px `#dcddd7` border, 8px inline
  padding. For inspectors, toolbars and property panels. Every member is **exactly 28px tall**, so a
  dropdown, dimension fields and action buttons line up edge-to-edge as one row.

Never mix a 44px field into a dense toolbar row — the alignment is the whole point of the family.

**Inline-label rule.** A label may sit *inside* a dense field only at **glyph scale** — one character or
one icon: `<NumberInput size="sm" label="W" suffix="mm" …/>` renders "W 42 mm". Anything wordier
("Wall thickness", "Clearance") must be a dense heading **above** an unlabeled control — inline words
overflow a 28px field.

## Icons

Phosphor, always bold: `import { Plus } from '@phosphor-icons/react'` → `<Plus size={16} weight="bold" />`.
Sizes: `14` in dense/sm controls, `15–16` in normal UI, `20–24` for large actions.

## Gotchas that bite

- **`Button variant="gray"` is `#faf9f8`** — invisible on `--light` page surfaces and on the Header bar.
  Use it only on white; otherwise reach for `secondary`.
- **Charts** (`LineChart`, `GanttChart`, `FunnelChart`, `BubbleMatrix`, `SegmentBar`, `Sparkline`) need an
  explicit `width`/`height` and a **unique `uid` per instance** — instances sharing a `uid` cross-wire
  their SVG gradient ids and one renders unfilled.
- **`Sidebar` and `ChatThread` are `height: 100%`** — give them a sized parent or they collapse to zero.
- **`NumberInput` is fully controlled**: `value` and `onChange` are required; there is no `defaultValue`.

## Where the truth lives

Read `_ds/<folder>/styles.css` and its `@import`s for the compiled CSS, and each component's
`<Name>.prompt.md` (usage) and `<Name>.d.ts` (props) before composing with it.

## An idiomatic build

```tsx
import { NumberInput, Button, IconButton, StatusTag } from '@subtract/ds'
import { ArrowCounterClockwise } from '@phosphor-icons/react'

<div style={{
  display: 'flex', flexDirection: 'column', gap: 10, padding: 16, width: 264,
  background: 'var(--white)', border: '1px solid var(--demure)', borderRadius: 11,
}}>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span style={{ fontSize: 12.8, color: 'var(--ink-light)' }}>Wall thickness</span>
    <StatusTag tone="positive">Valid</StatusTag>
  </div>
  <NumberInput size="sm" value={1.6} step={0.2} suffix="mm" onChange={setWall} />

  <span style={{ fontSize: 12.8, color: 'var(--ink-light)' }}>Plate size</span>
  <div style={{ display: 'flex', gap: 8 }}>
    <NumberInput size="sm" label="W" value={42} suffix="mm" onChange={setW} />
    <NumberInput size="sm" label="H" value={21} suffix="mm" onChange={setH} />
  </div>

  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
    <Button size="dense" variant="primary">Apply</Button>
    <IconButton aria-label="Reset">
      <ArrowCounterClockwise size={14} weight="bold" />
    </IconButton>
  </div>
</div>
```

Wordy labels sit *above* their fields; the glyph labels `W`/`H` sit *inside*. Every control in that panel
is 28px, so the rows align without manual spacing.
