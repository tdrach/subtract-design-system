'use client'

import type { ButtonHTMLAttributes } from 'react'
import styles from './IconButton.module.scss'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Pressed/engaged state — $demure fill (a split toggle that's split,
   *  a popover trigger that's open). */
  active?: boolean
  /** @default 'dense' — the field-adjacent square, exactly
   *  $control-height-dense so it lines up with sm inputs by definition. */
  size?: 'dense'
}

/** Square icon button of the Dense control family. Field-adjacent controls
 *  (split toggles, fit knobs, tiny popover triggers) use THIS instead of
 *  hand-rolled buttons, so their height can never drift from the inputs'. */
export function IconButton({ active, size = 'dense', className, type = 'button', children, ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      className={[styles.iconButton, styles[size], active ? styles.active : null, className]
        .filter(Boolean).join(' ')}
      aria-pressed={active}
      {...rest}
    >
      {children}
    </button>
  )
}

export default IconButton
