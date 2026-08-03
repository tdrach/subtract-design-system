// NOTE: the drag handle and the `trailing` slot are hover-revealed (opacity 0
// at rest), so neither can be shown in a static card. `dragHandleProps` is
// still passed on the hero rows — that is the true rendering of a sortable
// checklist at rest. `trailing` takes any node (a StatusTag, a due date, a
// "···" menu) and fades in on row hover.
import { ChecklistItem } from '@subtract/ds'

// Layout glue only — the DS supplies every row style.
const list: React.CSSProperties = {
  width: '100%',
  maxWidth: 360,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
}

const caption: React.CSSProperties = {
  display: 'block',
  margin: '0 0 6px 14px',
  fontSize: 12,
  letterSpacing: '-0.01rem',
  color: 'var(--ink-light)',
}

export function Checklist() {
  return (
    <div style={list}>
      <ChecklistItem checked done dragHandleProps={{}}>
        Level the bed and run flow calibration
      </ChecklistItem>
      <ChecklistItem checked done dragHandleProps={{}}>
        Slice the Gridfinity 2×1 bin at 0.2 mm
      </ChecklistItem>
      <ChecklistItem dragHandleProps={{}}>
        Export STL for the Flatland bracket revision
      </ChecklistItem>
      <ChecklistItem dragHandleProps={{}}>
        Order 1 kg matte PLA — Charcoal
      </ChecklistItem>
    </div>
  )
}

export function States() {
  return (
    <div style={list}>
      <span style={caption}>open</span>
      <ChecklistItem>Dry the ASA spool before the overnight run</ChecklistItem>

      <span style={{ ...caption, marginTop: 12 }}>checked</span>
      <ChecklistItem checked>Reprint the build-plate spacer at 4 walls</ChecklistItem>

      <span style={{ ...caption, marginTop: 12 }}>checked + done</span>
      <ChecklistItem checked done>Reprint the build-plate spacer at 4 walls</ChecklistItem>
    </div>
  )
}

export function TaskPanel() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 360,
        background: 'var(--white)',
        border: '1px solid var(--demure)',
        borderRadius: 8,
        padding: '14px 6px 10px',
      }}
    >
      <p
        style={{
          margin: '0 0 8px 14px',
          fontSize: 12.8,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--ink-light)',
        }}
      >
        Pre-print checks
      </p>
      <ChecklistItem checked done>Purge line clears the plate</ChecklistItem>
      <ChecklistItem checked done>Filament dried above 45 °C</ChecklistItem>
      <ChecklistItem>Supports enabled for the overhang lip</ChecklistItem>
      <ChecklistItem>Plate exported to the P1S queue</ChecklistItem>
    </div>
  )
}
