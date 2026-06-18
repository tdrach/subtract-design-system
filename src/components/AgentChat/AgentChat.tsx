'use client'

import * as React from 'react'
import { ChatThread, type ChatThreadHandle } from '../ChatThread'
import { ChatBubble } from '../ChatBubble'
import {
  ChatComposer, ChatComposerField, ChatComposerTextarea, ChatComposerToolbar, ChatComposerTools, ChatComposerSubmit,
} from '../ChatComposer'
import { TypingIndicator } from '../TypingIndicator'
import { Persona } from '../Persona'
import { SegmentedControl } from '../SegmentedControl'
import type { AgentAdapter, AgentArtifact, AgentJobState, AgentMessage } from './adapter'
import styles from './AgentChat.module.scss'

export interface AgentChatProps {
  /** The backend. Swap this to repoint the same UI at any product/agent. */
  adapter: AgentAdapter
  /** Stable id binding this conversation to a backend thread (and, for the coding agent, a branch/PR). */
  threadId?: string
  variant?: 'inline' | 'docked'
  className?: string
}

const STATUS_TONE: Record<AgentJobState, string> = {
  idle: '', queued: styles.stWorking, working: styles.stWorking,
  awaiting_review: styles.stReview, succeeded: styles.stOk, failed: styles.stFail,
}

function StatusChip({ a }: { a: AgentArtifact }) {
  const tone = a.state === 'success' ? styles.chipOk : a.state === 'failure' ? styles.chipFail : styles.chipPending
  const body = <span className={`${styles.chip} ${tone}`}>{a.label}</span>
  return a.url ? <a className={styles.chipLink} href={a.url} target="_blank" rel="noreferrer">{body}</a> : body
}

/**
 * Backend-agnostic agent chat shell. All the chat UX (thread, composer, model
 * picker, persona, status row) lives here; everything product-specific is
 * supplied by the `adapter`. The coding agent is just a different adapter.
 */
export function AgentChat({ adapter, threadId = 'default', variant = 'inline', className }: AgentChatProps) {
  const caps = adapter.capabilities ?? {}
  const [messages, setMessages] = React.useState<AgentMessage[]>([])
  const [input, setInput] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [model, setModel] = React.useState(caps.models?.[0]?.value ?? 'haiku')
  const [job, setJob] = React.useState<{ state: AgentJobState; label?: string }>({ state: 'idle' })
  const [artifacts, setArtifacts] = React.useState<AgentArtifact[]>([])
  const threadRef = React.useRef<ChatThreadHandle>(null)

  // Resume the thread (prior messages + any in-flight job status).
  React.useEffect(() => {
    let cancelled = false
    adapter.load?.(threadId).then((m) => { if (!cancelled) setMessages(m) }).catch(() => {})
    adapter.getStatus?.(threadId).then((s) => {
      if (cancelled) return
      setJob({ state: s.state, label: s.label })
      if (s.artifacts) setArtifacts(s.artifacts)
    }).catch(() => {})
    return () => { cancelled = true }
  }, [adapter, threadId])

  React.useEffect(() => { threadRef.current?.scrollToBottom() }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || busy) return
    setInput('')
    setBusy(true)
    const userMsg: AgentMessage = { id: `u-${messages.length}`, role: 'user', content: text }
    const asstId = `a-${messages.length}`
    setMessages((prev) => [...prev, userMsg, { id: asstId, role: 'assistant', content: '' }])

    try {
      for await (const ev of adapter.send(threadId, text, { model })) {
        if (ev.type === 'text') {
          setMessages((prev) => prev.map((m) => m.id === asstId ? { ...m, content: m.content + ev.delta } : m))
        } else if (ev.type === 'status') {
          setJob({ state: ev.state, label: ev.label })
        } else if (ev.type === 'artifact') {
          // Replace a same-kind pending chip (e.g. ci pending → ci passing) else append.
          setArtifacts((prev) => {
            const i = prev.findIndex((p) => p.kind === ev.artifact.kind && p.state === 'pending')
            if (i >= 0) { const next = [...prev]; next[i] = ev.artifact; return next }
            return [...prev, ev.artifact]
          })
        } else if (ev.type === 'error') {
          setMessages((prev) => prev.map((m) => m.id === asstId ? { ...m, content: `⚠️ ${ev.message}` } : m))
        }
      }
    } finally {
      setBusy(false)
    }
  }

  const wrapClass = [styles.wrap, variant === 'docked' && styles.docked, className].filter(Boolean).join(' ')
  const showStatusRow = caps.statusRow && (job.state !== 'idle' || artifacts.length > 0)

  return (
    <div className={wrapClass}>
      <div className={styles.header}>
        <Persona name={caps.agentName ?? 'Agent'} size="sm" state={busy ? 'thinking' : 'idle'} />
        {showStatusRow && (
          <div className={`${styles.statusRow} ${STATUS_TONE[job.state]}`}>
            {job.label && <span className={styles.statusLabel}>{job.label}</span>}
            {artifacts.map((a, i) => <StatusChip key={i} a={a} />)}
          </div>
        )}
      </div>

      <ChatThread ref={threadRef} className={styles.thread}>
        {messages.map((m) => (
          <ChatBubble key={m.id} from={m.role} variant={m.role === 'assistant' ? 'plain' : 'bubble'}>
            {m.content || (busy ? <TypingIndicator /> : '')}
          </ChatBubble>
        ))}
      </ChatThread>

      <ChatComposer onSubmit={(e) => { e.preventDefault(); send() }}>
        <ChatComposerField>
          <ChatComposerTextarea
            value={input}
            placeholder={caps.placeholder ?? 'Ask anything…'}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          />
          <ChatComposerToolbar>
            <ChatComposerTools>
              {caps.models && caps.models.length > 0 && (
                <SegmentedControl size="sm" options={caps.models} value={model} onChange={setModel} />
              )}
            </ChatComposerTools>
            <ChatComposerSubmit disabled={busy || !input.trim()} aria-label="Send" />
          </ChatComposerToolbar>
        </ChatComposerField>
      </ChatComposer>
    </div>
  )
}
