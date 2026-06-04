'use client'

import { useRef, useState } from 'react'
import {
  ChatBubble, ChatThread, ChatThreadScrollButton,
  ChatComposer, ChatComposerTextarea, ChatComposerToolbar, ChatComposerTools, ChatComposerSubmit,
  Persona, PersonaAvatar,
  TypingIndicator,
  ChatMessageActions, ChatMessageAction,
  SuggestionChips, SuggestionChip,
  SegmentedControl,
} from '@subtract/ds'
import type {
  ChatThreadHandle, PersonaState, ChatComposerSubmitStatus,
  ChatRole, ChatDeliveryStatus,
} from '@subtract/ds'
import {
  Copy, ArrowsClockwise, ThumbsUp, ThumbsDown, Paperclip, Sparkle,
} from '@phosphor-icons/react'
import styles from './page.module.scss'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DemoMsg {
  id: number
  from: ChatRole
  text: string
  tone?: 'default' | 'error'
  status?: ChatDeliveryStatus
}

let idSeq = 100

const SEED: DemoMsg[] = [
  { id: 1, from: 'assistant', text: "Morning, Thomas. You've got **3 things** flagged for today across Stripe and Subtract." },
  { id: 2, from: 'user', text: 'What should I start with?' },
  { id: 3, from: 'assistant', text: 'Start with the **Q3 review doc** — it has the earliest deadline.\n\n- Due at 2pm\n- Two reviewers waiting\n- ~40 min of work' },
  { id: 4, from: 'user', text: 'Makes sense.' },
  { id: 5, from: 'user', text: 'Can you remind me at noon?', status: 'read' },
]

const MODEL_OPTIONS = [
  { label: 'Haiku', value: 'haiku' },
  { label: 'Sonnet', value: 'sonnet' },
  { label: 'Opus', value: 'opus' },
]

// Group helper: which corner-rounding does message i get within its sender run?
function groupFor(msgs: DemoMsg[], i: number): 'single' | 'first' | 'middle' | 'last' {
  const prevSame = i > 0 && msgs[i - 1].from === msgs[i].from
  const nextSame = i < msgs.length - 1 && msgs[i + 1].from === msgs[i].from
  if (prevSame && nextSame) return 'middle'
  if (prevSame) return 'last'
  if (nextSame) return 'first'
  return 'single'
}

// ─── Live iMessage thread ──────────────────────────────────────────────────────

function LiveThread() {
  const [messages, setMessages] = useState<DemoMsg[]>(SEED)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [atBottom, setAtBottom] = useState(true)
  const [submitOn, setSubmitOn] = useState<'enter' | 'button'>('enter')
  const threadRef = useRef<ChatThreadHandle>(null)

  function pushAssistantReply() {
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [
        ...m,
        {
          id: ++idSeq,
          from: 'assistant',
          text: "Got it — I'll nudge you at noon. Anything else before you dive in?",
        },
      ])
      setTimeout(() => threadRef.current?.scrollToBottom('smooth'), 50)
    }, 1400)
  }

  function send() {
    const text = input.trim()
    if (!text) return
    setMessages((m) => [...m, { id: ++idSeq, from: 'user', text, status: 'sent' }])
    setInput('')
    setTimeout(() => threadRef.current?.scrollToBottom('smooth'), 50)
    pushAssistantReply()
  }

  function reply(text: string) {
    setMessages((m) => [...m, { id: ++idSeq, from: 'user', text, status: 'sent' }])
    setTimeout(() => threadRef.current?.scrollToBottom('smooth'), 50)
    pushAssistantReply()
  }

  const lastUserIdx = (() => {
    for (let i = messages.length - 1; i >= 0; i--) if (messages[i].from === 'user') return i
    return -1
  })()

  return (
    <div className={styles.chatPhone}>
      {/* Header */}
      <div className={styles.chatPhoneHeader}>
        <Persona name="Athena" role={typing ? 'typing…' : 'Stripe agent'} state={typing ? 'thinking' : 'idle'} size="sm" />
      </div>

      {/* Thread */}
      <div className={styles.chatPhoneThreadWrap}>
        <ChatThread ref={threadRef} className={styles.chatPhoneThread} onAtBottomChange={setAtBottom}>
          {messages.map((m, i) => {
            const isUser = m.from === 'user'
            const group = groupFor(messages, i)
            const showActions = m.from === 'assistant' && (group === 'single' || group === 'last')
            return (
              <div key={m.id} className={styles.chatMsgRow}>
                <ChatBubble
                  from={m.from}
                  tone={m.tone}
                  group={group}
                  status={isUser && i === lastUserIdx ? m.status : undefined}
                >
                  <Markdownish text={m.text} />
                </ChatBubble>
                {showActions && (
                  <ChatMessageActions align="start" className={styles.chatInlineActions}>
                    <ChatMessageAction label="Copy"><Copy size={15} weight="bold" /></ChatMessageAction>
                    <ChatMessageAction label="Regenerate"><ArrowsClockwise size={15} weight="bold" /></ChatMessageAction>
                    <ChatMessageAction label="Good response"><ThumbsUp size={15} weight="bold" /></ChatMessageAction>
                    <ChatMessageAction label="Bad response"><ThumbsDown size={15} weight="bold" /></ChatMessageAction>
                  </ChatMessageActions>
                )}
              </div>
            )
          })}

          {typing && (
            <div className={styles.chatMsgRow}>
              <TypingIndicator />
            </div>
          )}

          {!typing && (
            <SuggestionChips className={styles.chatSuggestions}>
              <SuggestionChip onClick={() => reply('Yes, remind me at noon')}>Yes, remind me</SuggestionChip>
              <SuggestionChip onClick={() => reply('Show me the doc')}>Show me the doc</SuggestionChip>
              <SuggestionChip icon={<Sparkle size={13} weight="fill" />} onClick={() => reply('Summarize it first')}>Summarize first</SuggestionChip>
            </SuggestionChips>
          )}

          <ChatThreadScrollButton
            visible={!atBottom}
            onClick={() => threadRef.current?.scrollToBottom('smooth')}
          />
        </ChatThread>
      </div>

      {/* Composer */}
      <div className={styles.chatPhoneComposer}>
        <ChatComposer variant="docked" onSubmit={send}>
          <ChatComposerTextarea
            placeholder={submitOn === 'enter' ? 'Message… (⏎ to send, ⇧⏎ newline)' : 'Message… (tap ↑ to send)'}
            value={input}
            submitOn={submitOn}
            onChange={(e) => setInput(e.target.value)}
          />
          <ChatComposerToolbar>
            <ChatComposerTools>
              <button
                type="button"
                className={styles.chatGhostBtn}
                onClick={() => setSubmitOn((s) => (s === 'enter' ? 'button' : 'enter'))}
                title="Toggle Enter-to-send (desktop) vs tap-to-send (mobile)"
              >
                submitOn: <strong>{submitOn}</strong>
              </button>
            </ChatComposerTools>
            <ChatComposerSubmit status="ready" disabled={!input.trim()} />
          </ChatComposerToolbar>
        </ChatComposer>
      </div>
    </div>
  )
}

// ─── Tiny markdown-ish renderer (demo only — bold + lists) ─────────────────────
// Mirrors how a consuming app renders into the bubble's content slot.
function Markdownish({ text }: { text: string }) {
  const lines = text.split('\n')
  const out: React.ReactNode[] = []
  let bullets: string[] = []
  const flush = (k: string) => {
    if (!bullets.length) return
    out.push(
      <ul key={k}>{bullets.map((b, i) => <li key={i}>{inline(b)}</li>)}</ul>
    )
    bullets = []
  }
  lines.forEach((ln, i) => {
    const b = ln.match(/^[-*]\s+(.+)/)
    if (b) { bullets.push(b[1]); return }
    flush(`ul-${i}`)
    if (ln.trim() === '') return
    out.push(<p key={`p-${i}`}>{inline(ln)}</p>)
  })
  flush('ul-end')
  return <>{out}</>
}
function inline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const re = /\*\*(.+?)\*\*/g
  let last = 0, m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(<strong key={m.index}>{m[1]}</strong>)
    last = re.lastIndex
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

// ─── Composer state gallery ────────────────────────────────────────────────────

function ComposerStates() {
  const [model, setModel] = useState('haiku')
  const states: { status: ChatComposerSubmitStatus; disabled?: boolean; label: string }[] = [
    { status: 'ready', disabled: true, label: 'disabled (empty input)' },
    { status: 'ready', label: 'ready (has text)' },
    { status: 'streaming', label: 'streaming (tap to stop)' },
    { status: 'error', label: 'error (send failed)' },
  ]
  return (
    <div className={styles.composerStates}>
      <div className={styles.submitRow}>
        {states.map((s) => (
          <div key={s.label} className={styles.submitCell}>
            <ChatComposerSubmit status={s.status} disabled={s.disabled} />
            <span className={styles.submitCaption}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.composerDockedDemo}>
        <ChatComposer variant="docked" onSubmit={(e) => e.preventDefault()}>
          <ChatComposerTextarea placeholder="Ask about priorities across all areas…" defaultValue="Reprioritize my Stripe tasks for this afternoon" />
          <ChatComposerToolbar>
            <ChatComposerTools>
              <button type="button" className={styles.chatGhostIconBtn} title="Attach"><Paperclip size={16} weight="bold" /></button>
              <SegmentedControl options={MODEL_OPTIONS} value={model} onChange={setModel} size="sm" />
            </ChatComposerTools>
            <ChatComposerSubmit status="ready" />
          </ChatComposerToolbar>
        </ChatComposer>
      </div>
    </div>
  )
}

// ─── Persona gallery ───────────────────────────────────────────────────────────

const PERSONA_STATES: PersonaState[] = ['idle', 'thinking', 'listening', 'speaking']

function PersonaGallery() {
  return (
    <div className={styles.personaGallery}>
      {PERSONA_STATES.map((state) => (
        <div key={state} className={styles.personaCell}>
          <PersonaAvatar state={state} size="lg" />
          <span className={styles.personaCaption}>{state}</span>
        </div>
      ))}
      <div className={styles.personaCell}>
        <PersonaAvatar orb={false} initial="TD" size="lg" />
        <span className={styles.personaCaption}>flat / initials</span>
      </div>
    </div>
  )
}

// ─── Bubble matrix ─────────────────────────────────────────────────────────────

function BubbleMatrixDemo() {
  return (
    <div className={styles.bubbleMatrix}>
      <div className={styles.bubbleCol}>
        <span className={styles.bubbleColLabel}>iMessage bubbles + grouping</span>
        <div className={styles.bubbleColThread}>
          <ChatBubble from="assistant" group="first">Hey — quick update on the launch.</ChatBubble>
          <ChatBubble from="assistant" group="last">Staging is green and ready for your review.</ChatBubble>
          <ChatBubble from="user" group="first">Nice.</ChatBubble>
          <ChatBubble from="user" group="middle">Deploying now?</ChatBubble>
          <ChatBubble from="user" group="last" status="read">Ping me when it&apos;s live.</ChatBubble>
        </div>
      </div>

      <div className={styles.bubbleCol}>
        <span className={styles.bubbleColLabel}>error tone + retry</span>
        <div className={styles.bubbleColThread}>
          <ChatBubble from="user" group="single" status="failed">Create a task: ship the changelog</ChatBubble>
          <div className={styles.chatMsgRow}>
            <ChatBubble from="system" tone="error" group="single">
              <strong>Tool failed: create_task</strong>
              <p>Network request timed out.</p>
            </ChatBubble>
            <ChatMessageActions align="start" className={styles.chatInlineActions}>
              <ChatMessageAction label="Retry"><ArrowsClockwise size={15} weight="bold" /> Retry</ChatMessageAction>
            </ChatMessageActions>
          </div>
        </div>
      </div>

      <div className={styles.bubbleCol}>
        <span className={styles.bubbleColLabel}>plain variant (Claude-style)</span>
        <div className={styles.bubbleColThread}>
          <ChatBubble from="user" group="single">Summarize the Q3 doc in two lines.</ChatBubble>
          <ChatBubble from="assistant" variant="plain">
            <p><strong>Q3 review.</strong> Revenue up 18% QoQ; churn flat.</p>
            <p>Two open risks: hiring pace and infra spend. Full notes in the doc.</p>
          </ChatBubble>
        </div>
      </div>
    </div>
  )
}

// ─── Exported showcase ─────────────────────────────────────────────────────────

export function ChatShowcase() {
  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Live thread</h2>
        <p className={styles.chartIntro}>
          A working iMessage-style thread: grouped bubbles + delivery
          status, a <code>Persona</code> header that animates while thinking, a{' '}
          <code>TypingIndicator</code>, hover <code>ChatMessageActions</code>,{' '}
          <code>SuggestionChips</code>, and a <code>ChatComposer</code> with the
          Apple-style send button. Toggle <code>submitOn</code> to feel the
          desktop (Enter-sends) vs mobile (tap-to-send) behavior.
        </p>
        <LiveThread />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Composer &amp; submit states</h2>
        <p className={styles.chartIntro}>
          The send button is a large circular tap target with status-driven
          glyphs: <strong>disabled</strong> (empty), <strong>ready</strong> (up
          arrow), <strong>streaming</strong> (stop square), and{' '}
          <strong>error</strong>. The docked composer hosts a model picker and
          attachment slot in its toolbar.
        </p>
        <ComposerStates />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Persona (animated orb)</h2>
        <p className={styles.chartIntro}>
          An Obsidian-inspired AI identity. The avatar is a CSS-only gradient orb
          with four activity states — all transform/opacity animations that
          respect <code>prefers-reduced-motion</code>. Falls back to initials,
          a glyph, or an image when <code>orb=&#123;false&#125;</code>.
        </p>
        <PersonaGallery />
        <div className={styles.personaRow}>
          <Persona name="Odin" role="Orchestrator" state="thinking" size="md" />
          <Persona name="Hephaestus" role="Subtract agent" state="speaking" size="md" />
          <Persona name="Ares" role="Fitness agent" state="listening" size="md" />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Bubbles</h2>
        <p className={styles.chartIntro}>
          <code>ChatBubble</code> covers both senders, grouping (first / middle /
          last / single), delivery status, an <code>error</code> tone with retry,
          and a <code>plain</code> full-width variant for Claude-style answers.
        </p>
        <BubbleMatrixDemo />
      </section>
    </>
  )
}
