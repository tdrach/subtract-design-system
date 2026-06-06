'use client'

import * as React from 'react'
import styles from './ButtonGroup.module.scss'

// ─── ButtonGroup (container) ──────────────────────────────────────────────────

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lay the segments out in a row (default) or a column. */
  orientation?: 'horizontal' | 'vertical'
}

/**
 * Joins its direct children — `ButtonGroupItem`s, DS `Button`s, links, or any
 * button-like element — into a single connected unit: inner corners square off
 * and adjacent borders merge. Use for single-select segmented controls (model
 * pickers, view toggles) or for clustering related actions.
 */
export function ButtonGroup({
  orientation = 'horizontal',
  className,
  ...rest
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={[styles.group, styles[orientation], className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  )
}

// ─── ButtonGroupItem (selectable segment) ─────────────────────────────────────

export interface ButtonGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Marks this segment as the current selection. */
  selected?: boolean
  size?: 'sm' | 'md'
  /** Icon rendered before the label. */
  iconBefore?: React.ReactNode
  /** Icon rendered after the label. */
  iconAfter?: React.ReactNode
  /** Square icon-only segment (no label padding). */
  iconOnly?: boolean
}

export function ButtonGroupItem({
  selected = false,
  size = 'md',
  iconBefore,
  iconAfter,
  iconOnly = false,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonGroupItemProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      data-selected={selected || undefined}
      className={[
        styles.item,
        styles[`size-${size}`],
        selected ? styles.selected : null,
        iconOnly ? styles.iconOnly : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {iconBefore ? <span className={styles.itemIcon}>{iconBefore}</span> : null}
      {children}
      {iconAfter ? <span className={styles.itemIcon}>{iconAfter}</span> : null}
    </button>
  )
}

// ─── ButtonGroupSeparator ─────────────────────────────────────────────────────

export function ButtonGroupSeparator({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      role="separator"
      aria-orientation="vertical"
      className={[styles.separator, className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}

// ─── ButtonGroupText (non-interactive addon) ──────────────────────────────────

export function ButtonGroupText({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={[styles.text, className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}
