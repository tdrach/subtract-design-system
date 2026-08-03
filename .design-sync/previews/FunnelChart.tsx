import { FunnelChart } from '@subtract/ds'
import type { FunnelStage } from '@subtract/ds'

// ─── Part pipeline — uploads through to shipped parts ────────────────────────
// `bands` are the stacked sub-bands that make the funnel read as layered.

const PART_PIPELINE: FunnelStage[] = [
  { label: 'Models uploaded', value: 82000, bands: [50, 28, 14, 8] },
  { label: 'Sliced',          value: 21980, bands: [48, 30, 15, 7] },
  { label: 'Queued to print', value: 9400,  bands: [45, 30, 16, 9] },
  { label: 'Parts shipped',   value: 3200,  bands: [42, 32, 17, 9] },
]

// ─── Shop-floor material yield — filament kilos across five stages ───────────

const MATERIAL_YIELD: FunnelStage[] = [
  { label: 'Filament loaded',  value: 1840, bands: [46, 30, 15, 9] },
  { label: 'Extruded',         value: 1210, bands: [44, 31, 16, 9] },
  { label: 'In finished parts', value: 640, bands: [43, 31, 17, 9] },
  { label: 'Passed QA',        value: 415,  bands: [41, 32, 18, 9] },
  { label: 'Shipped',          value: 302,  bands: [40, 32, 18, 10] },
]

// Band colors are indexed innermost → outermost, so the ramp runs dark → light.
// Opaque values keep each band readable; a same-hue alpha ramp composites away.

const VIOLET_BANDS = ['#3b0d92', '#5b21b6', '#8b5cf6', '#c4b5fd']
const BLUE_BANDS   = ['#04385c', '#0b6ba8', '#11A0FF', '#7dd3fc', '#d6efff']
const GREEN_BANDS  = ['#04561a', '#06901f', '#06D021', '#a9f2b4']

// ─── Stories ─────────────────────────────────────────────────────────────────

export function PartPipeline() {
  return (
    <FunnelChart
      stages={PART_PIPELINE}
      colors={VIOLET_BANDS}
      width={560}
      height={240}
      uid="fc-pipeline"
    />
  )
}

export function FiveLayers() {
  return (
    <FunnelChart
      stages={PART_PIPELINE}
      colors={BLUE_BANDS}
      layerCount={5}
      width={560}
      height={240}
      uid="fc-layers"
    />
  )
}

export function MaterialYield() {
  return (
    <FunnelChart
      stages={MATERIAL_YIELD}
      colors={GREEN_BANDS}
      width={620}
      height={240}
      valueFormat={(v) => `${v.toLocaleString()} kg`}
      uid="fc-yield"
    />
  )
}

export function Silhouette() {
  return (
    <FunnelChart
      stages={PART_PIPELINE}
      color="#FFA811"
      width={520}
      height={110}
      showBadges={false}
      uid="fc-silhouette"
    />
  )
}

export function InCard() {
  return (
    <div
      style={{
        width: 600,
        padding: 20,
        background: 'var(--white)',
        border: '1px solid var(--demure)',
        borderRadius: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.025rem', color: 'var(--ink-dark)' }}>
          Part pipeline
        </span>
        <span style={{ fontSize: 12.8, color: 'var(--ink-light)' }}>Q2 · all workspaces</span>
      </div>
      <p style={{ fontSize: 12.8, color: 'var(--ink-light)', margin: '0 0 8px' }}>
        Uploaded → sliced → queued → shipped. 3.9% of uploads reach a shipped part.
      </p>
      <FunnelChart
        stages={PART_PIPELINE}
        colors={BLUE_BANDS.slice(1)}
        width={560}
        height={190}
        uid="fc-card"
      />
      <div
        style={{
          display: 'flex',
          gap: 28,
          marginTop: 12,
          paddingTop: 12,
          borderTop: '1px solid var(--demure)',
          fontSize: 12.8,
          color: 'var(--ink-light)',
        }}
      >
        <span>Uploaded 82,000</span>
        <span>Sliced 21,980</span>
        <span>Queued 9,400</span>
        <span>Shipped 3,200</span>
      </div>
    </div>
  )
}
