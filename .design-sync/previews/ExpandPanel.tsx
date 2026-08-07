import {
  ExpandPanel,
  ExpandPanelTrigger,
  ExpandPanelContent,
  ExpandPanelBody,
  ExpandPanelClose,
  Button,
} from '@subtract/ds'
import { ArrowsOut, DownloadSimple } from '@phosphor-icons/react'

const STATS: [string, string][] = [
  ['Plate size', '252 × 168 mm'],
  ['Bins placed', '24'],
  ['Layer height', '0.2 mm'],
  ['Est. print time', '3 h 20 m'],
]

export function ExpandedProject() {
  return (
    <ExpandPanel defaultOpen>
      <ExpandPanelTrigger asChild>
        <Button variant="gray" size="sm" iconAfter={<ArrowsOut size={14} weight="bold" />}>
          Expand
        </Button>
      </ExpandPanelTrigger>
      <ExpandPanelContent title="Gridfinity build-plate — 6 × 4">
        <ExpandPanelBody>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', marginBottom: 32 }}>
            {STATS.map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 13, color: 'var(--ink-light)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 600 }}>{value}</div>
              </div>
            ))}
          </div>
          <p style={{ maxWidth: 620, color: 'var(--ink-light)', lineHeight: 1.6 }}>
            The plate is generated from the 42 mm Gridfinity pitch with a 0.25 mm
            clearance on every bin wall. Re-slice after changing wall thickness —
            the exported STL is watertight but not re-scaled.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 32 }}>
            <Button variant="primary" iconBefore={<DownloadSimple size={16} weight="bold" />}>
              Export STL
            </Button>
            <ExpandPanelClose asChild>
              <Button variant="gray">Close</Button>
            </ExpandPanelClose>
          </div>
        </ExpandPanelBody>
      </ExpandPanelContent>
    </ExpandPanel>
  )
}

export function NarrowBody() {
  return (
    <ExpandPanel defaultOpen>
      <ExpandPanelTrigger asChild>
        <Button variant="gray" size="sm">
          Open slicer log
        </Button>
      </ExpandPanelTrigger>
      <ExpandPanelContent title="Print log — Prusa MK4 · Job 214">
        <ExpandPanelBody narrow>
          <h3 style={{ fontSize: 28, marginBottom: 16 }}>Job completed</h3>
          <p style={{ color: 'var(--ink-light)', lineHeight: 1.6, marginBottom: 24 }}>
            24 Gridfinity bins printed in a single pass on the textured sheet.
            Bed 60 °C, nozzle 215 °C, 18 % gyroid infill. No layer shifts
            detected by the first-layer camera check.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              borderTop: '1px solid var(--demure)',
              paddingTop: 16,
              fontSize: 15,
              color: 'var(--ink-light)',
            }}
          >
            <div>08:12 — Heating bed to 60 °C</div>
            <div>08:19 — First layer verified</div>
            <div>10:04 — Filament change: Prusament PLA Galaxy Black</div>
            <div>11:32 — Job finished · 84 g used</div>
          </div>
        </ExpandPanelBody>
      </ExpandPanelContent>
    </ExpandPanel>
  )
}

export function Collapsed() {
  return (
    <div
      style={{
        width: 420,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        border: '1px solid var(--demure)',
        borderRadius: 12,
        background: 'var(--white)',
        padding: 16,
      }}
    >
      <div>
        <div style={{ fontWeight: 600 }}>Gridfinity build-plate</div>
        <div style={{ fontSize: 13, color: 'var(--ink-light)', marginTop: 2 }}>
          6 × 4 · 24 bins · ready to slice
        </div>
      </div>
      <ExpandPanel>
        <ExpandPanelTrigger asChild>
          <Button variant="gray" size="sm" iconAfter={<ArrowsOut size={14} weight="bold" />}>
            Expand
          </Button>
        </ExpandPanelTrigger>
        <ExpandPanelContent title="Gridfinity build-plate — 6 × 4">
          <ExpandPanelBody>
            <p style={{ color: 'var(--ink-light)', lineHeight: 1.6 }}>
              The full-screen inspector for this plate.
            </p>
          </ExpandPanelBody>
        </ExpandPanelContent>
      </ExpandPanel>
    </div>
  )
}
