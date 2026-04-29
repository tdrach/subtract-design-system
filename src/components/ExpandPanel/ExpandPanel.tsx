'use client'

import * as Radix from '@radix-ui/react-dialog'
import styles from './ExpandPanel.module.scss'

// ─── Primitives (compose freely) ──────────────────────────────────────────────
export const ExpandPanel        = Radix.Root
export const ExpandPanelTrigger = Radix.Trigger
export const ExpandPanelClose   = Radix.Close

// ─── Content shell ────────────────────────────────────────────────────────────
export function ExpandPanelContent({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <Radix.Portal>
      <Radix.Overlay className={styles.overlay} />
      <Radix.Content className={styles.panel} aria-describedby={undefined}>
        <div className={styles.topBar}>
          {title
            ? <Radix.Title className={styles.title}>{title}</Radix.Title>
            : <div />}
          <Radix.Close className={styles.closeBtn} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </Radix.Close>
        </div>
        <div className={styles.body}>{children}</div>
      </Radix.Content>
    </Radix.Portal>
  )
}

// ─── Optional layout helpers (use inside body) ────────────────────────────────
export function ExpandPanelBody({ children, narrow = false }: { children: React.ReactNode; narrow?: boolean }) {
  return (
    <div className={`${styles.bodyInner} ${narrow ? styles.narrow : ''}`}>
      {children}
    </div>
  )
}
