import { Skeleton } from '@subtract/ds'

export function ProjectCard() {
  return (
    <div
      style={{
        width: 320,
        border: '1px solid var(--demure)',
        borderRadius: 12,
        background: 'var(--white)',
        padding: 16,
      }}
    >
      <Skeleton width="100%" height={140} radius={8} />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 16 }}>
        <Skeleton width={36} height={36} radius="50%" style={{ flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 0 }}>
          <Skeleton width="74%" height={14} />
          <Skeleton width="46%" height={11} />
        </div>
      </div>
    </div>
  )
}

export function PrintQueueRows() {
  const rows = [
    { title: '68%', meta: '40%' },
    { title: '52%', meta: '31%' },
    { title: '61%', meta: '44%' },
  ]
  return (
    <div style={{ width: 380, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Skeleton width={32} height={32} radius={8} style={{ flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minWidth: 0 }}>
            <Skeleton width={r.title} height={13} />
            <Skeleton width={r.meta} height={10} />
          </div>
          <Skeleton width={56} height={20} radius={980} style={{ flexShrink: 0 }} />
        </div>
      ))}
    </div>
  )
}

export function TextLines() {
  return (
    <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Skeleton width="42%" height={20} />
      <div style={{ height: 6 }} />
      <Skeleton width="100%" height={13} />
      <Skeleton width="97%" height={13} />
      <Skeleton width="89%" height={13} />
      <Skeleton width="58%" height={13} />
    </div>
  )
}

export function Shapes() {
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
      <Skeleton width={160} height={14} />
      <Skeleton width={120} height={72} radius={8} />
      <Skeleton width={96} height={28} radius={980} />
      <Skeleton width={48} height={48} radius="50%" />
    </div>
  )
}
