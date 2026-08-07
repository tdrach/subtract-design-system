import {
  ChatThread,
  ChatThreadScrollButton,
  ChatBubble,
  ChatMessageActions,
  ChatMessageAction,
  ChatComposer,
  ChatComposerTextarea,
  ChatComposerToolbar,
  ChatComposerTools,
  ChatComposerSubmit,
  Persona,
  TypingIndicator,
  IconButton,
} from '@subtract/ds'
import { Copy, ArrowsClockwise, ThumbsUp, ThumbsDown, Paperclip } from '@phosphor-icons/react'

const PANEL = (width: number, height: number): React.CSSProperties => ({
  width,
  height,
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid var(--demure)',
  borderRadius: 12,
  background: 'var(--white)',
  overflow: 'hidden',
})

const HEAD: React.CSSProperties = {
  flexShrink: 0,
  padding: '10px 14px',
  borderBottom: '1px solid var(--demure)',
}

const SCROLLER: React.CSSProperties = { flex: 1, minHeight: 0 }

const DOCK: React.CSSProperties = {
  flexShrink: 0,
  padding: 4,
  borderTop: '1px solid var(--demure)',
}

const MSG_ROW: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 }

export function AgentThread() {
  return (
    <div style={PANEL(420, 600)}>
      <div style={HEAD}>
        <Persona name="Athena" role="Fabrication agent" size="sm" />
      </div>

      <div style={SCROLLER}>
        <ChatThread style={{ height: '100%' }}>
          <ChatBubble from="assistant" group="first">
            Morning, Thomas. Three jobs are queued on the Prusa and one is blocked.
          </ChatBubble>
          <ChatBubble from="assistant" group="last">
            The 6×4 Gridfinity base plate won’t slice — it overhangs the bed by 2.4 mm.
          </ChatBubble>

          <ChatBubble from="user" group="single">
            Can you re-tile it as two halves?
          </ChatBubble>

          <div style={MSG_ROW}>
            <ChatBubble from="assistant" group="single">
              Done — split into two 3×4 plates with a dovetail seam. 6 h 12 m at 0.2 mm, 118 g PETG.
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

          <ChatBubble from="user" group="single" status="read">
            Queue it after the enclosure print.
          </ChatBubble>

          <TypingIndicator />
        </ChatThread>
      </div>

      <div style={DOCK}>
        <ChatComposer variant="docked">
          <ChatComposerTextarea placeholder="Message Athena… (⏎ to send, ⇧⏎ newline)" />
          <ChatComposerToolbar>
            <ChatComposerTools>
              <IconButton aria-label="Attach a model file">
                <Paperclip size={15} weight="bold" />
              </IconButton>
            </ChatComposerTools>
            <ChatComposerSubmit status="ready" disabled />
          </ChatComposerToolbar>
        </ChatComposer>
      </div>
    </div>
  )
}

export function ScrolledBack() {
  return (
    <div style={PANEL(420, 380)}>
      <div style={SCROLLER}>
        <ChatThread autoScroll={false} style={{ height: '100%' }}>
          <ChatBubble from="assistant" group="single">
            Print farm report for Tuesday — 4 jobs finished, 1 failed.
          </ChatBubble>
          <ChatBubble from="user" group="first">
            Which one failed?
          </ChatBubble>
          <ChatBubble from="user" group="last">
            And on which machine?
          </ChatBubble>
          <ChatBubble from="assistant" group="first">
            The bin divider set on Prusa #2 — layer shift at 41%.
          </ChatBubble>
          <ChatBubble from="assistant" group="last">
            Belt tension on the Y axis reads low. I’ve paused the queue on that machine.
          </ChatBubble>
          <ChatBubble from="user" group="single">
            Re-run it on #3 tonight.
          </ChatBubble>
          <ChatBubble from="assistant" group="first">
            Queued for 21:40 — #3 finishes the enclosure lid at 21:12.
          </ChatBubble>
          <ChatBubble from="assistant" group="last">
            I also flagged the belt for maintenance and moved tomorrow’s two jobs off #2.
          </ChatBubble>
          <ChatBubble from="user" group="single" status="delivered">
            Perfect — send me the report when it’s done.
          </ChatBubble>

          <ChatThreadScrollButton visible />
        </ChatThread>
      </div>
    </div>
  )
}

export function PlainTranscript() {
  return (
    <div style={PANEL(640, 320)}>
      <div style={SCROLLER}>
        <ChatThread style={{ height: '100%' }}>
          <ChatBubble from="user" group="single">
            Summarize the tolerance notes for the enclosure lid.
          </ChatBubble>

          <div style={MSG_ROW}>
            <ChatBubble from="assistant" variant="plain">
              <p style={{ margin: '0 0 8px' }}>
                <strong>Lid fit.</strong> The snap tabs are cut for a 0.15 mm clearance per side,
                which prints cleanly in PETG but binds in PLA below 22 °C.
              </p>
              <p style={{ margin: 0 }}>
                Two open items: the M3 heat-set inserts need a 4.6 mm pilot, and the hinge boss is
                still 0.4 mm under nominal from the last revision.
              </p>
            </ChatBubble>
            <ChatMessageActions align="start">
              <ChatMessageAction label="Copy">
                <Copy size={15} weight="bold" />
              </ChatMessageAction>
              <ChatMessageAction label="Regenerate">
                <ArrowsClockwise size={15} weight="bold" />
              </ChatMessageAction>
            </ChatMessageActions>
          </div>

          <ChatBubble from="user" group="single">
            Bump the boss to nominal and re-export the STEP.
          </ChatBubble>
        </ChatThread>
      </div>
    </div>
  )
}
