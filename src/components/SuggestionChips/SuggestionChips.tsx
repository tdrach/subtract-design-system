'use client'

import * as React from 'react'
import styles from './SuggestionChips.module.scss'

export interface SuggestionChipsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Align chips to the start (assistant side) or end (user side). */
  align?: 'start' | 'end'
}

/** A wrapping row of quick-reply / follow-up suggestion chips. */
export function SuggestionChips({
  align = 'start',
  className,
  ...rest
}: SuggestionChipsProps) {
  return (
    <div
      className={[
        styles.chips,
        align === 'end' ? styles.alignEnd : styles.alignStart,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  )
}

export interface SuggestionChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional leading icon. */
  icon?: React.ReactNode
}

export function SuggestionChip({
  icon,
  className,
  children,
  type = 'button',
  ...rest
}: SuggestionChipProps) {
  return (
    <button
      type={type}
      className={[styles.chip, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {icon ? <span className={styles.chipIcon}>{icon}</span> : null}
      {children}
    </button>
  )
}
