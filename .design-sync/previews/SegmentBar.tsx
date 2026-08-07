import { SegmentBar } from '@subtract/ds'
import type { SegmentBarSegment } from '@subtract/ds'

// ─── Demo data ───────────────────────────────────────────────────────────────

const MATERIALS: SegmentBarSegment[] = [
  { id: 'pla',   label: 'PLA',   value: 42, color: '#11A0FF' },
  { id: 'petg',  label: 'PETG',  value: 28, color: '#06D021' },
  { id: 'tpu',   label: 'TPU',   value: 18, color: '#FFA811' },
  { id: 'resin', label: 'Resin', value: 12, color: '#7c3aed' },
]

const PLATE: SegmentBarSegment[] = [
  { id: 'bins',     label: 'Gridfinity bins', value: 58, color: '#11A0FF' },
  { id: 'brackets', label: 'Hinge brackets',  value: 24, color: '#7c3aed' },
  { id: 'free',     label: 'Free plate',      value: 18, color: '#DCDDD7' },
]

const BAYS: { name: string; machine: string; segments: SegmentBarSegment[] }[] = [
  {
    name: 'Bay A',
    machine: 'Prusa MK4',
    segments: [
      { id: 'run',  label: 'Printing',    value: 68, color: '#06D021' },
      { id: 'idle', label: 'Idle',        value: 22, color: '#DCDDD7' },
      { id: 'srv',  label: 'Maintenance', value: 10, color: '#FFA811' },
    ],
  },
  {
    name: 'Bay B',
    machine: 'Bambu X1C',
    segments: [
      { id: 'run',  label: 'Printing',    value: 81, color: '#06D021' },
      { id: 'idle', label: 'Idle',        value: 14, color: '#DCDDD7' },
      { id: 'srv',  label: 'Maintenance', value:  5, color: '#FFA811' },
    ],
  },
]

// ─── Preview layout glue ─────────────────────────────────────────────────────

function Legend({ segments, unit }: { segments: SegmentBarSegment[]; unit: string }) {
  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      {segments.map((seg) => (
        <span key={seg.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: seg.color, flexShrink: 0 }} />
          <span style={{ color: 'var(--ink-dark)' }}>{seg.label}</span>
          <span style={{ color: 'var(--ink-light)' }}>{seg.value}{unit}</span>
        </span>
      ))}
    </div>
  )
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export function MaterialMix() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 640 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-dark)' }}>Filament by material</span>
        <span style={{ fontSize: 12.8, color: 'var(--ink-light)' }}>100 kg this month</span>
      </div>
      <SegmentBar
        segments={MATERIALS}
        width={640}
        valueFormat={(v) => `${v} kg`}
        uid="sb-materials"
      />
      <Legend segments={MATERIALS} unit=" kg" />
    </div>
  )
}

export function CompactPill() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: 560 }}>
      {BAYS.map((bay) => (
        <div key={bay.name} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 15, color: 'var(--ink-dark)' }}>
              {bay.name} <span style={{ color: 'var(--ink-light)' }}>· {bay.machine}</span>
            </span>
            <span style={{ fontSize: 12.8, color: 'var(--ink-light)' }}>{bay.segments[0].value}% utilised</span>
          </div>
          <SegmentBar
            segments={bay.segments}
            width={560}
            height={12}
            gap={1}
            radius={4}
            valueFormat={(v) => `${v}%`}
            uid={`sb-bay-${bay.name.replace(/\s/g, '')}`}
          />
        </div>
      ))}
    </div>
  )
}

export function GapScale() {
  const rows = [
    { label: 'gap=0 — flush', gap: 0, uid: 'sb-gap0' },
    { label: 'gap=2 — default', gap: 2, uid: 'sb-gap2' },
    { label: 'gap=6 — separated', gap: 6, uid: 'sb-gap6' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 640 }}>
      {rows.map((row) => (
        <div key={row.uid} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 12.8, color: 'var(--ink-light)' }}>{row.label}</span>
          <SegmentBar
            segments={MATERIALS}
            width={640}
            gap={row.gap}
            valueFormat={(v) => `${v} kg`}
            uid={row.uid}
          />
        </div>
      ))}
    </div>
  )
}

export function PlateAllocation() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 640 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-dark)' }}>Build plate 256 × 256</span>
        <span style={{ fontSize: 12.8, color: 'var(--ink-light)' }}>82% packed</span>
      </div>
      <SegmentBar
        segments={PLATE}
        width={640}
        height={32}
        gap={3}
        radius={8}
        valueFormat={(v) => `${v}%`}
        uid="sb-plate"
      />
      <Legend segments={PLATE} unit="%" />
    </div>
  )
}
