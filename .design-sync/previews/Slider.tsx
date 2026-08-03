import { Slider } from '@subtract/ds'

// Layout glue only — the DS supplies every control style.
const rowLabel: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: 12,
  marginBottom: 8,
  fontSize: 13,
  letterSpacing: '-0.02rem',
}

const value: React.CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
  color: 'var(--ink-light)',
}

export function Default() {
  return (
    <div style={{ width: '100%', maxWidth: 280 }}>
      <div style={rowLabel}>
        <span>Infill density</span>
        <span style={value}>35%</span>
      </div>
      <Slider defaultValue={[35]} aria-label="Infill density" />
    </div>
  )
}

export function Range() {
  return (
    <div style={{ width: '100%', maxWidth: 280 }}>
      <div style={rowLabel}>
        <span>Layer range</span>
        <span style={value}>24 – 78</span>
      </div>
      <Slider defaultValue={[24, 78]} min={0} max={120} aria-label="Layer range" />
    </div>
  )
}

export function Stepped() {
  return (
    <div style={{ width: '100%', maxWidth: 280 }}>
      <div style={rowLabel}>
        <span>Wall thickness</span>
        <span style={value}>1.6 mm</span>
      </div>
      <Slider defaultValue={[16]} min={4} max={20} step={2} aria-label="Wall thickness" />
      <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--ink-light)' }}>
        step&nbsp;=&nbsp;0.2&nbsp;mm — snaps to nozzle multiples
      </p>
    </div>
  )
}

export function Disabled() {
  return (
    <div style={{ width: '100%', maxWidth: 280 }}>
      <div style={rowLabel}>
        <span>Print speed</span>
        <span style={value}>Locked by profile</span>
      </div>
      <Slider defaultValue={[62]} disabled aria-label="Print speed" />
    </div>
  )
}

export function PrintSettings() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 280,
        background: 'var(--white)',
        border: '1px solid var(--demure)',
        borderRadius: 8,
        padding: 16,
      }}
    >
      <p style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, letterSpacing: '-0.03rem' }}>
        Gridfinity bin 2×1
      </p>

      <div style={{ marginBottom: 18 }}>
        <div style={rowLabel}>
          <span>Layer height</span>
          <span style={value}>0.20 mm</span>
        </div>
        <Slider defaultValue={[20]} min={8} max={32} step={4} aria-label="Layer height" />
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={rowLabel}>
          <span>Infill density</span>
          <span style={value}>15%</span>
        </div>
        <Slider defaultValue={[15]} aria-label="Infill density" />
      </div>

      <div>
        <div style={rowLabel}>
          <span>Wall loops</span>
          <span style={value}>4</span>
        </div>
        <Slider defaultValue={[4]} min={1} max={8} step={1} aria-label="Wall loops" />
      </div>
    </div>
  )
}
