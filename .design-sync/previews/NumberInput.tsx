import { NumberInput } from '@subtract/ds'

const DENSE = '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif'

const noop = () => {}

/**
 * Dense heading ABOVE an unlabeled control (Label-1, $ink-light). The idiom for
 * any label wordier than a single glyph — "Wall thickness" would overflow the
 * 28px field, so it becomes a heading and the field stays bare.
 */
function DenseField({ label, children }: { label: string; children: any }) {
  return (
    <label style={{ display: 'block', width: '100%', minWidth: 0 }}>
      <span
        style={{
          display: 'block',
          marginBottom: 4,
          fontFamily: DENSE,
          fontSize: 12.8,
          fontWeight: 500,
          letterSpacing: '-0.025em',
          color: 'var(--ink-light)',
        }}
      >
        {label}
      </span>
      {children}
    </label>
  )
}

function PanelTitle({ children }: { children: any }) {
  return (
    <p style={{ margin: 0, fontFamily: DENSE, fontSize: 12.8, fontWeight: 600, color: 'var(--ink-dark)' }}>
      {children}
    </p>
  )
}

/** Glyph-scale labels live INSIDE the field: W · value · mm reads as one control. */
export function InlineGlyphLabels() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ width: 92 }}>
        <NumberInput size="sm" label="W" suffix="mm" value={42} onChange={noop} aria-label="Width" />
      </div>
      <div style={{ width: 92 }}>
        <NumberInput size="sm" label="H" suffix="mm" value={21} onChange={noop} aria-label="Height" />
      </div>
      <div style={{ width: 92 }}>
        <NumberInput size="sm" label="D" suffix="mm" value={7} onChange={noop} aria-label="Depth" />
      </div>
      <div style={{ width: 84 }}>
        <NumberInput size="sm" label="∠" suffix="°" value={12} onChange={noop} aria-label="Draft angle" />
      </div>
    </div>
  )
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <div style={{ width: 160 }}>
        <DenseField label="md — 44px, Indivisible">
          <NumberInput label="W" suffix="mm" value={42} onChange={noop} aria-label="Width md" />
        </DenseField>
      </div>
      <div style={{ width: 110 }}>
        <DenseField label="sm — 28px, dense">
          <NumberInput size="sm" label="W" suffix="mm" value={42} onChange={noop} aria-label="Width sm" />
        </DenseField>
      </div>
    </div>
  )
}

/** Wordy names never go inside the field — they become the heading above it. */
export function LabelAbove() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', width: 330 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <DenseField label="Wall thickness">
          <NumberInput size="sm" suffix="mm" step={0.2} value={1.2} onChange={noop} aria-label="Wall thickness" />
        </DenseField>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <DenseField label="Layer height">
          <NumberInput size="sm" suffix="mm" step={0.05} value={0.2} onChange={noop} aria-label="Layer height" />
        </DenseField>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <DenseField label="Infill">
          <NumberInput size="sm" suffix="%" step={5} value={15} onChange={noop} aria-label="Infill" />
        </DenseField>
      </div>
    </div>
  )
}

export function States() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <div style={{ width: 100 }}>
        <DenseField label="Clearance">
          <NumberInput size="sm" suffix="mm" step={0.05} value={0.25} onChange={noop} aria-label="Clearance" />
        </DenseField>
      </div>
      <div style={{ width: 100 }}>
        <DenseField label="Infill (0–100)">
          <NumberInput size="sm" suffix="%" min={0} max={100} value={100} onChange={noop} aria-label="Infill clamped" />
        </DenseField>
      </div>
      <div style={{ width: 100 }}>
        <DenseField label="Locked by plate">
          <NumberInput size="sm" label="Z" suffix="mm" value={250} onChange={noop} disabled aria-label="Max height locked" />
        </DenseField>
      </div>
    </div>
  )
}

/** The real surface: Gridfinity's build-plate properties panel. */
export function BuildPlatePanel() {
  return (
    <div
      style={{
        width: 264,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 12,
        background: 'var(--white)',
        border: '1px solid var(--demure)',
        borderRadius: 11,
      }}
    >
      <PanelTitle>Build plate</PanelTitle>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <NumberInput size="sm" label="W" suffix="mm" value={256} onChange={noop} aria-label="Plate width" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <NumberInput size="sm" label="D" suffix="mm" value={256} onChange={noop} aria-label="Plate depth" />
        </div>
      </div>
      <DenseField label="Max object height">
        <NumberInput size="sm" suffix="mm" value={250} onChange={noop} aria-label="Max object height" />
      </DenseField>
      <div style={{ height: 1, margin: '4px 0', background: 'var(--demure)' }} />
      <PanelTitle>Grid</PanelTitle>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <NumberInput size="sm" label="X" value={6} min={1} onChange={noop} aria-label="Grid columns" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <NumberInput size="sm" label="Y" value={6} min={1} onChange={noop} aria-label="Grid rows" />
        </div>
      </div>
    </div>
  )
}
