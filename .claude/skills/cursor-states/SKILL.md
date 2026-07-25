---
name: cursor-states
description: >-
  Give every interactive state its correct cursor — pointer, grab/grabbing,
  resize directions, crosshair, text, help, not-allowed — and audit that each
  state a component or gesture can reach declares one. Use when building or
  reviewing ANY interactive surface: DS components (buttons, inputs, handles),
  canvas gestures (drag, rotate, resize, pan, draw), pickable 3D geometry, or
  when something "feels unresponsive"/"cursor looks wrong". Trigger on:
  cursor, grabber, grab/grabbing, hover state, drag handle, resize handle,
  pointer state, disabled cursor.
---

# Cursor states — the cursor is part of the state machine

A cursor is a CONTRACT: it announces what a press will do, then confirms the
gesture while it runs. Treat it like any other component state — enumerated,
owned, tested — never decoration. Every interactive element ships a table:
each state it can reach × the cursor it shows.

## The vocabulary (semantic, not aesthetic)

| Cursor | Means | Use on |
| --- | --- | --- |
| `default` | inert | non-interactive content, overlays masking blocked UI |
| `pointer` | click acts here | buttons, links, toggles, menu items, pickable edges/dots |
| `grab` | this can be carried | HOVER over pan surfaces, rotate grips, draggable cards |
| `grabbing` | you are carrying it | the WHOLE live drag: pan, orbit, rotate, card in flight |
| `move` | translating a selection | canvas move drags of selected shapes |
| `ns/ew/nesw/nwse-resize` | stretch this way | resize handles — direction must match the HANDLE'S WORLD ANGLE (rotate the mapping when the element is rotated) |
| `col-resize` / `row-resize` | divider | panel splitters, column dividers |
| `crosshair` | you are about to create | drawing tools (rect, ellipse, pen) |
| `text` | insertion point | text fields and inline editors, styled ones included |
| `help` | explanation lives here | info tips (the ⓘ) |
| `not-allowed` | visible but refuses | disabled targets that keep their footprint |
| `wait` / `progress` | blocked / busy behind | almost never — prefer inline spinners; never during drags |

Custom image cursors only when the OS vocabulary has no word for the tool
(e.g. an eyedropper) — always with a hotspot and a keyword fallback.

## The five rules

1. **Active gestures own the cursor — from drag state, never hover.** During
   any drag, the pointer leaves the handle (rotation sweeps it in an arc;
   fast pans outrun it). Hover styling cannot carry the gesture. Derive the
   surface's cursor from the drag state machine and hold it until release:

   ```tsx
   // the canvas root — one owner, priority-ordered
   const cursor = tool !== 'select'
     ? 'crosshair'
     : (drag?.kind === 'pan' || drag?.kind === 'rotate' || drag?.kind === 'groupRotate' || spaceHeld
       ? 'grabbing'
       : hoverCursor) // ...which individual handles feed on hover
   ```

   This is the Flatland Canvas2D pattern; the rotate-grip bug (cursor
   reverting to default mid-turn) is what happens when rule 1 is skipped.

2. **Hover promises what press delivers.** `grab` must become `grabbing` on
   press; `pointer` must click something real. Never advertise an affordance
   the state won't honor — and never omit one it will (a pickable 3D edge
   shows `pointer` before it glows).

3. **Disabled stays honest.** A disabled control that keeps its footprint
   shows `not-allowed` and suppresses hover affordances (no pointer, no grab,
   no tooltip-bait). A control that is merely inert (label, meta text) shows
   `default` — `not-allowed` is a refusal, not a shrug.

4. **Direction cursors follow geometry.** Resize cursors map handle → world
   angle → nearest of the four direction cursors. When the element (or an
   oriented selection frame) is rotated, the mapping rotates with it —
   `handleCursor(handle, rotationDeg)` exists for exactly this; never
   hard-code `nwse-resize` on a corner.

5. **One owner per surface.** The topmost interactive layer decides; parents
   don't fight children. Global gesture overrides (rule 1) live on the
   surface root and beat hover by construction. Overlays that block input
   also blank the cursor story underneath (`default` on the scrim).

## Repo idioms

- **DS components own their cursors** — consumers never re-declare them.
  Button/IconButton/SegmentedControl/Select/menu items: `pointer`, and
  `not-allowed` + no hover treatment when `disabled`. Text inputs (incl.
  dense NumberInput/TextInput): `text` over the field. InfoTip: `help`.
  A new interactive component doesn't merge without its cursor block.
- **Canvas surfaces** compute ONE `cursor` value (rule 1 shape) applied to
  the root element; handles/dots set hover intent (`data-` attrs or hover
  callbacks), the root arbitrates.
- **three.js surfaces** set `renderer.domElement.style.cursor` imperatively:
  `pointer` over pick targets, `''` off them; orbit/pan gestures follow
  rule 1 with grab/grabbing on the same element.

## The audit (run per component / per review)

1. Enumerate states: idle, hover, focus (no cursor change — focus is not a
   pointer state), pressed/dragging, disabled, busy, per-tool modes.
2. Fill the state × cursor table; every row cites the rule it satisfies.
3. Grep the gaps: `cursor:` in styles, `style.cursor` / `hoverCursor` /
   `data-handle` / `data-rotate` in code — anything interactive with no
   declared cursor in some state is a finding.
4. Drive the real gestures (don't trust hover alone): press-and-hold each
   handle, drag PAST the handle's bounds, release outside the surface, tab
   to focus, disable the control. The cursor must be correct at every frame.
