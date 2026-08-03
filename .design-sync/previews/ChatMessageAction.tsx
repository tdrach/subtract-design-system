import { ChatMessageAction, ChatMessageActions, ChatBubble } from '@subtract/ds'
import {
  Copy,
  ArrowsClockwise,
  ThumbsUp,
  ThumbsDown,
  BookmarkSimple,
} from '@phosphor-icons/react'

const COL: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, width: 400 }

const CAPTION: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--ink-light)',
  letterSpacing: '-0.01em',
}

export function ReplyActions() {
  return (
    <div style={COL}>
      <ChatBubble from="assistant" group="single">
        The 12-bin insert fits a 4×3 grid with 0.25 mm clearance on each wall.
      </ChatBubble>
      <ChatMessageActions align="start" style={{ paddingLeft: 4 }}>
        <ChatMessageAction label="Copy">
          <Copy size={15} weight="bold" />
        </ChatMessageAction>
        <ChatMessageAction label="Regenerate">
          <ArrowsClockwise size={15} weight="bold" />
        </ChatMessageAction>
        <ChatMessageAction label="Save to part library">
          <BookmarkSimple size={15} weight="bold" />
        </ChatMessageAction>
        <ChatMessageAction label="Good response">
          <ThumbsUp size={15} weight="bold" />
        </ChatMessageAction>
        <ChatMessageAction label="Bad response">
          <ThumbsDown size={15} weight="bold" />
        </ChatMessageAction>
      </ChatMessageActions>
    </div>
  )
}

export function ActiveState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 420 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={CAPTION}>default</span>
        <ChatBubble from="assistant" group="single">
          Nozzle temp is 240 °C for that PETG profile.
        </ChatBubble>
        <ChatMessageActions align="start" style={{ paddingLeft: 4 }}>
          <ChatMessageAction label="Copy">
            <Copy size={15} weight="bold" />
          </ChatMessageAction>
          <ChatMessageAction label="Regenerate">
            <ArrowsClockwise size={15} weight="bold" />
          </ChatMessageAction>
          <ChatMessageAction label="Good response">
            <ThumbsUp size={15} weight="bold" />
          </ChatMessageAction>
          <ChatMessageAction label="Bad response">
            <ThumbsDown size={15} weight="bold" />
          </ChatMessageAction>
        </ChatMessageActions>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={CAPTION}>active — saved to the part library, feedback recorded</span>
        <ChatBubble from="assistant" group="single">
          Nozzle temp is 240 °C for that PETG profile.
        </ChatBubble>
        <ChatMessageActions align="start" style={{ paddingLeft: 4 }}>
          <ChatMessageAction label="Copy">
            <Copy size={15} weight="bold" />
          </ChatMessageAction>
          <ChatMessageAction label="Regenerate">
            <ArrowsClockwise size={15} weight="bold" />
          </ChatMessageAction>
          <ChatMessageAction label="Saved to part library" active>
            <BookmarkSimple size={15} weight="bold" />
          </ChatMessageAction>
          <ChatMessageAction label="Good response" active>
            <ThumbsUp size={15} weight="bold" />
          </ChatMessageAction>
          <ChatMessageAction label="Bad response">
            <ThumbsDown size={15} weight="bold" />
          </ChatMessageAction>
        </ChatMessageActions>
      </div>
    </div>
  )
}

export function RetryAction() {
  return (
    <div style={COL}>
      <ChatBubble from="system" tone="error" group="single">
        <strong>Tool failed: slice_model</strong>
        <p style={{ margin: '4px 0 0' }}>PrusaSlicer CLI timed out after 60 s.</p>
      </ChatBubble>
      <ChatMessageActions align="start" style={{ paddingLeft: 4 }}>
        <ChatMessageAction label="Retry">
          <ArrowsClockwise size={15} weight="bold" />
        </ChatMessageAction>
        <ChatMessageAction label="Copy error">
          <Copy size={15} weight="bold" />
        </ChatMessageAction>
      </ChatMessageActions>
    </div>
  )
}
