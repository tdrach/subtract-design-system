# design-sync notes — @subtract/ds

Repo-specific gotchas for future syncs. Append as you learn things.

## Source shape & build (package shape)

- Ships **raw TS source** (`main: ./src/index.ts`), **no library dist** and **no Storybook**. Styles are **SCSS Modules** consumed by Next.js — esbuild can't load `.scss` raw, so the converter can't bundle `src/` directly.
- **Layer A build** (`.design-sync/build/layer-a.mjs`, `cfg.buildCmd`) compiles `src → dist/` with esbuild + sass before the converter runs:
  - `.module.scss` → esbuild `local-css` (hashed class strings inlined in JS, matching selectors extracted to `dist/index.css`).
  - `global.scss` → plain `css` loader (tokens `:root` custom props + base styles, unhashed) into `dist/index.css`.
  - peers (react/visx/radix/phosphor) left **external** (`packages:'external'`) for the converter's esbuild (Layer B) to inline.
  - `next/link` aliased to `.design-sync/build/next-link-shim.jsx` (plain `<a>`) — the DS bundle renders with no Next router. Used by Button/Header/Footer/Sidebar.
  - one sass importer maps the single package self-import `@use '@subtract/ds/styles/tokens.scss'` (in `Tabs.module.scss`) back to `src/styles/`.
- Converter consumes `--entry ./dist/index.js` for the runtime bundle; `cfg.cssEntry = dist/index.css` is copied into `_ds_bundle.css` (→ `styles.css` closure). Props (`.d.ts`) are read by ts-morph from **`src/` directly**, independent of the dist.
- Run: `node .design-sync/build/layer-a.mjs` then
  `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./preview/node_modules --entry ./dist/index.js --out ./ds-bundle`.

## node_modules

- Root `node_modules` lacks react/react-dom/sass (they're peerDeps). **Use `./preview/node_modules`** for `--node-modules` — it has the full set (react 19.2.4, sass, visx, radix, phosphor, next) and links `@subtract/ds` → repo root.

## Fresh-clone setup (before re-sync)

1. `cd .ds-sync && npm i esbuild ts-morph @types/react sass playwright` (converter + Layer A + render-check deps; `.ds-sync/` is gitignored/regenerated).
2. `PLAYWRIGHT_BROWSERS_PATH=0 node .ds-sync/node_modules/playwright-core/cli.js install chromium` (the default `~/.cache/ms-playwright` path is blocked in this env; browsers go under `node_modules/.local-browsers`). **Pass `PLAYWRIGHT_BROWSERS_PATH=0` when running `package-validate.mjs`** too, or it won't find chromium.
3. `ln -sfn ../.ds-sync/node_modules .design-sync/node_modules` (fork symlink so `.design-sync/build/layer-a.mjs`'s bare `esbuild`/`sass` imports resolve; gitignored).

## Known render warns (triaged as OK)

- `[FONT_MISSING] "Mono"` — `$font-mono: 'Mono', monospace`; "Mono" is a placeholder label before the `monospace` system fallback, **not a real shipped font**. Accept system monospace. No action.

## Fonts

- Indivisible (brand) is normally injected by the host app via `next/font/local` setting `--font-indivisible`. Tokens fall back to family `'Indivisible'`. `.design-sync/indivisible.css` (wired via `cfg.extraFonts`) declares `@font-face` for `'Indivisible'` from `public/fonts/*.woff2` so bundle previews render on-brand.

## Component surface

- **82 components** discovered = every PascalCase export, incl. compound sub-parts (BoardColumn/Card/…, Dialog*, DropdownMenu*, ExpandPanel*, Sidebar*, ChatComposer*, Tabs' Tab/TabBar, Persona/PersonaAvatar, ChartTooltip*). ~37 are meaningful top-level components; the rest are best shown **composed inside their parent's preview** and otherwise ship floor cards.
- Preview-authoring scope (planned): author `.design-sync/previews/<Name>.tsx` for the ~37 top-level components; compound sub-parts covered via parent composition.
- `bad` on the floor card (need real props/data, in authoring scope): SegmentBar, Skeleton, Slider, TagPill. Sparkline is thin (needs data). SegmentBar renders truly blank until authored.

### Names that differ from intuition (checked 2026-08-03 against `ds-bundle/components/general/`)

Always confirm a component name against the built component dirs before authoring a preview for it — a preview file named after a non-export is silently orphaned (it compiles, but no card ever uses it).

- **There is no `Tabs` component.** `src/components/Tabs/` exports **`TabBar`** and **`Tab`**. Author `TabBar.tsx` / `Tab.tsx`, never `Tabs.tsx`.
- **There is no `Tag` component** — it is **`StatusTag`** (plus `TagPill`, `TagSelector`).
- **There is no `ChartTooltip` component.** The module exports `chartTooltipStyles` (a style object, not a component) plus **`ChartTooltipHeader` / `ChartTooltipBody` / `ChartTooltipRow` / `ChartTooltipDetail`**.
- **`WeightChart` is NOT part of the public API.** `src/components/WeightChart/` exists with its own `index.ts`, but `src/components/index.ts` never re-exports it, so it is absent from the bundle (`grep -c WeightChart ds-bundle/_ds_bundle.js` → 0) and cannot be synced. **Decision 2026-08-03 (user):** leave it out; do not add the export as part of a sync. If the DS exports it later, the next `/design-sync` picks it up with no extra work. Treat it as unexported dead code until then.
- `SuggestionChips` (container) and `SuggestionChip` (item) are both exports; same for `ChatMessageActions`/`ChatMessageAction` and `ButtonGroup`/`ButtonGroupItem`.

## Preview authoring — folded wave-1 learnings (2026-08-03)

### Emitted `.d.ts` is lossy — this matters more than it looks

The uploaded `<Name>.d.ts` **is the API contract the claude.ai/design agent codes against**. Where it under-declares, the agent will believe the component cannot do the thing. Confirmed gaps:

- **`TextInput` / `Textarea` declare only `children/className/id/style/size`.** The real types are `Omit<React.InputHTMLAttributes,'size'>` / `Omit<React.TextareaHTMLAttributes,'size'>` — `placeholder`, `value`, `defaultValue`, `disabled`, `type`, `rows`, `readOnly` all pass through. An agent reading the raw `.d.ts` concludes these fields take no placeholder. **Fixed via `cfg.dtsPropsFor`** (see config) — keep those entries in sync if the components change.
- **`IconButton` / `SegmentedControl` drop native props** (`aria-label`, `disabled`, `onClick`) despite extending `ButtonHTMLAttributes`/`HTMLAttributes`.
- **Dangling type references** — emitted `.d.ts` files are not standalone-compilable: `TagPill`/`TagSelector` reference `Tag`; `SegmentedControl` references `SegmentedControlOption`; `IconButton`/`Select`/`SegmentedControl` reference bare `CSSProperties`; `Header`/`Footer` reference `NavLink`. The files simply never emit an `import` for these. Harmless for previews (esbuild strips types, never typechecks) but real for typed consumers.
  - ⚠️ **Correction to a wave-1 finding:** a subagent reported that `Tag` "is never re-exported from the package entry" and suggested exporting it. **That is wrong — verified 2026-08-03.** `src/components/index.ts:23` has `export type { Tag } from './TagSelector'` and `src/index.ts` is `export * from './components'`, so `Tag` **is** public API. The defect is only that the per-component `.d.ts` omits the import. Do not "fix" the export.
  - Related naming trap: the status chip is `Tag` in `src/components/Tag/` but is exported as **`StatusTag`** (`export { Tag as StatusTag }`, `src/components/index.ts:27`) because the name `Tag` is taken by TagSelector's data type. Props: `tone?: 'active'|'positive'|'warning'|'error'|'neutral'` (default `neutral`), extends `React.HTMLAttributes<HTMLSpanElement>`.
- **`DataTable.d.ts` is the worst offender**: `DataTableProps` has a bare `TData` never introduced as a type parameter, and `ColumnDef`/`RowAction` are not emitted at all. **Read `src/components/DataTable/DataTable.tsx` for the true column contract** (`headerTitle`, `onInfo`, `accessorKey`, `cell`, `sortable`, `width`, `align`).
- `SidebarItem.indent` emits as `0 | 1 | 3 | 2` (source `0 | 1 | 2 | 3`) — cosmetic ordering only.

### Components that render blank/wrong without deliberate props

- **`Slider`** defaults to `defaultValue=[0]` → zero-width range. Every story MUST pass a real `defaultValue`; range mode = a 2-element array (thumb count derives from `.length`).
- **`TagPill`** needs a full `{id,name,color}` tag object; colour is `bg = ${color}1f`, text = `color`, so a pill with no `color` is transparent-on-black. Props are exactly `{tag, size}` — **no `onRemove`/`removable`**; the `+` affordance lives on the TagSelector trigger.
- **`Skeleton`** is a `display:block` span defaulting to `height:14`, `width:auto` — meaningful only as a *composition* of sized instances (card/list-row/paragraph placeholders).
- **`Sidebar`** is `height:100%` with no intrinsic height — it MUST be wrapped in a fixed-height flex frame or it collapses to zero. Usable card frame is ~650px (900×700 viewport − 24px body padding); budget ~165px per group+separator, so a non-scrolling hero fits ≈2 groups + header + footer.
- **`TagSelector` `compact` with zero selected is invisible** (placeholder is `opacity:0` until hover) — every compact story must pass ≥1 selected tag. Its trigger is `width:100%`, so wrap it in a fixed-width parent (280px) or it stretches the card.
- **`Textarea` `rows` clips silently**: md is 17px/1.4 with 14px block padding, so `rows={4}` holds ~4 wrapped lines and overflow is cut with **no visible scrollbar in a capture**. Keep copy short or raise `rows`.

### Interactive state that cannot be previewed statically (deliberately skipped — do not "fix")

- **`ChecklistItem.trailing` AND its drag handle are `opacity:0` until `.item:hover`.** A `WithTrailing` story captured as invisible tags still reserving width, wrapping text around an empty gutter — it was removed, correctly. Do not fake it with injected CSS; it needs either a capture-time forced-hover option or a DS change.
- **`TagSelector`'s popover is unreachable**: `open` is internal `useState` with no `open`/`defaultOpen` passthrough to the Radix root. The richest part of the component (search, option rows, `Create "…"`, empty state) therefore has no card. **DS change request: add `defaultOpen` to `TagSelector`.**
- `NumberInput`'s whole editing model (draft buffer, commit on blur/Enter, ↑/↓ stepping with Shift×10, arithmetic commit `180+20/2` → `190`) — previews pass `value` + no-op `onChange`, the only truthful static render.
- Hover/focus everywhere (Tab hover, IconButton hover+focus ring, ButtonGroupItem focus lift, SegmentedControl's `scale(0.96)` press, DataTable row hover & click-to-sort, DropdownMenu `[data-highlighted]`); `ExpandPanel`/`Dialog` enter-exit motion; `Skeleton`'s 1.6s shimmer (captured at an arbitrary phase — two captures are never byte-identical); `Header`'s sticky axis (nothing scrolls inside a card).
- **No `error`/`invalid` state exists** on TextInput/Textarea/NumberInput — no prop, and no `[aria-invalid]` styling in the modules. If validation styling lands, add an `Error` story to all three.
- `ExpandPanelContent` accepts only `{children,title}` and does not forward Radix Content props, so there is no `onOpenAutoFocus` — every open capture shows the focus ring on the close button. That is real behaviour, graded `good`.

### Composition-source caveats

- **`preview/src/app/DenseShowcase.tsx` contradicts CLAUDE.md's inline-label rule**: it passes `label="Max height"` (three words) to a 28px NumberInput and puts wordy labels (`Name`, `Notes`, `Op`) in a 34px inline column. **CLAUDE.md is the authority** — the authored previews follow the glyph-inside / heading-above rule instead. **Do not resync these previews back to the showcase.** The showcase itself should be fixed by whoever owns `preview/`.
- **`IconButton` and `SegmentedControl` have zero usages in `preview/src`** — authored fresh from component source + CLAUDE.md doctrine. Don't expect a canonical reference for these two.
- The showcase's `SidebarItem avatar` uses `https://i.pravatar.cc/...`. Capture navigates with `waitUntil:'networkidle'`, so **remote images are a hang/flake risk** — previews use the node form (initials span) instead. Never introduce a network-fetched asset into a preview.
- `SegmentedControl size="sm"` is ~30px tall vs the 28px `$control-height-dense` family — visible when adjacent to IconButton/dense fields. Acceptable, but a token decision if it should join the dense family.
- `DropdownMenu` default `align="end"` pushes the menu left of a left-positioned trigger and reads as misaligned in a bare preview; previews pin `align="start"`.

### Card layout overrides applied this run

`Footer`, `TabBar`, `Tab` → `cardMode: column` (full-bleed/wide content clipped at the ~392px grid cell). `ExpandPanel` → `cardMode: single`: `ExpandPanelContent` portals to `document.body` as `position:fixed; inset:8px`, so in a multi-cell grid card the `defaultOpen` overlays stack and bury the other cells (per-story `?story=` captures are unaffected — only the picker card was wrong). Same class as Dialog.

`cardMode: single` renders only ONE story on the product card (primary, else first export alphabetically) while capture still photographs every export via `?story=` — so authoring several stories for a `single` card is safe. `cfg.overrides.<Name>.primaryStory` pins which one shows; DropdownMenu currently defaults to `ExportFormats` alphabetically (`PartActions` is the better canonical if ever pinned).

### DS bugs found while previewing (NOT fixed by the sync — source was never touched)

- **`SidebarSeparator` collapses silently.** `.separator` in `src/components/Sidebar/Sidebar.module.scss` is `height:1px` with **no `flex-shrink:0`**, and is a direct flex child of `.content` (`flex-direction:column; overflow-y:auto`). The moment `SidebarContent` overflows — the normal state for a real sidebar — the divider shrinks to **0px** while its 8px margins remain, so it reads as a missing rule. Measured in-harness: `{height:"0px", flexShrink:"1", bg:"rgb(220,221,215)"}`, scrollHeight 483 vs clientHeight 456. **Fix: add `flex-shrink:0` to `.separator`.** Any consumer with a scrolling sidebar loses its dividers today.
- **`Button variant="gray"` is invisible on light surfaces.** `gray` is `background:#faf9f8` (= `$light`) with a transparent border; `Header`'s bar is `rgba(245,245,247,.8)` and page stages are usually `$light`, so a gray `iconOnly` button renders as a bare floating glyph with no affordance. Doctrine note: **gray needs a white surface underneath.** The Header preview uses `variant="secondary"` instead.
- **`DropdownMenu` is a thin Radix wrapper** exporting only Root/Trigger/Content/Item(+`destructive`)/Separator — no `Label`, `CheckboxItem`, `RadioItem`, `Sub`/`SubTrigger`, or `Shortcut`. A design agent asked for a checked or nested menu item has nothing to compose with.

### Compound sub-parts still on the floor card

`ExpandPanelContent`/`Body`/`Trigger`/`Close` each get their own manifest card and remain unauthored. `ExpandPanelContent` **throws standalone** (a `Radix.Portal` with no Root), so if ever assigned they must be previewed as the full `ExpandPanel` parent composition. Same pattern applies to the Board*/Chat*/Sidebar*/Dialog*/ButtonGroup* sub-parts.

## Preview authoring — folded wave-2 learnings (Board · chat · charts, 2026-08-03)

### Harness facts every future batch will hit

- **`preview-rebuild.mjs` takes ~60–70s PER COMPONENT** (3 components ≈ 3.5 min) — past the default 120s Bash timeout. **Run scoped rebuilds backgrounded.** Every wave-2 agent hit this.
- **The card template sets no `font-family` on `<body>`.** `styles.css` is only two `@import`s and the card HTML sets `body{margin:0;padding:24px;background:#fff}`. Any component whose type is `fontFamily:'inherit'` (all four `ChartTooltip*` parts) therefore renders in the **browser default serif** and grades "not styled" for a purely harness-side reason. Fix in the preview with a `BRAND` constant on your own wrapper: `fontFamily: "var(--font-indivisible, 'Indivisible', sans-serif)"` (the idiom wave-1's TextInput/Textarea previews use). A cheap global fix would be adding that rule to the card template — **not done, deliberately**: it would diverge the preview harness from what a host app actually provides.
- **Animation-phase captures are nondeterministic.** Playwright screenshots with `animations:'allow'`, so `Persona`'s state ring, `TypingIndicator`'s dot bounce and `Skeleton`'s shimmer freeze at an arbitrary phase. A future sheet where `Persona`'s rings are invisible is **not a regression**.

### DS bugs found (source NOT touched by the sync itself)

> **Update 2026-08-03:** the Sidebar separator and FunnelChart band bugs below, plus the stale `CLAUDE.md` §4 tooltip docs, are **fixed in PR #8** (`fix/ds-findings`) — a separate PR from this sync's inputs. Once it merges, **re-sync**: the uploaded bundle was built from `main` *before* those fixes, so claude.ai/design still renders the old behaviour until then. On that re-sync, **re-grade `FunnelChart`** — its `Silhouette` cell was authored assuming the flat-blob rendering, and the fix makes bare `color` produce layered bands. `Button variant="gray"` was left alone (a design decision, not a defect).

- **`FunnelChart` renders flat — the `bands` data is decorative today.** `src/components/FunnelChart/FunnelChart.tsx` (~L139) builds band colours from the `color` prop as a same-hue **alpha** ramp (`0.18 → 1.0`), but `drawOrder = [...bands].reverse()` paints the full-height band FIRST at alpha 1.0. Compositing a low-alpha same-hue band over an opaque same-hue base is a **no-op**, so every inner band is invisible. The repo's own showcase (`page.tsx` 1144-1177) has the same flat result. Two things are wrong: (1) the ramp should vary luminance, or bands should be drawn largest-first with opaque colours; (2) the `colors` prop docstring says *"outermost (lightest) → innermost (darkest)"* but the geometry is the **reverse** — index 0 is the innermost/narrowest band, painted last/on top, so a layered look requires passing the ramp **dark → light**. Affects any consumer using `color` rather than explicit opaque `colors`. **Preview workaround:** `FunnelChart.tsx` always passes an explicit opaque `colors` array ordered dark→light.
- **`ChatMessageAction` is a hard 28×28 square** (`.action` in `ChatMessageActions.module.scss`), so a text label inside overflows the box. **The repo's own showcase does exactly that** at `preview/src/app/ChatShowcase.tsx:320` (`<ChatMessageAction label="Retry">…Retry</ChatMessageAction>`). Previews are icon-only. Text+icon actions would need a width/padding variant on the component.
- `PersonaAvatar` flat mode (`orb={false}`) is `background:$light` with **no border**, so an initials avatar on a `$white` card is a near-invisible disc — only the initials read. Possible polish: a hairline on `.flat`.

### Documentation divergence — `CLAUDE.md` §4 is STALE

`CLAUDE.md` §4 "Chart tooltip pattern" documents a **dark** chip (`background:'#0c0c0c'`, `color:'#fff'`, `borderRadius:8`, `fontSize:13`). The shipped `src/components/ChartTooltip/ChartTooltip.tsx` is the **opposite: a LIGHT shell** — white surface, ink text, 1px `$demure` border, `12px 14px` padding, `$radius-sm`, `0 4px 12px rgba(12,12,12,0.08)`, `maxWidth:280`. Previews follow the source. **`CLAUDE.md` §4 should be rewritten to the light shell** — not edited by this sync (CLAUDE.md is project doctrine, not a sync input).

### `chartTooltipStyles` is `position:absolute` — always override it in a static render

It spreads visx's `defaultStyles` (`position:'absolute'`, `pointer-events:'none'`). Correct inside a chart (placed by `TooltipInPortal`), fatal in a static preview: the chip leaves the flow, the backdrop collapses to its padding, and the tooltip lands at the page's top-left. The working idiom (all four tooltip previews):

```tsx
<div style={{ position:'relative', /* …backdrop… */ fontFamily: BRAND }}>
  <div style={{ ...chartTooltipStyles, position:'static' }}>{…}</div>
</div>
```

`preview/src/app/ChartTooltipPreview.tsx` has the same escape **latent** in it (it sets neither `position:relative` nor an override) — worth a look next time that page is touched.

### Component contracts that surprised the authors

- **`Sparkline` is NOT a wrapper over `LineChart`.** It is a standalone, dependency-free, pure-SVG component: `data: {value:number; label?:string}[]`, `width` (120), `height` (32), `color` (`currentColor`), `fill` (true), `className`. No Visx, no tooltip, **no `uid`**. It **returns `null` when `data.length < 2`** — that plus a missing `data` is why it painted nothing (`[RENDER_THIN]`), not a DS bug. Its `DataPoint` interface is **not exported** (`src/components/Sparkline/index.ts` re-exports only the component) while `LineSeriesData`/`SegmentBarSegment` both are — worth exporting for parity.
- **Two different "sparkline" idioms ship.** `<Sparkline data={…}>` = tiny inline trend (no axes/tooltip, endpoint dot) for KPI tiles and table rows. `<LineChart sparkline>` = the full Visx chart with labels/callouts suppressed — keeps glow, gradient/dot-texture fill, hover tooltips, faint grid; wants ~520×80. Both are previewed.
- `LineChart`'s right-side callout column is clipped to `CALLOUT_MAX_W = 120px` — **series labels must stay short** or they silently clip. Its `dates` prop emits one x-axis label per **month boundary**, so the canonical `CALENDAR_DATA` (30 days inside April 2026) correctly yields exactly one "Apr" label; showing the auto-month feature properly needs a ≥2-month dataset.
- `SegmentBar` was blank purely for want of `segments` + explicit `width` — no DS bug. Its `gap` axis is nearly invisible swept across separate cells at 24px height; one `GapScale` story stacking gap=0/2/6 on identical data reads as a real axis where three sibling cells did not.
- `BubbleMatrix`'s `DEFAULT_COLOR` is already `#11A0FF`, so the showcase's `color="#11A0FF"` "variant" (page.tsx 1030-1041) is a **no-op** — the preview uses `#06D021` so the colour axis actually varies. Calendar mode activates by passing `calendarData` + `month`.
- `GanttChart` in `sparkline` mode **ignores `labelWidth`** (forces 0), so a labelWidth+sparkline cell would not vary.
- **`ChatThread` snaps to the bottom on mount** (`useEffect` → `scrollToBottom('auto')` + a `MutationObserver`), so an overflowing thread renders scrolled to the END. Pass **`autoScroll={false}`** to show a scrolled-back thread with the sticky `ChatThreadScrollButton`. It has no intrinsic height — wrap in a fixed-height panel with `{flex:1, minHeight:0}`.
- `ChatComposerSubmit`'s status enum is exactly `'ready'|'streaming'|'error'`; `disabled` is the separate empty-input look (hence a 4-cell sweep). `.toolbar .submit{margin-left:auto}` — do not add a spacer. `.dockedFrosted` is designed to host a `ChatComposerField` pill, not a bare textarea+toolbar.
- **`TypingIndicator` DOES have an axis**: `bubble?: boolean` (default `true`); `false` drops the surface and tucked radius for a bare dot row.
- `Persona` is `Omit<HTMLAttributes,'role'>` — `role` is the persona's **job title**, not ARIA.
- `SuggestionChips` and `ChatComposer` are `width:100%` with no intrinsic width — the `align` axis is invisible unless wrapped in a fixed-width frame.

### Board specifics

- **`@dnd-kit` is a preview-app dependency and is NOT in the DS bundle** — importing `useSortable`/`CSS`/`DndContext` in a preview fails the build. The DS pieces are purely presentational: `isDragging`, `isOverlay` and `BoardDropIndicator` reproduce the whole drag vocabulary statically.
- **Width budget at the 900×700 capture viewport**: 852px after body padding, ~818px after a light page-surface wrapper. `Board` is `overflow-x:auto`, so anything wider **silently clips the last lane**. Three lanes need `<BoardColumn width={252}>` (3×252 + 2×24 gap = 804); the default 288 fits only two.
- `BoardColumnHeader` takes `color` as a **raw hex string** (it computes `${color}1f` for the pill tint) — `var(--blue)` would break it. Use literal palette values.
- `BoardCardAdd`'s default label is "New page" (Notion heritage) — override via `label=`.

### Card layout overrides added in wave 2

`Sparkline`, `BoardColumn`, `BoardCard`, `ChatComposer` → `cardMode: column`. All are components whose true render is a full-width composition (KPI rows, lanes inside a Board, a 620px composer) that the default `minmax(320px,1fr)` grid would crop via `.ds-cell{overflow:hidden}`. Per-story `?story=` captures are full-bleed, which is why their graded sheets looked correct while the live card would not have.

### Still on the floor card after wave 2 (deliberate, authorable on any re-sync)

`ChatComposerField`, `ChatComposerSubmit`, `ChatComposerTextarea`, `ChatComposerToolbar`, `ChatComposerTools`, `ChatThreadScrollButton` — all six are exercised compositionally inside the authored `ChatComposer.tsx` / `ChatThread.tsx`, so a future wave can **lift those compositions** rather than invent new ones. Same for the `ExpandPanel*`, `Dialog*`, `Sidebar*`, `ButtonGroup*`, `BoardCardMeta/Title/Add`, `SidebarGroupLabel` sub-parts.

## Re-sync risks

- The `next/link` → `<a>` shim and the Indivisible `@font-face` are preview-fidelity substitutes tied to how the host app really loads them; keep in sync if the host font pipeline changes.
- Layer A is a custom build (not the repo's own) — if the DS adds a real library build later, prefer it and update `cfg.buildCmd`/`cfg.cssEntry`.
- `preview/node_modules` linking `@subtract/ds` → repo root means the DS's own components resolve to source; fine for props, but keep preview install fresh.
- **`cfg.dtsPropsFor` is hand-written and will silently rot.** TextInput, Textarea, IconButton, SegmentedControl and DataTable ship props typed by hand because the extractor loses `Omit<…HTMLAttributes>` spreads and generic types. If any of those five components gains, renames or drops a prop, the uploaded `.d.ts` keeps claiming the old contract and the design agent codes against a lie. **On every re-sync, diff those five component sources against the config entries.** Deleting an entry is always safe — it just reverts to the (lossy) auto-extraction.
- **The previews encode DS bugs as workarounds.** `FunnelChart.tsx` passes an explicit opaque `colors` ramp dark→light purely to dodge the flat-band bug; the tooltip previews override `chartTooltipStyles`' `position:absolute`. **If either bug is fixed in `src/`, these previews become misleading** — re-grade them rather than assuming they carry forward. Grades follow preview sources, not component sources, so a DS fix will NOT invalidate them automatically.
- **Preview content is fabrication-domain copy** (print jobs, build plates, filament). If the product's domain shifts, the cards read as stale even though every check still passes — nothing automated will flag this.
- **`Persona`/`TypingIndicator`/`Skeleton` capture at an arbitrary animation phase.** A future sheet that looks different for these three is expected, not a regression.
- **`@dnd-kit` lives only in `preview/`.** If Board's drag behaviour ever moves into the DS itself, the Board previews can show real drag state instead of the static `isDragging`/`isOverlay` substitutes.
- The 34 floor cards are a deliberate baseline, not a defect — see the standing offer in Run status. A re-sync that "fixes" them is optional work, never required.

## ENVIRONMENT — iCloud offloading (RESOLVED 2026-08-03, keep for diagnosis)

- **Symptom (historical):** reads of repo files intermittently returned `EPERM` ("Operation not permitted") and *flapped* — a file was readable right after a build materialized it, then denied again minutes later. Writes were unaffected. This stalled the 2026-08-02 run mid-authoring.
- **Root cause:** the repo lived in `~/Documents/Code/ClawMachine/ds`; `~/Documents` is **iCloud-synced**, and the disk was ~90% full, so macOS offloaded files to dataless placeholders under storage pressure. Every read had to wait on an iCloud re-download.
- **Resolution applied:** the repo was moved out of iCloud to **`~/Code/ClawMachine/ds`** (its current home). Verified 2026-08-03: 400-file read stress across `src/`, `ds-bundle/`, `.ds-sync/lib/` — zero `EPERM`; 41 GiB free. The `mv` preserved the gitignored `dist/`, `ds-bundle/`, `.ds-sync/`, and the relative `.design-sync/node_modules` symlink; playwright's cached `chromium-1234` under `.ds-sync/node_modules/playwright-core/.local-browsers/` survived too, and prior grades still `carried forward`.
- **If it ever recurs:** confirm the repo path is NOT under `~/Documents`/`~/Desktop` (`pwd -P`), then check `df -h /`. Do not attempt to work around flapping reads — move the repo. Alternatives, weaker: free disk + System Settings → [Apple ID] → iCloud → turn off **Optimize Mac Storage** and Finder → **Keep Downloaded**; or disable iCloud "Desktop & Documents Folders" sync.
- **Keep the repo outside iCloud.** A future clone into a synced folder reintroduces this with a confusing signature (looks like random permission bugs in the converter, not a storage issue).

## Run status — FIRST SYNC COMPLETE (2026-08-03)

- **Uploaded and anchored.** Project `cce02a8c-a3cc-4637-984f-5e3b6a136928` ("Subtract DS") — https://claude.ai/design/p/cce02a8c-a3cc-4637-984f-5e3b6a136928. **389 files**: 82 components (`.d.ts` + `.prompt.md` + `.jsx` + `.html` each), 45 compiled previews, 8 fonts, 2 vendor bundles, `_ds_bundle.js`/`.css`, `styles.css`, README, sentinel, and `_ds_sync.json` written **last** as the verification anchor. Deletes: none (project was empty).
- **45 previews authored, every cell graded `good`.** Final driver verdict `ok: true`, all four stages ok, `learningsUnmerged: []`, render check **82/82 clean, 0 bad / 0 thin / 0 variantsIdentical**, 34 floor cards (compound sub-parts — the deliberate baseline). Every grade printed `carried forward`, zero cleared, on the final capture — **the next sync should be fast**.
- Conventions header authored at `.design-sync/conventions.md` and wired via `cfg.readmeHeader`; every component/prop/token it names was validated against the built artifacts (that pass caught a `Tabs` reference that does not exist).
- `cfg.dtsPropsFor` now hand-writes props for **TextInput, Textarea, IconButton, SegmentedControl, DataTable** — the auto-extractor was dropping the entire native-attribute surface and `ColumnDef`/`RowAction`. Keep these in sync if those components change.
- Only remaining validate warn is the pre-triaged `[FONT_MISSING] "Mono"` (see Known render warns).

### Re-sync 2026-08-03/04 — ButtonGroup segmented-control redesign

- Trigger: `main` advanced to `4fcd848 ButtonGroup → segmented control (tinted track + raised white pill)`. Synced **main + these sync inputs**; PR #8's DS fixes deliberately excluded (user's call), so **FunnelChart still renders flat** in the project until #8 merges and a re-sync runs.
- **`.design-sync/` was NOT on `main`** (it lives on the unmerged PR #7 branch), so the re-sync had to run from `design-sync/initial-import` with `main` merged in. **Until #7 merges, every re-sync must do that** — running `/design-sync` from bare `main` finds no config and would be treated as a first-time import, re-authoring all 45 previews from scratch.
- Driver verdict: `ok:true`, `anchor:ok`, **`unchanged:82`, `changed:[]`, `added:[]`, `pendingGrade:[]`**, capture skipped (`empty_worklist`). Upload partition disagreed and was right: `upload.components:["ButtonGroupItem"]`, `bundle:true`, `styling:true`, `deletePaths:[]`. Only `ButtonGroupItem.d.ts` + `.prompt.md` changed as artifacts, plus the bundle/CSS.
- **Why the partitions disagreed, and why it matters.** Grades key off *preview* sources, not component sources — so a pure restyle of a component never lands in `pendingGrade` even though every card's pixels change. That is by design, but it means **a visual redesign silently carries forward stale grades**. Here the carried-forward ButtonGroup notes claimed a *blue tinted* selected state and a "size axis"; both were false after the redesign. Resolved with a deliberate audit (`package-capture.mjs --components … --spot-check-components …`), reading the fresh sheet, and rewriting the notes. **Do this whenever a component's SCSS/TSX changed but `pendingGrade` is empty.**
- **API narrowing caught by the watch-list:** `ButtonGroupItemProps.size` went from `'sm' | 'md'` to `'sm'` only, and the default flipped `md`→`sm`; the SCSS no longer defines `.sm`/`.md` at all. **This is breaking for any consumer passing `size="md"`.** The authored preview only ever passes `size="sm"` or omits it, so nothing became invalid — but `ViewToggle` had *omitted* `size` and therefore silently dropped from md to sm, and no longer demonstrates a size axis (there isn't one). Its grade note now says so.
- ButtonGroup vs SegmentedControl are now visual cousins but still distinguishable: ButtonGroup = squarer tinted track + **raised white pill**; SegmentedControl = fully-rounded pill track + **blue filled thumb**. SegmentedControl was spot-checked in the same pass and all four of its recorded notes still matched the sheet — genuinely unchanged.
- The `dtsPropsFor` drift check (TextInput, Textarea, IconButton, SegmentedControl, DataTable) found **zero source changes** — all five entries still accurate.
- `conventions.md` re-validated against the fresh build: every component, custom property and prop still resolves; it makes no ButtonGroup claims, so no drift and no rebuild was needed.
- The remote sentinel `_ds_needs_recompile` returned **404 before this upload** — the app had opened the project and cleared it, i.e. the first sync was consumed cleanly by the self-check. Expected, not an error.
- Render check stayed 82/82 clean, 0 bad. New anchor `bundleSha12: 0847e3272513` (was `4df2a6862197`).

### Next re-sync — the one command

```sh
# fetch the anchor first
#   DesignSync(get_file, path:"_ds_sync.json") → .design-sync/.cache/remote-sync.json
PLAYWRIGHT_BROWSERS_PATH=0 node .ds-sync/resync.mjs --config .design-sync/config.json \
  --node-modules ./preview/node_modules --entry ./dist/index.js --out ./ds-bundle \
  --remote .design-sync/.cache/remote-sync.json
```

Run `node .design-sync/build/layer-a.mjs` first whenever `src/` changed. Re-copy the staged scripts (`cp -r <skill>/… .ds-sync/`) before running — a stale `.ds-sync/` runs an old converter.

### Standing offer for a future run (floor cards, ~34)

Author previews for the compound sub-parts by **lifting the compositions already written** in the authored parents rather than inventing new ones: `ChatComposer*` (6) from `ChatComposer.tsx`/`ChatThread.tsx`; `ExpandPanel*` (4) from `ExpandPanel.tsx`; `Dialog*` (5) from `Dialog.tsx`; `Sidebar*` (8) from `Sidebar.tsx`; `ButtonGroup*` (3) from `ButtonGroup.tsx`; `BoardCard*`/`BoardColumn*` from the Board previews. Note `ExpandPanelContent` and `DialogContent` **throw standalone** (Radix Portal with no Root) — they must be previewed as the full parent composition.
