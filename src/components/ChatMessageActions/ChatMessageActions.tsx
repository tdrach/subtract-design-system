'use client'

import * as React from 'react'
import styles from './ChatMessageActions.module.scss'

export interface ChatMessageActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Align the action row to the message's sender edge. */
  align?: 'start' | 'end'
  /** Reveal on hover/focus of the parent group only (default false = always shown). */
  revealOnHover?: boolean
}

/** A row of small icon buttons shown beneath a message (copy, retry, like…). */
export function ChatMessageActions({
  align = 'start',
  revealOnHover = false,
  className,
  ...rest
}: ChatMessageActionsProps) {
  return (
    <div
      className={[
        styles.actions,
        align === 'end' ? styles.alignEnd : styles.alignStart,
        revealOnHover ? styles.revealOnHover : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  )
}

export interface ChatMessageActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label (also used as the native tooltip). */
  label: string
  /** Icon node. */
  children: React.ReactNode
  /** Marks the action as active/toggled (e.g. a liked state). */
  active?: boolean
}

export function ChatMessageAction({
  label,
  active = false,
  className,
  children,
  type = 'button',
  ...rest
}: ChatMessageActionProps) {
  return (
    <button
      type={type}
      className={[styles.action, active ? styles.active : null, className]
        .filter(Boolean)
        .join(' ')}
      aria-label={label}
      aria-pressed={active || undefined}
      title={label}
      {...rest}
    >
      {children}
    </button>
  )
}
