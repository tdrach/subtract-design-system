import { Persona, PersonaAvatar } from '@subtract/ds'

export function AssistantHeader() {
  return (
    <div
      style={{
        width: 420,
        border: '1px solid var(--demure)',
        borderRadius: 12,
        background: 'var(--white)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '12px 16px',
          borderBottom: '1px solid var(--demure)',
        }}
      >
        <Persona name="Athena" role="Fabrication agent" state="idle" />
        <span style={{ fontSize: 12.8, color: 'var(--ink-light)' }}>Gridfinity plate</span>
      </div>
      <div style={{ padding: '14px 16px', fontSize: 13, lineHeight: 1.5, color: 'var(--ink-dark)' }}>
        I re-nested the 7 bins onto a single 256 mm plate — clearance is 0.4 mm.
      </div>
    </div>
  )
}

export function States() {
  const states = [
    { state: 'idle', role: 'Ready' },
    { state: 'thinking', role: 'Planning the toolpath…' },
    { state: 'listening', role: 'Listening' },
    { state: 'speaking', role: 'Walking you through it' },
  ] as const

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {states.map((s) => (
        <div key={s.state} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 260 }}>
            <Persona name="Athena" role={s.role} state={s.state} />
          </div>
          <code style={{ fontSize: 12, color: 'var(--ink-light)' }}>state="{s.state}"</code>
        </div>
      ))}
    </div>
  )
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Persona size="sm" name="Athena" role="Fabrication agent" />
      <Persona size="md" name="Athena" role="Fabrication agent" />
      <Persona size="lg" name="Athena" role="Fabrication agent" />
    </div>
  )
}

export function Vertical() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        alignItems: 'stretch',
      }}
    >
      {[
        { name: 'Athena', role: 'Fabrication agent' },
        { name: 'Kiln', role: 'Slicer agent' },
      ].map((p) => (
        <div
          key={p.name}
          style={{
            width: 168,
            padding: '20px 12px',
            border: '1px solid var(--demure)',
            borderRadius: 12,
            background: 'var(--white)',
          }}
        >
          <Persona orientation="vertical" size="lg" name={p.name} role={p.role} state="idle" />
        </div>
      ))}
    </div>
  )
}

export function TeamMembers() {
  const people = [
    { initials: 'TD', name: 'Thomas Drach', role: 'Owner · Build plates' },
    { initials: 'MR', name: 'Mara Reyes', role: 'Editor · Part library' },
    { initials: 'JK', name: 'Jonas Kepler', role: 'Viewer · Print queue' },
  ]

  return (
    <div
      style={{
        width: 380,
        border: '1px solid var(--demure)',
        borderRadius: 12,
        background: 'var(--white)',
        overflow: 'hidden',
      }}
    >
      {people.map((p, i) => (
        <div
          key={p.initials}
          style={{
            padding: '10px 14px',
            borderTop: i === 0 ? 'none' : '1px solid var(--demure)',
          }}
        >
          <Persona
            size="sm"
            name={p.name}
            role={p.role}
            avatar={<PersonaAvatar orb={false} size="sm" initial={p.initials} />}
          />
        </div>
      ))}
    </div>
  )
}
