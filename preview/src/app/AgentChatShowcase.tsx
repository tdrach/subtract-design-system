'use client'

import { AgentChat, createEchoAdapter, createMockBuilderAdapter } from '@subtract/ds'
import { useMemo } from 'react'
import styles from './page.module.scss'

/**
 * Demonstrates the backend-agnostic AgentChat shell driven by two different
 * mock adapters — the SAME component, different backend. See the component's
 * README for the architecture.
 */
export function AgentChatShowcase() {
  // Adapters are stateless factories; memoize so identity is stable across renders.
  const echo = useMemo(() => createEchoAdapter('Echo'), [])
  const builder = useMemo(() => createMockBuilderAdapter(), [])

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>AgentChat (shell + adapter — prototype)</h2>
      <p className={styles.sectionNote}>
        One backend-agnostic chat shell. Swap the <code>adapter</code> to repoint the
        same UI at any product. Below: a plain echo adapter, and a mock “builder”
        adapter that simulates a coding agent opening a PR.
      </p>

      <div className={styles.agentGrid}>
        <div className={styles.agentDemo}>
          <h3 className={styles.agentDemoTitle}>Echo adapter — plain chat</h3>
          <AgentChat adapter={echo} threadId="demo-echo" variant="docked" />
        </div>

        <div className={styles.agentDemo}>
          <h3 className={styles.agentDemoTitle}>Mock builder adapter — coding agent</h3>
          <AgentChat adapter={builder} threadId="demo-builder" variant="docked" />
        </div>
      </div>
    </section>
  )
}
