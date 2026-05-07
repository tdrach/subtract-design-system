'use client'

import * as Radix from '@radix-ui/react-dialog'
import { X } from '@phosphor-icons/react'
import Button from '../Button/Button'
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
      <Radix.Close asChild onClick={onClose}>
        <Button variant="gray" size="sm" iconOnly aria-label="Close">
          <X size={14} weight="bold" />
        </Button>
      </Radix.Close>
    </div>
  )
}

export function DialogBody({ children }: { children: React.ReactNode }) {
  return <div className={styles.body}>{children}</div>
}
