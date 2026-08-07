import { TextInput } from '@subtract/ds'

const BRAND = "var(--font-indivisible, 'Indivisible', sans-serif)"
const DENSE = '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif'

/** Form label above an `md` field — Indivisible, the brand voice. */
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

/**
 * Dense heading ABOVE an unlabeled control (Label-1, $ink-light) — the idiom
 * for any label too wordy to sit inside a 28px field.
 */
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

export function ProjectForm() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 340 }}>
      <FormField label="Project name">
        <TextInput defaultValue="Gridfinity Bin 2×1" />
      </FormField>
      <FormField label="Export folder">
        <TextInput placeholder="~/Fabrication/gridfinity" />
      </FormField>
    </div>
  )
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <div style={{ width: 200 }}>
        <DenseField label="md — 44px, Indivisible">
          <TextInput defaultValue="Bin 2×1 · PETG-CF" />
        </DenseField>
      </div>
      <div style={{ width: 160 }}>
        <DenseField label="sm — 28px, dense">
          <TextInput size="sm" defaultValue="Bin 2×1 · PETG-CF" />
        </DenseField>
      </div>
    </div>
  )
}

export function States() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 320 }}>
      <FormField label="Search parts">
        <TextInput placeholder="e.g. bin, baseplate, lid" />
      </FormField>
      <FormField label="Material">
        <TextInput defaultValue="PETG-CF" />
      </FormField>
      <FormField label="Source file (synced)">
        <TextInput defaultValue="bin-2x1.step" disabled />
      </FormField>
    </div>
  )
}

export function InputTypes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 320 }}>
      <FormField label="Print due">
        <TextInput type="date" defaultValue="2026-08-14" />
      </FormField>
      <FormField label="Notify on finish">
        <TextInput type="email" defaultValue="thomas@subtract.design" />
      </FormField>
      <FormField label="Filter library">
        <TextInput type="search" placeholder="Search 214 parts" />
      </FormField>
    </div>
  )
}

export function DenseInspector() {
  return (
    <div
      style={{
        width: 260,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 12,
        background: 'var(--white)',
        border: '1px solid var(--demure)',
        borderRadius: 11,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: DENSE,
          fontSize: 12.8,
          fontWeight: 600,
          color: 'var(--ink-dark)',
        }}
      >
        Part
      </p>
      <DenseField label="Name">
        <TextInput size="sm" defaultValue="Bin 2×1" />
      </DenseField>
      <DenseField label="Collection">
        <TextInput size="sm" defaultValue="Gridfinity / Drawer A" />
      </DenseField>
      <DenseField label="Tag">
        <TextInput size="sm" placeholder="Add a tag…" />
      </DenseField>
    </div>
  )
}
