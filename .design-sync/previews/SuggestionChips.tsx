import { SuggestionChips, SuggestionChip, ChatBubble } from '@subtract/ds'
import { Sparkle } from '@phosphor-icons/react'

export function FollowUps() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 460 }}>
      <ChatBubble from="assistant">
        The plate is nested at 84% fill — 7 bins, 3 h 12 m at 0.2 mm layers.
      </ChatBubble>
      <SuggestionChips>
        <SuggestionChip>Slice for the X1C</SuggestionChip>
        <SuggestionChip>Show the toolpath</SuggestionChip>
        <SuggestionChip icon={<Sparkle size={13} weight="fill" />}>Tighten the nest</SuggestionChip>
      </SuggestionChips>
    </div>
  )
}

export function Alignment() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 460 }}>
      {(['start', 'end'] as const).map((align) => (
        <div key={align} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <code style={{ fontSize: 12, color: 'var(--ink-light)' }}>align="{align}"</code>
          <div
            style={{
              padding: 12,
              border: '1px solid var(--demure)',
              borderRadius: 12,
              background: 'var(--light)',
            }}
          >
            <SuggestionChips align={align}>
              <SuggestionChip>Export STEP</SuggestionChip>
              <SuggestionChip>Add a 0.6 mm chamfer</SuggestionChip>
            </SuggestionChips>
          </div>
        </div>
      ))}
    </div>
  )
}

export function Wrapping() {
  return (
    <div style={{ width: 300 }}>
      <SuggestionChips>
        <SuggestionChip>Check wall thickness</SuggestionChip>
        <SuggestionChip>Re-orient for strength</SuggestionChip>
        <SuggestionChip>Add drainage holes</SuggestionChip>
        <SuggestionChip>Estimate filament</SuggestionChip>
        <SuggestionChip>Save to part library</SuggestionChip>
      </SuggestionChips>
    </div>
  )
}
