import { GanttChart } from '@subtract/ds'
import type { GanttTask } from '@subtract/ds'

// ─── Fabrication programme — day offsets from kickoff ────────────────────────

const BUILD_TASKS: GanttTask[] = [
  { id: 'cad',     label: 'CAD model',      start: 0,  end: 14, color: '#11A0FF' },
  { id: 'slice',   label: 'Slice + preview', start: 10, end: 28, color: '#7c3aed' },
  { id: 'print',   label: 'Print run',      start: 24, end: 56, color: '#06D021' },
  { id: 'finish',  label: 'Post-process',   start: 50, end: 64, color: '#FFA811' },
  { id: 'ship',    label: 'QA + ship',      start: 62, end: 70, color: '#FF2111' },
]

// ─── Overnight machine allocation — hours on a 24h clock ─────────────────────

const MACHINE_SLOTS: GanttTask[] = [
  { id: 'mk4',   label: 'Prusa MK4',    start: 1,  end: 9,  color: '#11A0FF' },
  { id: 'x1c',   label: 'Bambu X1C',    start: 0,  end: 5,  color: '#06D021' },
  { id: 'voron', label: 'Voron 2.4',    start: 4,  end: 17, color: '#7c3aed' },
  { id: 'form4', label: 'Form 4',       start: 12, end: 20, color: '#FFA811' },
  { id: 'shape', label: 'Shapeoko 5',   start: 18, end: 23, color: '#FF2111' },
]

const hourLabel = (v: number) => `${String(v).padStart(2, '0')}:00`

// ─── Stories ─────────────────────────────────────────────────────────────────

export function BuildSchedule() {
  return (
    <GanttChart
      tasks={BUILD_TASKS}
      width={520}
      valueFormat={(v) => `Day ${v}`}
      uid="gc-build"
    />
  )
}

export function MachineAllocation() {
  return (
    <GanttChart
      tasks={MACHINE_SLOTS}
      width={600}
      rowHeight={34}
      labelWidth={110}
      domain={[0, 24]}
      tickCount={7}
      valueFormat={hourLabel}
      uid="gc-machines"
    />
  )
}

export function Sparkline() {
  return (
    <GanttChart
      tasks={BUILD_TASKS}
      width={520}
      height={80}
      sparkline
      uid="gc-spark"
    />
  )
}

export function InCard() {
  return (
    <div
      style={{
        width: 560,
        padding: 20,
        background: 'var(--white)',
        border: '1px solid var(--demure)',
        borderRadius: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.025rem', color: 'var(--ink-dark)' }}>
          Enclosure v4 — programme
        </span>
        <span style={{ fontSize: 12.8, color: 'var(--ink-light)' }}>70 days</span>
      </div>
      <p style={{ fontSize: 12.8, color: 'var(--ink-light)', margin: '0 0 12px' }}>
        Five stages from CAD lock to shipped parts. Print run is the critical path.
      </p>
      <GanttChart
        tasks={BUILD_TASKS}
        width={520}
        rowHeight={32}
        valueFormat={(v) => `Day ${v}`}
        uid="gc-card"
      />
    </div>
  )
}
