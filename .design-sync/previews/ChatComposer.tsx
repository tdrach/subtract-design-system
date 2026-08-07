import {
  ChatComposer,
  ChatComposerField,
  ChatComposerTextarea,
  ChatComposerToolbar,
  ChatComposerTools,
  ChatComposerSubmit,
  ChatBubble,
  ButtonGroup,
  ButtonGroupItem,
  IconButton,
} from '@subtract/ds'
import { Paperclip, Cube } from '@phosphor-icons/react'

const STAGE: React.CSSProperties = {
  width: 620,
  padding: 20,
  background: 'var(--light)',
  borderRadius: 14,
  boxSizing: 'border-box',
}

const CAPTION: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--ink-light)',
  letterSpacing: '-0.01em',
}

export function Docked() {
  return (
    <div style={STAGE}>
      <ChatComposer variant="docked">
        <ChatComposerTextarea defaultValue="Re-tile the 6×4 base plate into two halves and re-slice at 0.2 mm" />
        <ChatComposerToolbar>
          <ChatComposerTools>
            <IconButton aria-label="Attach a model file">
              <Paperclip size={15} weight="bold" />
            </IconButton>
            <IconButton aria-label="Attach from part library">
              <Cube size={15} weight="bold" />
            </IconButton>
            <ButtonGroup aria-label="Model">
              <ButtonGroupItem size="sm">Haiku</ButtonGroupItem>
              <ButtonGroupItem size="sm" selected>
                Sonnet
              </ButtonGroupItem>
              <ButtonGroupItem size="sm">Opus</ButtonGroupItem>
            </ButtonGroup>
          </ChatComposerTools>
          <ChatComposerSubmit status="ready" />
        </ChatComposerToolbar>
      </ChatComposer>
    </div>
  )
}

export function Frosted() {
  return (
    <div
      style={{
        position: 'relative',
        width: 620,
        height: 300,
        border: '1px solid var(--demure)',
        borderRadius: 14,
        background: 'var(--white)',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '20px 24px' }}>
        <ChatBubble from="user" group="single">
          What’s left before the enclosure revision ships?
        </ChatBubble>
        <ChatBubble from="assistant" group="first">
          Three things: the hinge boss is 0.4 mm under nominal, the vent cutout still fails the
          0.8 mm wall check, and the BOM has no line for the M3 inserts.
        </ChatBubble>
        <ChatBubble from="assistant" group="last">
          I can fix the boss and re-run the wall check now — the BOM needs your part number.
        </ChatBubble>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <ChatComposer variant="docked" frosted>
          <ChatComposerField>
            <ChatComposerTextarea placeholder="Reply to Athena…" />
            <ChatComposerSubmit status="ready" disabled />
          </ChatComposerField>
        </ChatComposer>
      </div>
    </div>
  )
}

export function Inline() {
  return (
    <div style={{ width: 620 }}>
      <ChatComposer variant="inline">
        <ChatComposerTextarea defaultValue="Generate a cut list for the 12-bin drawer insert" />
        <ChatComposerToolbar>
          <ChatComposerTools>
            <IconButton aria-label="Attach a model file">
              <Paperclip size={15} weight="bold" />
            </IconButton>
            <span style={CAPTION}>Sonnet · 4 files in context</span>
          </ChatComposerTools>
          <ChatComposerSubmit status="streaming" />
        </ChatComposerToolbar>
      </ChatComposer>
    </div>
  )
}

export function PillField() {
  return (
    <div style={{ ...STAGE, width: 420 }}>
      <ChatComposer variant="inline">
        <ChatComposerField>
          <ChatComposerTextarea placeholder="iMessage-style pill — tap ↑ to send" submitOn="button" />
          <ChatComposerSubmit status="ready" />
        </ChatComposerField>
      </ChatComposer>
    </div>
  )
}

export function SubmitStates() {
  const states: { status: 'ready' | 'streaming' | 'error'; disabled?: boolean; label: string }[] = [
    { status: 'ready', disabled: true, label: 'disabled — empty input' },
    { status: 'ready', label: 'ready — send' },
    { status: 'streaming', label: 'streaming — stop' },
    { status: 'error', label: 'error — retry send' },
  ]
  return (
    <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
      {states.map((s) => (
        <div
          key={s.label}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: 110 }}
        >
          <ChatComposerSubmit status={s.status} disabled={s.disabled} />
          <span style={{ ...CAPTION, textAlign: 'center' }}>{s.label}</span>
        </div>
      ))}
    </div>
  )
}
