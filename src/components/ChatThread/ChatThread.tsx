'use client'

import * as React from 'react'
import styles from './ChatThread.module.scss'

export interface ChatThreadProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stick to the bottom as new content arrives (default true). */
  autoScroll?: boolean
  /** Distance (px) from the bottom still considered "at bottom" (default 80). */
  bottomThreshold?: number
  /** Receives whether the thread is scrolled away from the bottom. */
  onAtBottomChange?: (atBottom: boolean) => void
}

interface ChatThreadHandle {
  scrollToBottom: (behavior?: ScrollBehavior) => void
  getElement: () => HTMLDivElement | null
}

export const ChatThread = React.forwardRef<ChatThreadHandle, ChatThreadProps>(
  function ChatThread(
    {
      autoScroll = true,
      bottomThreshold = 80,
      onAtBottomChange,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const elRef = React.useRef<HTMLDivElement>(null)
    const atBottomRef = React.useRef(true)

    const isAtBottom = React.useCallback(() => {
      const el = elRef.current
      if (!el) return true
      return el.scrollHeight - el.scrollTop - el.clientHeight <= bottomThreshold
    }, [bottomThreshold])

    const scrollToBottom = React.useCallback((behavior: ScrollBehavior = 'smooth') => {
      const el = elRef.current
      if (!el) return
      el.scrollTo({ top: el.scrollHeight, behavior })
    }, [])

    React.useImperativeHandle(ref, () => ({
      scrollToBottom,
      getElement: () => elRef.current,
    }), [scrollToBottom])

    // Track scroll position → report at-bottom changes
    function handleScroll(e: React.UIEvent<HTMLDivElement>) {
      const atBottom = isAtBottom()
      if (atBottom !== atBottomRef.current) {
        atBottomRef.current = atBottom
        onAtBottomChange?.(atBottom)
      }
      rest.onScroll?.(e)
    }

    // Auto-stick to bottom when children change, but only if already near bottom
    React.useEffect(() => {
      if (!autoScroll) return
      const el = elRef.current
      if (!el) return
      const observer = new MutationObserver(() => {
        if (!atBottomRef.current) return
        // Instant scroll avoids smooth-scroll fighting clicks/focus in the composer.
        scrollToBottom('auto')
      })
      observer.observe(el, { childList: true, subtree: true })
      // Initial snap to bottom on mount
      scrollToBottom('auto')
      return () => observer.disconnect()
    }, [autoScroll, scrollToBottom])

    return (
      <div
        ref={elRef}
        className={[styles.thread, className].filter(Boolean).join(' ')}
        {...rest}
        onScroll={handleScroll}
      >
        {children}
      </div>
    )
  },
)

export interface ChatThreadScrollButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether to show the button (typically: not at bottom). */
  visible?: boolean
}

export function ChatThreadScrollButton({
  visible = true,
  className,
  children,
  ...rest
}: ChatThreadScrollButtonProps) {
  if (!visible) return null

  return (
    <button
      type="button"
      aria-label="Scroll to latest"
      className={[styles.scrollButton, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children ?? (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M8 3v9m0 0L4.5 8.5M8 12l3.5-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}

export type { ChatThreadHandle }
