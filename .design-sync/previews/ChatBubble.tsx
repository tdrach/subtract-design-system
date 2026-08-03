import { ChatBubble } from '@subtract/ds'

export function Conversation() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 440 }}>
      <ChatBubble from="assistant" group="first">
        Hey! How can I help you today?
      </ChatBubble>
      <ChatBubble from="user" status="read" timestamp="9:41 AM">
        Can you summarize the Q3 report?
      </ChatBubble>
      <ChatBubble from="assistant">
        Sure — revenue was up 12% QoQ, driven mostly by the new enterprise tier.
      </ChatBubble>
    </div>
  )
}

export function Variants() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 480 }}>
      <ChatBubble from="assistant" variant="plain">
        Plain variant — full width, no fill (Claude style).
      </ChatBubble>
      <ChatBubble from="user" variant="bubble">
        Bubble variant — iMessage-style fill.
      </ChatBubble>
    </div>
  )
}

export function ErrorAndStatus() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 440 }}>
      <ChatBubble from="user" tone="error" status="failed">
        This message failed to send
      </ChatBubble>
      <ChatBubble from="user" status="sending">
        Retrying…
      </ChatBubble>
    </div>
  )
}
