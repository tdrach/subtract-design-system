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
  children,
  ...rest
}: ButtonGroupProps) {
  const groupRef = React.useRef<HTMLDivElement>(null)
  const indicatorRef = React.useRef<HTMLSpanElement>(null)
  const hasPlacedRef = React.useRef(false)
  const [active, setActive] = React.useState(false)

  // Move/resize the shared pill to sit exactly over the selected segment. Size
  // and position are measured here; the motion between positions lives in CSS.
  const place = React.useCallback((animate: boolean) => {
    const group = groupRef.current
    const indicator = indicatorRef.current
    if (!group || !indicator) return
    const selected = group.querySelector<HTMLElement>('[data-selected]')
    if (!selected) {
      indicator.style.opacity = '0' // action cluster / nothing selected — no pill
      return
    }
    const g = group.getBoundingClientRect()
    const s = selected.getBoundingClientRect()
    if (!animate) indicator.style.transitionDuration = '0ms'
    indicator.style.opacity = '1'
    indicator.style.width = `${s.width}px`
    indicator.style.height = `${s.height}px`
    indicator.style.transform = `translate(${s.left - g.left}px, ${s.top - g.top}px)`
    if (!animate) {
      void indicator.offsetWidth // commit the jump, then hand motion back to CSS
      indicator.style.transitionDuration = ''
    }
  }, [])

  // Re-place on every render (selection / children change). First placement is
  // instant — the pill shouldn't slide in from the origin on mount; only later
  // selection changes animate.
  React.useLayoutEffect(() => {
    place(hasPlacedRef.current)
    hasPlacedRef.current = true
    if (!active) setActive(true)
  })

  // Track container resizes (responsive layouts) — reposition without sliding.
  React.useLayoutEffect(() => {
    const group = groupRef.current
    if (!group) return
    const ro = new ResizeObserver(() => place(false))
    ro.observe(group)
    return () => ro.disconnect()
  }, [place])

  return (
    <div
      ref={groupRef}
      role="group"
      className={[styles.group, styles[orientation], active && styles.animated, className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <span ref={indicatorRef} className={styles.indicator} aria-hidden="true" />
      {children}
    </div>
  )
}

// ─── ButtonGroupItem (selectable segment) ─────────────────────────────────────

export interface ButtonGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Marks this segment as the current selection. */
  selected?: boolean
  /** Segment size. `sm` is the only size — kept as a prop for forward room. */
  size?: 'sm'
  /** Icon rendered before the label. */
  iconBefore?: React.ReactNode
  /** Icon rendered after the label. */
  iconAfter?: React.ReactNode
  /** Square icon-only segment (no label padding). */
  iconOnly?: boolean
}

export function ButtonGroupItem({
  selected = false,
  size = 'sm',
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
