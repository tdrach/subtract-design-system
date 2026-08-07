import { LineChart } from '@subtract/ds'
import type { LineSeriesData } from '@subtract/ds'

// ─── Print-farm demo data ────────────────────────────────────────────────────

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const EXTRUSION: LineSeriesData[] = [
  {
    id: 'extruded',
    label: 'Extruded',
    color: '#06D021',
    values: [540, 505, 420, 488, 652, 568, 496],
  },
]

const MACHINES: LineSeriesData[] = [
  { id: 'mk4',      label: 'Prusa MK4', color: '#06D021', values: [510, 615, 548, 628, 488, 592, 545] },
  { id: 'x1c',      label: 'Bambu X1C', color: '#38bdf8', values: [400, 462, 378, 448, 492, 418, 430] },
  { id: 'form4',    label: 'Form 4',    color: '#7c3aed', values: [290, 312, 278, 302, 332, 294, 300] },
  { id: 'shapeoko', label: 'Shapeoko',  color: '#f59e0b', values: [185, 212, 172, 195, 228, 184, 198] },
]

// April 2026 — parts coming off the farm each day.
const DAILY_PARTS: { date: string; value: number }[] = [
  { date: '2026-04-01', value:  950 },
  { date: '2026-04-02', value:  650 },
  { date: '2026-04-03', value:  620 },
  { date: '2026-04-04', value:  320 },
  { date: '2026-04-05', value:  260 },
  { date: '2026-04-06', value:  710 },
  { date: '2026-04-07', value: 1100 },
  { date: '2026-04-08', value:  590 },
  { date: '2026-04-09', value:  310 },
  { date: '2026-04-10', value: 1050 },
  { date: '2026-04-11', value:  280 },
  { date: '2026-04-12', value:  270 },
  { date: '2026-04-13', value:  140 },
  { date: '2026-04-14', value:  110 },
  { date: '2026-04-15', value: 1200 },
  { date: '2026-04-16', value:  680 },
  { date: '2026-04-17', value:  980 },
  { date: '2026-04-18', value:  330 },
  { date: '2026-04-19', value:  340 },
  { date: '2026-04-20', value:  350 },
  { date: '2026-04-21', value: 1010 },
  { date: '2026-04-22', value:  320 },
  { date: '2026-04-23', value:  310 },
  { date: '2026-04-24', value:  260 },
  { date: '2026-04-25', value:  170 },
  { date: '2026-04-26', value: 1150 },
  { date: '2026-04-27', value:  960 },
  { date: '2026-04-28', value:  240 },
  { date: '2026-04-29', value:  200 },
  { date: '2026-04-30', value:  180 },
]

const DAILY_SERIES: LineSeriesData[] = [
  {
    id: 'parts',
    label: 'Parts',
    color: '#06D021',
    values: DAILY_PARTS.map((d) => d.value),
  },
]

const DAILY_DATES = DAILY_PARTS.map((d) => d.date)

const grams = (v: number) => `${v} g`
const minutes = (v: number) => `${v} min`

// ─── Panel chrome (preview layout glue only) ─────────────────────────────────

function Panel({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 660 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-dark)' }}>{title}</span>
        <span style={{ fontSize: 12.8, color: 'var(--ink-light)' }}>{meta}</span>
      </div>
      {children}
    </div>
  )
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export function SingleSeries() {
  return (
    <Panel title="Filament extruded" meta="Last 7 days · bench farm">
      <LineChart
        series={EXTRUSION}
        xLabels={WEEKDAYS}
        width={660}
        height={260}
        valueFormat={grams}
        uid="lc-single"
      />
    </Panel>
  )
}

export function MultiSeries() {
  return (
    <Panel title="Machine time by station" meta="Last 7 days · 4 machines">
      <LineChart
        series={MACHINES}
        xLabels={WEEKDAYS}
        width={660}
        height={300}
        valueFormat={minutes}
        uid="lc-multi"
      />
    </Panel>
  )
}

export function DateAxis() {
  return (
    <Panel title="Parts completed" meta="April 2026 · showYAxis=false">
      <LineChart
        series={DAILY_SERIES}
        dates={DAILY_DATES}
        showYAxis={false}
        valueFormat={(v) => String(v)}
        width={660}
        height={160}
        uid="lc-dates"
      />
    </Panel>
  )
}

export function SparklineMode() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 520 }}>
      <span style={{ fontSize: 12.8, color: 'var(--ink-light)' }}>Filament extruded</span>
      <span style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.025rem', color: 'var(--ink-dark)' }}>
        3,669 g
      </span>
      <LineChart series={EXTRUSION} sparkline width={520} height={80} uid="lc-spark" />
    </div>
  )
}
