import { Select } from '@subtract/ds'

// Layout glue only — the DS supplies every control style.
const denseLabel: React.CSSProperties = {
  display: 'block',
  marginBottom: 4,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: 12.8,
  fontWeight: 500,
  letterSpacing: '-0.025rem',
  color: 'var(--ink-light)',
}

const caption: React.CSSProperties = {
  display: 'block',
  marginBottom: 6,
  fontSize: 12,
  letterSpacing: '-0.01rem',
  color: 'var(--ink-light)',
}

export function Default() {
  return (
    <div style={{ width: '100%', maxWidth: 260 }}>
      <Select defaultValue="p1s" aria-label="Printer">
        <option value="p1s">Bambu Lab P1S</option>
        <option value="x1c">Bambu Lab X1C</option>
        <option value="a1m">Bambu Lab A1 mini</option>
        <option value="mk4">Prusa MK4</option>
      </Select>
    </div>
  )
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 260 }}>
      <div>
        <span style={caption}>md — 44px, Indivisible</span>
        <Select defaultValue="pla" aria-label="Material, medium">
          <option value="pla">PLA Matte — Charcoal</option>
          <option value="petg">PETG — Translucent</option>
          <option value="asa">ASA — Slate Grey</option>
        </Select>
      </div>
      <div>
        <span style={caption}>sm — 28px dense, SF Pro</span>
        <Select size="sm" defaultValue="pla" aria-label="Material, dense">
          <option value="pla">PLA Matte — Charcoal</option>
          <option value="petg">PETG — Translucent</option>
          <option value="asa">ASA — Slate Grey</option>
        </Select>
      </div>
    </div>
  )
}

export function DenseInspector() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 260,
        background: 'var(--white)',
        border: '1px solid var(--demure)',
        borderRadius: 8,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div>
        <span style={denseLabel}>Build plate</span>
        <Select size="sm" defaultValue="p1s" aria-label="Build plate">
          <option value="p1s">Bambu Lab P1S — 256mm</option>
          <option value="x1c">Bambu Lab X1C — 256mm</option>
          <option value="a1m">Bambu Lab A1 mini — 180mm</option>
        </Select>
      </div>
      <div>
        <span style={denseLabel}>Boolean operation</span>
        <Select size="sm" defaultValue="subtract" aria-label="Boolean operation">
          <option value="union">Union</option>
          <option value="subtract">Subtract</option>
          <option value="intersect">Intersect</option>
        </Select>
      </div>
      <div>
        <span style={denseLabel}>Infill pattern</span>
        <Select size="sm" defaultValue="gyroid" aria-label="Infill pattern">
          <option value="gyroid">Gyroid</option>
          <option value="grid">Grid</option>
          <option value="honeycomb">Honeycomb</option>
        </Select>
      </div>
    </div>
  )
}

export function Disabled() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 260 }}>
      <div>
        <span style={caption}>md — disabled</span>
        <Select defaultValue="locked" disabled aria-label="Nozzle, locked">
          <option value="locked">0.4 mm nozzle (locked)</option>
        </Select>
      </div>
      <div>
        <span style={caption}>sm — disabled</span>
        <Select size="sm" defaultValue="locked" disabled aria-label="Profile, locked">
          <option value="locked">Inherited from project</option>
        </Select>
      </div>
    </div>
  )
}
