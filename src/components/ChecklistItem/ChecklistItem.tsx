'use client'

import { ReactNode, useId } from 'react'
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
  const id = useId()

  return (
    <div className={[styles.item, done ? styles.done : '', className].filter(Boolean).join(' ')}>
      {dragHandleProps && (
        <div className={styles.dragHandle} {...dragHandleProps}>⠿</div>
      )}

      <div className={styles.check}>
        <input
          id={id}
          type="checkbox"
          className={styles.checkInput}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
        />
        <label htmlFor={id} className={styles.checkBox} aria-hidden="true">
          <svg
            className={styles.checkSvg}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              className={styles.checkPath}
              d="M3.94 7L6.13 9.19L10.5 4.81"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </label>
      </div>

      <div className={styles.content}>{children}</div>
      {trailing && <div className={styles.trailing}>{trailing}</div>}
    </div>
  )
}
