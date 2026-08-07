import { Textarea } from '@subtract/ds'

const BRAND = "var(--font-indivisible, 'Indivisible', sans-serif)"
const DENSE = '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif'

function FormField({ label, children }: { label: string; children: any }) {
  return (
    <label style={{ display: 'block', width: '100%' }}>
      <span
        style={{
          display: 'block',
          marginBottom: 6,
          fontFamily: BRAND,
          fontSize: 13,
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

/** Dense heading ABOVE an unlabeled control (Label-1, $ink-light). */
function DenseField({ label, children }: { label: string; children: any }) {
  return (
    <label style={{ display: 'block', width: '100%' }}>
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

export function PrintNotes() {
  return (
    <div style={{ width: 340 }}>
      <FormField label="Print notes">
        <Textarea
          rows={5}
          defaultValue={'PETG-CF · 0.2mm layers · 15% gyroid.\nSmooth PEI plate only — textured leaves a lip.'}
        />
      </FormField>
    </div>
  )
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{ width: 200 }}>
        <DenseField label="md — Indivisible">
          <Textarea rows={3} defaultValue="Dry the filament for 6h at 65°C before this run." />
        </DenseField>
      </div>
      <div style={{ width: 170 }}>
        <DenseField label="sm — dense">
          <Textarea size="sm" rows={3} defaultValue="Dry the filament for 6h at 65°C before this run." />
        </DenseField>
      </div>
    </div>
  )
}

export function States() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 330 }}>
      <FormField label="Handoff notes">
        <Textarea rows={2} placeholder="Tolerances, finishing, packing…" />
      </FormField>
      <FormField label="Slicer overrides">
        <Textarea rows={2} defaultValue="brim_width = 3; support = off" />
      </FormField>
      <FormField label="Vendor spec (read-only)">
        <Textarea rows={2} defaultValue="PETG-CF · 260°C nozzle · 80°C bed" disabled />
      </FormField>
    </div>
  )
}

export function DenseInspector() {
  return (
    <div
      style={{
        width: 264,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 12,
        background: 'var(--white)',
        border: '1px solid var(--demure)',
        borderRadius: 11,
      }}
    >
      <p style={{ margin: 0, fontFamily: DENSE, fontSize: 12.8, fontWeight: 600, color: 'var(--ink-dark)' }}>
        Job notes
      </p>
      <DenseField label="Operator note">
        <Textarea size="sm" rows={3} defaultValue="Second plate of 6. Swap to the spare nozzle if flow drops." />
      </DenseField>
      <DenseField label="Post-processing">
        <Textarea size="sm" rows={2} placeholder="Deburr, tap M3, label…" />
      </DenseField>
    </div>
  )
}
