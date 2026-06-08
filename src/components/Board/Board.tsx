'use client'

import * as React from 'react'
import styles from './Board.module.scss'

// ─── Board (horizontal scroll container) ──────────────────────────────────────

export type BoardProps = React.HTMLAttributes<HTMLDivElement>

export function Board({ className, ...rest }: BoardProps) {
  return (
    <div
      className={[styles.board, className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}

// ─── BoardColumn (fixed-width column shell) ───────────────────────────────────

export interface BoardColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column width in px (default 288). */
  width?: number
}

export function BoardColumn({ width, className, style, ...rest }: BoardColumnProps) {
  return (
    <div
      className={[styles.column, className].filter(Boolean).join(' ')}
      style={{ ...(width ? { width } : null), ...style }}
      {...rest}
    />
  )
}

// ─── BoardColumnHeader (label pill + count + action) ──────────────────────────

export interface BoardColumnHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  label: React.ReactNode
  /** Hex color for the tinted label pill (TagPill treatment). Plain when omitted. */
  color?: string
  /** Item count shown after the label. */
  count?: number
  /** Right-aligned action slot (e.g. a "+" button). */
  action?: React.ReactNode
}

export function BoardColumnHeader({
  label,
  color,
  count,
  action,
  className,
  ...rest
}: BoardColumnHeaderProps) {
  return (
    <div
      className={[styles.columnHeader, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {color ? (
        <span
          className={styles.labelPill}
          style={{ background: `${color}1f`, color }}
        >
          {label}
        </span>
      ) : (
        <span className={styles.labelPlain}>{label}</span>
      )}
      {typeof count === 'number' ? (
        <span className={styles.count}>{count}</span>
      ) : null}
      {action ? <span className={styles.headerAction}>{action}</span> : null}
    </div>
  )
}

// ─── BoardColumnBody (droppable list region) ──────────────────────────────────

export const BoardColumnBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function BoardColumnBody({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      className={[styles.columnBody, className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
})

// ─── BoardCard (white surface card) ───────────────────────────────────────────

export interface BoardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spread drag attributes/listeners here (whole-card drag). */
  dragHandleProps?: React.HTMLAttributes<HTMLElement>
  /** Origin card while a drag is in flight — dimmed. */
  isDragging?: boolean
  /** The clone rendered inside a DragOverlay — elevated, full opacity. */
  isOverlay?: boolean
  /** Adds hover/cursor affordance for click-to-open. */
  interactive?: boolean
}

export const BoardCard = React.forwardRef<HTMLDivElement, BoardCardProps>(
  function BoardCard(
    {
      dragHandleProps,
      isDragging = false,
      isOverlay = false,
      interactive = false,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    // Whole-card drag → show the grab cursor (grabbing while in flight).
    const draggable = Boolean(dragHandleProps) || isOverlay
    return (
      <div
        ref={ref}
        className={[
          styles.card,
          interactive ? styles.cardInteractive : null,
          draggable ? styles.cardDraggable : null,
          isDragging ? styles.cardDragging : null,
          isOverlay ? styles.cardOverlay : null,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...dragHandleProps}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

// ─── BoardCardTitle / BoardCardMeta ───────────────────────────────────────────

export function BoardCardTitle({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[styles.cardTitle, className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}

export function BoardCardMeta({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[styles.cardMeta, className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}

// ─── BoardCardAdd ("+ New page") ──────────────────────────────────────────────

export interface BoardCardAddProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: React.ReactNode
}

export function BoardCardAdd({
  label = 'New page',
  className,
  type = 'button',
  children,
  ...rest
}: BoardCardAddProps) {
  return (
    <button
      type={type}
      className={[styles.cardAdd, className].filter(Boolean).join(' ')}
      {...rest}
    >
      <span className={styles.cardAddPlus} aria-hidden="true">+</span>
      {children ?? label}
    </button>
  )
}

// ─── BoardDropIndicator ───────────────────────────────────────────────────────

export function BoardDropIndicator({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="presentation"
      className={[styles.dropIndicator, className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}
