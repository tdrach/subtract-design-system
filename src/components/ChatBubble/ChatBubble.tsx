import * as React from 'react'
import styles from './ChatBubble.module.scss'

export type ChatRole = 'user' | 'assistant' | 'system'
export type ChatBubbleTone = 'default' | 'error'
export type ChatBubbleVariant = 'bubble' | 'plain'
export type ChatBubbleGroup = 'single' | 'first' | 'middle' | 'last'
export type ChatDeliveryStatus =
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'

export interface ChatBubbleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Who sent the message — drives alignment and color. */
  from: ChatRole
  /** `bubble` (default, iMessage style) or `plain` (full-width, no fill — Claude style). */
  variant?: ChatBubbleVariant
  /** Visual tone. `error` tints the bubble with the error token. */
  tone?: ChatBubbleTone
  /** Position within a run of same-sender messages — controls corner rounding. */
  group?: ChatBubbleGroup
  /** Optional avatar rendered on the sender's outer edge (typically assistant). */
  avatar?: React.ReactNode
  /** iMessage-style delivery line shown under the bubble (user side). */
  status?: ChatDeliveryStatus
  /** Small timestamp / meta line shown under the bubble. */
  timestamp?: React.ReactNode
  children?: React.ReactNode
}

const STATUS_LABEL: Record<ChatDeliveryStatus, string> = {
  sending: 'Sending…',
  sent: 'Sent',
  delivered: 'Delivered',
  read: 'Read',
  failed: 'Not Delivered',
}

export function ChatBubble({
  from,
  variant = 'bubble',
  tone = 'default',
  group = 'single',
  avatar,
  status,
  timestamp,
  className,
  children,
  ...rest
}: ChatBubbleProps) {
  const rowClass = [
    styles.row,
    styles[`from-${from}`],
    avatar ? styles.hasAvatar : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const bubbleClass = [
    styles.bubble,
    styles[`v-${variant}`],
    styles[`from-${from}`],
    tone === 'error' ? styles.error : null,
    styles[`group-${group}`],
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rowClass} {...rest}>
      {avatar ? <span className={styles.avatar}>{avatar}</span> : null}
      <div className={styles.stack}>
        <div className={bubbleClass}>{children}</div>
        {(status || timestamp) && (
          <div className={styles.meta}>
            {timestamp ? <span className={styles.timestamp}>{timestamp}</span> : null}
            {status ? (
              <span
                className={[
                  styles.status,
                  status === 'read' ? styles.statusRead : null,
                  status === 'failed' ? styles.statusFailed : null,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {STATUS_LABEL[status]}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
