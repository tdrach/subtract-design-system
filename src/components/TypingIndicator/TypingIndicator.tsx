import * as React from 'react'
import styles from './TypingIndicator.module.scss'

export interface TypingIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Render inside an assistant-style bubble surface (default true). */
  bubble?: boolean
  'aria-label'?: string
}

/** Three bouncing dots indicating the assistant is composing a reply. */
export function TypingIndicator({
  bubble = true,
  className,
  'aria-label': ariaLabel = 'Assistant is typing',
  ...rest
}: TypingIndicatorProps) {
  return (
    <div
      className={[
        styles.indicator,
        bubble ? styles.bubble : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-label={ariaLabel}
      {...rest}
    >
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  )
}
