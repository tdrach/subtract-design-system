'use client'

import * as React from 'react'
import styles from './ChatComposer.module.scss'

// ─── ChatComposer (form shell) ────────────────────────────────────────────────

export interface ChatComposerProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** `inline` (borderless) or `docked` (bordered, rounded card pinned to a page). */
  variant?: 'inline' | 'docked'
  /** Called when the composer is submitted (Enter or the send button). */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

export function ChatComposer({
  variant = 'docked',
  className,
  onSubmit,
  children,
  onMouseDown,
  ...rest
}: ChatComposerProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSubmit?.(e)
  }

  // Clicking docked padding should focus the textarea (not steal focus from toolbar buttons).
  function handleMouseDown(e: React.MouseEvent<HTMLFormElement>) {
    const target = e.target as HTMLElement
    if (target.closest('button, a, [role="button"]')) return
    const ta = e.currentTarget.querySelector('textarea')
    if (ta && target !== ta) {
      e.preventDefault()
      ta.focus()
    }
  }

  return (
    <form
      {...rest}
      className={[styles.composer, styles[variant], className]
        .filter(Boolean)
        .join(' ')}
      onSubmit={handleSubmit}
      onMouseDown={(e) => {
        if (variant === 'docked') handleMouseDown(e)
        onMouseDown?.(e)
      }}
    >
      {children}
    </form>
  )
}

// ─── ChatComposerTextarea (auto-resizing input) ───────────────────────────────

export interface ChatComposerTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * How the message is submitted:
   * - `enter` (default): Enter submits, Shift+Enter inserts a newline (desktop).
   * - `button`: Enter inserts a newline; the send button is the only way to
   *   submit (recommended on touch devices — avoids the on-screen keyboard's
   *   return key firing an accidental send).
   */
  submitOn?: 'enter' | 'button'
  /** Max auto-grow height in px before the textarea scrolls (default 140). */
  maxHeight?: number
}

export const ChatComposerTextarea = React.forwardRef<
  HTMLTextAreaElement,
  ChatComposerTextareaProps
>(function ChatComposerTextarea(
  { submitOn = 'enter', maxHeight = 140, className, onKeyDown, onInput, rows = 1, ...rest },
  ref,
) {
  const innerRef = React.useRef<HTMLTextAreaElement>(null)
  React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement)

  const resize = React.useCallback(
    (el: HTMLTextAreaElement) => {
      // Use 0px (not auto) so the field never collapses to an unclickable height while measuring.
      el.style.height = '0px'
      el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
    },
    [maxHeight],
  )

  // Resize when the controlled value changes externally (e.g. cleared on send)
  React.useEffect(() => {
    if (innerRef.current) resize(innerRef.current)
  }, [resize, rest.value])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    onKeyDown?.(e)
    if (e.defaultPrevented) return
    if (submitOn === 'enter' && e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <textarea
      ref={innerRef}
      rows={rows}
      className={[styles.textarea, className].filter(Boolean).join(' ')}
      onKeyDown={handleKeyDown}
      onInput={(e) => {
        resize(e.currentTarget)
        onInput?.(e)
      }}
      {...rest}
    />
  )
})

// ─── ChatComposerToolbar / Tools ──────────────────────────────────────────────

export function ChatComposerToolbar({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[styles.toolbar, className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}

export function ChatComposerTools({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[styles.tools, className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}

// ─── ChatComposerSubmit (Apple-style circular send button) ────────────────────

export type ChatComposerSubmitStatus = 'ready' | 'streaming' | 'error'

export interface ChatComposerSubmitProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Current send state:
   * - `ready`: up-arrow, ready to send (the default).
   * - `streaming`: stop square — pressing it should cancel the in-flight reply.
   * - `error`: warning glyph — the last send failed.
   */
  status?: ChatComposerSubmitStatus
}

export function ChatComposerSubmit({
  status = 'ready',
  disabled,
  className,
  type,
  'aria-label': ariaLabel,
  ...rest
}: ChatComposerSubmitProps) {
  const label =
    ariaLabel ??
    (status === 'streaming' ? 'Stop' : status === 'error' ? 'Retry send' : 'Send')

  return (
    <button
      // `streaming` acts as a stop control, so it's a plain button, not submit.
      type={type ?? (status === 'streaming' ? 'button' : 'submit')}
      className={[styles.submit, styles[`submit-${status}`], className]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      aria-label={label}
      title={label}
      {...rest}
    >
      <span className={styles.submitGlyph}>{renderGlyph(status)}</span>
    </button>
  )
}

function renderGlyph(status: ChatComposerSubmitStatus) {
  if (status === 'streaming') {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="1.5" fill="currentColor" />
      </svg>
    )
  }
  if (status === 'error') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M8 4.2v4.3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="8" cy="11.2" r="1" fill="currentColor" />
      </svg>
    )
  }
  // ready — Apple-style up arrow
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 12.5V4M8 4L4 8M8 4l4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
