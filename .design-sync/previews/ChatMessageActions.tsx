import { ChatMessageActions, ChatMessageAction, ChatBubble } from '@subtract/ds'
import {
  Copy,
  ArrowsClockwise,
  ThumbsUp,
  ThumbsDown,
  PencilSimple,
  DownloadSimple,
} from '@phosphor-icons/react'

const COL: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 10, width: 400 }
const MSG_ROW: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 }

export function UnderAssistantReply() {
  return (
    <div style={COL}>
      <div style={MSG_ROW}>
        <ChatBubble from="assistant" group="single">
          Re-sliced at 0.2 mm — 6 h 12 m, 118 g PETG. The dovetail seam clears the nozzle by 1.1 mm.
        </ChatBubble>
        <ChatMessageActions align="start" style={{ paddingLeft: 4 }}>
          <ChatMessageAction label="Copy">
            <Copy size={15} weight="bold" />
          </ChatMessageAction>
          <ChatMessageAction label="Regenerate">
            <ArrowsClockwise size={15} weight="bold" />
          </ChatMessageAction>
          <ChatMessageAction label="Download G-code">
            <DownloadSimple size={15} weight="bold" />
          </ChatMessageAction>
          <ChatMessageAction label="Good response">
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

export function Alignment() {
  return (
    <div style={{ ...COL, gap: 18 }}>
      <div style={MSG_ROW}>
        <ChatBubble from="assistant" group="single">
          Prusa #2 is paused — Y-axis belt tension reads low.
        </ChatBubble>
        <ChatMessageActions align="start" style={{ paddingLeft: 4 }}>
          <ChatMessageAction label="Copy">
            <Copy size={15} weight="bold" />
          </ChatMessageAction>
          <ChatMessageAction label="Regenerate">
            <ArrowsClockwise size={15} weight="bold" />
          </ChatMessageAction>
          <ChatMessageAction label="Good response" active>
            <ThumbsUp size={15} weight="bold" />
          </ChatMessageAction>
        </ChatMessageActions>
      </div>

      <div style={MSG_ROW}>
        <ChatBubble from="user" group="single" status="read">
          Re-run the bin dividers on #3 tonight.
        </ChatBubble>
        <ChatMessageActions align="end" style={{ paddingRight: 4 }}>
          <ChatMessageAction label="Edit message">
            <PencilSimple size={15} weight="bold" />
          </ChatMessageAction>
          <ChatMessageAction label="Copy">
            <Copy size={15} weight="bold" />
          </ChatMessageAction>
        </ChatMessageActions>
      </div>
    </div>
  )
}

export function ToolFailureRetry() {
  return (
    <div style={COL}>
      <div style={MSG_ROW}>
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
    </div>
  )
}
