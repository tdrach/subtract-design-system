'use client'

import * as Radix from '@radix-ui/react-dialog'
import styles from './Dialog.module.scss'

export const Dialog = Radix.Root
export const DialogTrigger = Radix.Trigger
export const DialogClose = Radix.Close

export function DialogContent({
  children,
  width = 'md',
}: {
  children: React.ReactNode
  width?: 'sm' | 'md' | 'lg'
}) {
  return (
    <Radix.Portal>
      <Radix.Overlay className={styles.overlay} />
      <Radix.Content className={`${styles.content} ${styles[width]}`}>
        {children}
      </Radix.Content>
    </Radix.Portal>
  )
}

export function DialogHeader({
  title,
  onClose,
}: {
  title?: string
  onClose?: () => void
}) {
  return (
    <div className={styles.header}>
      {title && <Radix.Title className={styles.title}>{title}</Radix.Title>}
      <Radix.Close className={styles.closeBtn} onClick={onClose} aria-label="Close">
        ✕
      </Radix.Close>
    </div>
  )
}

export function DialogBody({ children }: { children: React.ReactNode }) {
  return <div className={styles.body}>{children}</div>
}
