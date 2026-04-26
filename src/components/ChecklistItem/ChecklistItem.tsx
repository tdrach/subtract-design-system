'use client'

import { ReactNode } from 'react'
import styles from './ChecklistItem.module.scss'

export interface ChecklistItemProps {
  checked?: boolean
  done?: boolean
  onCheckedChange?: (checked: boolean) => void
  children: ReactNode
  trailing?: ReactNode
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
  className?: string
}

export function ChecklistItem({
  checked = false,
  done = false,
  onCheckedChange,
  children,
  trailing,
  dragHandleProps,
  className,
}: ChecklistItemProps) {
  return (
    <div className={[styles.item, done ? styles.done : '', className].filter(Boolean).join(' ')}>
      {dragHandleProps && (
        <div className={styles.dragHandle} {...dragHandleProps}>
          ⠿
        </div>
      )}
      <button
        type="button"
        className={`${styles.check} ${checked ? styles.checked : ''}`}
        onClick={() => onCheckedChange?.(!checked)}
        aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
      />
      <div className={styles.content}>{children}</div>
      {trailing && <div className={styles.trailing}>{trailing}</div>}
    </div>
  )
}
