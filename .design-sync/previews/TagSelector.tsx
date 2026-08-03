import { TagSelector } from '@subtract/ds'

const TAGS = [
  { id: '1', name: 'Gridfinity', color: '#0891b2' },
  { id: '2', name: 'Design', color: '#7c3aed' },
  { id: '3', name: 'Engineering', color: '#2563eb' },
  { id: '4', name: 'PETG', color: '#16a34a' },
  { id: '5', name: 'Needs supports', color: '#ea580c' },
  { id: '6', name: 'Urgent', color: '#dc2626' },
]

const noop = () => {}
const createTag = async (name: string) => ({ id: name, name, color: '#ca8a04' })

export function Field() {
  return (
    <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>Tags</span>
      <TagSelector
        tags={TAGS}
        selected={['1', '4']}
        onSelect={noop}
        onDeselect={noop}
        onCreate={createTag}
      />
    </div>
  )
}

export function EmptyField() {
  return (
    <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>Tags</span>
      <TagSelector
        tags={TAGS}
        selected={[]}
        onSelect={noop}
        onDeselect={noop}
        onCreate={createTag}
      />
    </div>
  )
}

export function ManySelected() {
  return (
    <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>Tags</span>
      <TagSelector
        tags={TAGS}
        selected={['1', '2', '5', '6']}
        onSelect={noop}
        onDeselect={noop}
        onCreate={createTag}
      />
    </div>
  )
}

export function CompactInTaskRow() {
  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: '10px 0',
    borderBottom: '1px solid var(--demure)',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 14,
    color: 'var(--ink-dark)',
    whiteSpace: 'nowrap',
  }

  return (
    <div style={{ width: 420 }}>
      <div style={rowStyle}>
        <span style={labelStyle}>Re-slice baseplate 6×4</span>
        <TagSelector
          compact
          tags={TAGS}
          selected={['1']}
          onSelect={noop}
          onDeselect={noop}
          onCreate={createTag}
        />
      </div>
      <div style={{ ...rowStyle, borderBottom: 'none' }}>
        <span style={labelStyle}>Check lid thickness</span>
        <TagSelector
          compact
          tags={TAGS}
          selected={['5', '6']}
          onSelect={noop}
          onDeselect={noop}
          onCreate={createTag}
        />
      </div>
    </div>
  )
}
