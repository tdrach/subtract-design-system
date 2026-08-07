import { Sparkline } from '@subtract/ds'

// ─── Demo trends ─────────────────────────────────────────────────────────────

const toPoints = (values: number[], labels?: string[]) =>
  values.map((value, i) => ({ value, label: labels?.[i] }))

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const EXTRUDED = toPoints([540, 505, 420, 488, 652, 568, 496], WEEKDAYS)
const MACHINE_HOURS = toPoints([18, 21, 19, 24, 28, 26, 31], WEEKDAYS)
const FAILED_JOBS = toPoints([6, 5, 5, 4, 4, 2, 3], WEEKDAYS)

const PART_TRENDS: { part: string; process: string; runs: number; trend: number[] }[] = [
  { part: 'Gridfinity 2×2 bin', process: 'FDM',   runs: 412, trend: [12, 18, 15, 24, 31, 28, 44, 52, 49, 61] },
  { part: 'Baseplate 6×4',      process: 'FDM',   runs: 138, trend: [30, 28, 34, 26, 22, 25, 19, 21, 16, 14] },
  { part: 'Hinge bracket v4',   process: 'CNC',   runs:  76, trend: [8, 9, 7, 11, 10, 12, 11, 14, 13, 17] },
  { part: 'Lens cap prototype', process: 'Resin', runs:  24, trend: [4, 3, 6, 5, 9, 7, 6, 8, 5, 4] },
]

// ─── Preview layout glue ─────────────────────────────────────────────────────

function Kpi({
  label,
  value,
  delta,
  color,
  data,
}: {
  label: string
  value: string
  delta: string
  color: string
  data: { value: number; label?: string }[]
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: 16,
        width: 244,
        border: '1px solid var(--demure)',
        borderRadius: 11,
        background: 'var(--white)',
      }}
    >
      <span style={{ fontSize: 12.8, color: 'var(--ink-light)' }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.025rem', color: 'var(--ink-dark)' }}>
        {value}
      </span>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: 12.8, color, whiteSpace: 'nowrap' }}>{delta}</span>
        <Sparkline data={data} color={color} width={96} height={28} />
      </div>
    </div>
  )
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export function KpiRow() {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Kpi label="Filament extruded" value="3,669 g" delta="+12% WoW" color="#06D021" data={EXTRUDED} />
      <Kpi label="Machine hours" value="167 h" delta="+8% WoW" color="#11A0FF" data={MACHINE_HOURS} />
      <Kpi label="Failed jobs" value="29" delta="−4 WoW" color="#FF2111" data={FAILED_JOBS} />
    </div>
  )
}

export function PartLibraryRows() {
  return (
    <div
      style={{
        width: 520,
        border: '1px solid var(--demure)',
        borderRadius: 11,
        overflow: 'hidden',
        background: 'var(--white)',
      }}
    >
      {PART_TRENDS.map((row, i) => (
        <div
          key={row.part}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '12px 16px',
            borderTop: i === 0 ? 'none' : '1px solid var(--demure)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 15, color: 'var(--ink-dark)' }}>{row.part}</span>
            <span style={{ fontSize: 12.8, color: 'var(--ink-light)' }}>{row.process}</span>
          </div>
          <Sparkline data={toPoints(row.trend)} color="#11A0FF" width={120} height={28} />
          <span
            style={{
              fontSize: 12.8,
              color: 'var(--ink-light)',
              width: 64,
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {row.runs} runs
          </span>
        </div>
      ))}
    </div>
  )
}

export function Tones() {
  return (
    <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
      {[
        { label: 'Throughput', color: '#06D021', data: EXTRUDED },
        { label: 'Machine load', color: '#11A0FF', data: MACHINE_HOURS },
        { label: 'Spool level', color: '#FFA811', data: toPoints([92, 84, 77, 66, 58, 44, 31]) },
        { label: 'Failures', color: '#FF2111', data: FAILED_JOBS },
        { label: 'Default (currentColor)', color: undefined, data: MACHINE_HOURS },
      ].map((s) => (
        <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 12.8, color: 'var(--ink-light)' }}>{s.label}</span>
          <Sparkline data={s.data} color={s.color} width={120} height={32} />
        </div>
      ))}
    </div>
  )
}

export function SizesAndFill() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[
        { label: 'width=80 · height=20', width: 80, height: 20, fill: true },
        { label: 'width=120 · height=32 (default)', width: 120, height: 32, fill: true },
        { label: 'width=280 · height=56', width: 280, height: 56, fill: true },
        { label: 'width=280 · height=56 · fill=false', width: 280, height: 56, fill: false },
      ].map((s) => (
        <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 12.8, color: 'var(--ink-light)', width: 240 }}>{s.label}</span>
          <Sparkline data={EXTRUDED} color="#06D021" width={s.width} height={s.height} fill={s.fill} />
        </div>
      ))}
    </div>
  )
}
