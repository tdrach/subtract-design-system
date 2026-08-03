import { TagPill } from '@subtract/ds'

const TAGS = {
  design: { id: '1', name: 'Design', color: '#7c3aed' },
  engineering: { id: '2', name: 'Engineering', color: '#2563eb' },
  urgent: { id: '3', name: 'Urgent', color: '#dc2626' },
  gridfinity: { id: '4', name: 'Gridfinity', color: '#0891b2' },
  petg: { id: '5', name: 'PETG', color: '#16a34a' },
  supports: { id: '6', name: 'Needs supports', color: '#ea580c' },
  clientWork: { id: '7', name: 'Client work', color: '#ca8a04' },
}

export function ProjectTags() {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', maxWidth: 300 }}>
      <TagPill tag={TAGS.design} />
      <TagPill tag={TAGS.engineering} />
      <TagPill tag={TAGS.urgent} />
      <TagPill tag={TAGS.gridfinity} />
      <TagPill tag={TAGS.petg} />
      <TagPill tag={TAGS.supports} />
    </div>
  )
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--ink-light)', width: 28 }}>sm</span>
        <TagPill tag={TAGS.gridfinity} size="sm" />
        <TagPill tag={TAGS.petg} size="sm" />
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--ink-light)', width: 28 }}>md</span>
        <TagPill tag={TAGS.gridfinity} size="md" />
        <TagPill tag={TAGS.petg} size="md" />
      </div>
    </div>
  )
}

export function OnFileRows() {
  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: '10px 0',
    borderBottom: '1px solid var(--demure)',
  }

  return (
    <div style={{ width: 340 }}>
      <div style={rowStyle}>
        <span style={{ fontSize: 14, color: 'var(--ink-dark)' }}>baseplate-6x4.step</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <TagPill tag={TAGS.gridfinity} />
          <TagPill tag={TAGS.design} />
        </div>
      </div>
      <div style={rowStyle}>
        <span style={{ fontSize: 14, color: 'var(--ink-dark)' }}>hinge-bracket-v3.stl</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <TagPill tag={TAGS.supports} />
        </div>
      </div>
      <div style={{ ...rowStyle, borderBottom: 'none' }}>
        <span style={{ fontSize: 14, color: 'var(--ink-dark)' }}>enclosure-lid.3mf</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <TagPill tag={TAGS.clientWork} />
          <TagPill tag={TAGS.urgent} />
        </div>
      </div>
    </div>
  )
}
