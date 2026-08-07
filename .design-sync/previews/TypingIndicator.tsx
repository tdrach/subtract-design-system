import { TypingIndicator, Persona, ChatBubble } from '@subtract/ds'

export function InThread() {
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
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--demure)' }}>
        <Persona size="sm" name="Athena" role="typing…" state="thinking" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14 }}>
        <ChatBubble from="user" status="read">
          Can these bins print without supports?
        </ChatBubble>
        <TypingIndicator />
      </div>
    </div>
  )
}

export function InlineStatus() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <TypingIndicator bubble={false} />
      <span style={{ fontSize: 12.8, color: 'var(--ink-light)' }}>
        Athena is checking overhang angles on 7 parts…
      </span>
    </div>
  )
}
