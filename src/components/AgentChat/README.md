# AgentChat (prototype — `feat/agent-chat-shell`)

A **backend-agnostic agent chat shell.** One reusable component that owns all the
chat UX; everything product-specific is supplied by a swappable **adapter**. The
idea: drop the same chat into any product, restyle it, and attach your
product/git/infra behind the scenes. A coding agent that opens PRs is just one
adapter — same UI, different backend.

> Status: exploratory. The shell + adapter contract are real and runnable; the
> only adapters so far are in-memory mocks for the preview. No transport,
> persistence, or real agent is wired yet. **No PR — playground branch.**

## The three layers

1. **Shell (`AgentChat.tsx`)** — thread, bubbles, composer, model picker,
   persona, and a status row. Knows nothing about where messages go.
2. **Adapter (`adapter.ts`)** — the seam. Implements:
   - `send(threadId, text, opts) → AsyncIterable<AgentEvent>` — stream text
     deltas, job-status updates, and artifacts.
   - `load?(threadId)` / `getStatus?(threadId)` — resume a thread (and, for the
     coding agent, its branch/PR) so iteration stays on one surface.
   - `capabilities` — declarative affordances (models, placeholder, agent name,
     whether to show the PR/preview/CI status row).
3. **Capabilities / events** — the shell renders whatever the adapter emits:
   plain text, plus structured `artifact` chips (PR / preview / CI). New use
   cases add event/chip types, not new UI primitives.

```
<AgentChat adapter={x} />     // same shell everywhere
  x = echo adapter        → plain LLM chat
  x = task adapter        → task-aware assistant (today's Athena/Odin)
  x = builder adapter     → coding agent: streams status, opens a PR, links a preview
```

## Why a shell + adapter (and not N chat components)

In the OS, `AgentChat` and `OrchestratorChat` are ~820 lines that import the
identical chat primitives and both already render structured non-text cards
(reorder proposals, tool events). They're one shell instantiated twice with
different backends. This generalizes that: build the chat UX once, vary the
backend.

## The one thing beyond a normal chat

A coding agent's work is **long-running and async** (minutes), survives
navigation, has lifecycle state (`queued → working → awaiting_review →
succeeded/failed`), and is **resumable** so follow-ups land on the same branch.
That's why the adapter has `getStatus()` and a `status` event — the shell can
show "working · PR #42 · build passing" on a thread even when you weren't
watching. Design for this up front; a pure request/response chat can't model it.

## Try it

In the DS preview (`preview/`), the AgentChat section renders two live mock
adapters:
- **Echo** — streams a canned reply (proves the plain-chat path + model picker).
- **Forge (mock builder)** — narrates work, then surfaces CI → PR → preview
  chips and an "awaiting review" state, so you can feel the coding-agent UX with
  zero infra.

```tsx
import { AgentChat, createMockBuilderAdapter } from '@clawmachine/ds'

<AgentChat adapter={createMockBuilderAdapter()} variant="docked" />
```

## Not built yet (next, when we return to this)
- Real adapters: a task adapter over the OS API routes; a builder adapter over
  the Claude Agent SDK / a GitHub-Action proxy (see the OS exploration notes).
- Persistence + thread resume against a real store.
- Markdown rendering in bubbles (the OS has a renderer to lift up here).
- Streaming cancel, error/retry affordances, dictation (the OS `AgentChat` has these).
