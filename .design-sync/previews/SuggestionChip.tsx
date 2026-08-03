import { SuggestionChip, SuggestionChips } from '@subtract/ds'
import { Sparkle, Cube, Ruler } from '@phosphor-icons/react'

export function QuickReplies() {
  return (
    <div style={{ width: 440 }}>
      <SuggestionChips>
        <SuggestionChip>Slice for the X1C</SuggestionChip>
        <SuggestionChip>Nest on a 256 mm plate</SuggestionChip>
        <SuggestionChip>Export STEP</SuggestionChip>
      </SuggestionChips>
    </div>
  )
}

export function WithIcon() {
  return (
    <div style={{ width: 580 }}>
      <SuggestionChips>
        <SuggestionChip icon={<Sparkle size={13} weight="fill" />}>Tighten the nest</SuggestionChip>
        <SuggestionChip icon={<Cube size={13} weight="bold" />}>Open in the viewer</SuggestionChip>
        <SuggestionChip icon={<Ruler size={13} weight="bold" />}>Measure the bin wall</SuggestionChip>
      </SuggestionChips>
    </div>
  )
}

export function Disabled() {
  return (
    <div style={{ width: 440 }}>
      <SuggestionChips>
        <SuggestionChip>Re-slice</SuggestionChip>
        <SuggestionChip disabled>Send to printer — queue is full</SuggestionChip>
      </SuggestionChips>
    </div>
  )
}
