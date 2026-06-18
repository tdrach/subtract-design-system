// ─── AgentChat adapter contract ───────────────────────────────────────────────
// The seam that lets one chat shell drive any backend. The shell (AgentChat)
// owns presentation + interaction; an adapter owns "where messages go and what
// happens" — a plain LLM endpoint, a task-aware assistant, or a coding agent
// that opens PRs. Swap the adapter, keep the UI.
//
// PROTOTYPE STATUS: interface + in-memory mock adapters for play. No real
// transport yet. See README.md.

/** Lifecycle of a (possibly long-running) agent job bound to a thread. */
export type AgentJobState =
  | 'idle'
  | 'queued'
  | 'working'
  | 'awaiting_review'
  | 'succeeded'
  | 'failed'

/** A link-out artifact the shell renders as a status chip (never a diff viewer). */
export interface AgentArtifact {
  kind: 'pr' | 'preview' | 'ci' | 'link'
  label: string
  url?: string
  state?: 'pending' | 'success' | 'failure'
}

export interface AgentMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  artifacts?: AgentArtifact[]
}

/** Streamed back from `send()` — text deltas, job status, and artifacts. */
export type AgentEvent =
  | { type: 'text'; delta: string }
  | { type: 'status'; state: AgentJobState; label?: string }
  | { type: 'artifact'; artifact: AgentArtifact }
  | { type: 'done' }
  | { type: 'error'; message: string }

/** Declarative affordances — lets the shell stay dumb about the backend. */
export interface AgentCapabilities {
  /** Show a model picker when provided. */
  models?: { label: string; value: string }[]
  placeholder?: string
  agentName?: string
  /** Render the job status row (PR / preview / CI chips) — true for the coding agent. */
  statusRow?: boolean
}

export interface AgentAdapter {
  capabilities?: AgentCapabilities
  /** Resume a thread's prior messages (and, implicitly, its branch/PR). */
  load?(threadId: string): Promise<AgentMessage[]>
  /**
   * Send a user message and stream events back. The SAME threadId continues the
   * same job/branch — this is what keeps iteration on one surface.
   */
  send(threadId: string, text: string, opts: { model?: string }): AsyncIterable<AgentEvent>
  /** Poll a long-running job's status for threads that aren't actively streaming. */
  getStatus?(threadId: string): Promise<{ state: AgentJobState; label?: string; artifacts?: AgentArtifact[] }>
}

// ─── Mock adapters (for the preview / playing) ─────────────────────────────────

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Streams a canned reply token-by-token — proves the plain-chat path. */
export function createEchoAdapter(agentName = 'Echo'): AgentAdapter {
  return {
    capabilities: {
      agentName,
      placeholder: `Message ${agentName}…`,
      models: [
        { label: 'Haiku', value: 'haiku' },
        { label: 'Sonnet', value: 'sonnet' },
        { label: 'Opus', value: 'opus' },
      ],
    },
    async *send(_threadId, text, opts) {
      yield { type: 'status', state: 'working' }
      await wait(250)
      const reply = `You said "${text}". (echoed via the **${opts.model ?? 'haiku'}** adapter — this is the same shell any product would drop in)`
      for (const word of reply.split(' ')) {
        yield { type: 'text', delta: word + ' ' }
        await wait(40)
      }
      yield { type: 'status', state: 'idle' }
      yield { type: 'done' }
    },
  }
}

/**
 * Simulates a coding agent: narrates work, then surfaces PR / preview / CI
 * chips and a review-ready state — the affordances the real builder adapter
 * would emit, with zero infra. Lets you feel the coding-agent UX in the preview.
 */
export function createMockBuilderAdapter(): AgentAdapter {
  return {
    capabilities: { agentName: 'Forge', placeholder: 'Describe a change to make…', statusRow: true },
    async *send(_threadId, text) {
      yield { type: 'status', state: 'queued', label: 'Spinning up a workspace…' }
      await wait(500)
      yield { type: 'status', state: 'working', label: 'Reading the repo & making changes…' }
      for (const chunk of [
        `On it. I'll `, `implement: “${text}”. `,
        `Branching off main, editing the relevant files, running the build…`,
      ]) {
        yield { type: 'text', delta: chunk }
        await wait(180)
      }
      await wait(400)
      yield { type: 'artifact', artifact: { kind: 'ci', label: 'build', state: 'pending' } }
      await wait(700)
      yield { type: 'artifact', artifact: { kind: 'ci', label: 'build passing', state: 'success' } }
      yield { type: 'artifact', artifact: { kind: 'pr', label: 'PR #42', url: '#', state: 'success' } }
      yield { type: 'artifact', artifact: { kind: 'preview', label: 'Preview ↗', url: '#', state: 'success' } }
      yield { type: 'text', delta: `\n\nDone — opened a PR and a preview. Want me to tweak anything? (this thread stays on the same branch)` }
      yield { type: 'status', state: 'awaiting_review', label: 'PR open · awaiting review' }
      yield { type: 'done' }
    },
  }
}
