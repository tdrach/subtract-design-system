import { StatusTag } from '@subtract/ds'

export function Tones() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <StatusTag tone="active">Printing</StatusTag>
      <StatusTag tone="positive">Complete</StatusTag>
      <StatusTag tone="warning">Low filament</StatusTag>
      <StatusTag tone="error">Failed</StatusTag>
      <StatusTag tone="neutral">Queued</StatusTag>
    </div>
  )
}

export function PrintQueue() {
  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: '10px 0',
    borderBottom: '1px solid var(--demure)',
  }
  const nameStyle: React.CSSProperties = { fontSize: 14, color: 'var(--ink-dark)' }
  const metaStyle: React.CSSProperties = { fontSize: 12, color: 'var(--ink-light)', marginTop: 2 }

  return (
    <div style={{ width: 340 }}>
      <div style={rowStyle}>
        <div>
          <div style={nameStyle}>Gridfinity build-plate ×12</div>
          <div style={metaStyle}>Prusa MK4 · PETG · 4h 12m left</div>
        </div>
        <StatusTag tone="active">Printing</StatusTag>
      </div>
      <div style={rowStyle}>
        <div>
          <div style={nameStyle}>Hinge bracket v3</div>
          <div style={metaStyle}>Bambu X1C · PLA · finished 09:41</div>
        </div>
        <StatusTag tone="positive">Complete</StatusTag>
      </div>
      <div style={{ ...rowStyle, borderBottom: 'none' }}>
        <div>
          <div style={nameStyle}>Enclosure lid (draft)</div>
          <div style={metaStyle}>Bambu X1C · first layer lifted</div>
        </div>
        <StatusTag tone="error">Failed</StatusTag>
      </div>
    </div>
  )
}

export function InlineWithHeading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 320 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 17, fontWeight: 500, color: 'var(--ink-dark)' }}>
          Wall thickness
        </span>
        <StatusTag tone="warning">Below nozzle Ø</StatusTag>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 17, fontWeight: 500, color: 'var(--ink-dark)' }}>
          Mesh check
        </span>
        <StatusTag tone="positive">Watertight</StatusTag>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 17, fontWeight: 500, color: 'var(--ink-dark)' }}>
          Export STL
        </span>
        <StatusTag>Not run</StatusTag>
      </div>
    </div>
  )
}
