'use client'

import React from 'react'
import Link from 'next/link'
import styles from './Button.module.scss'

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: 'primary' | 'secondary' | 'gray'
  size?: 'sm' | 'md'
  href?: string
  external?: boolean
  split?: boolean
  /** Renders a square icon-only button — no label padding, width = height */
  iconOnly?: boolean
  /** Disables the tactile scale-on-press (use when the motion would distract). */
  static?: boolean
  /** Icon rendered before the label */
  iconBefore?: React.ReactNode
  /** Icon rendered after the label */
  iconAfter?: React.ReactNode
  onDropdownClick?: () => void
  children?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    href,
    external,
    split = false,
    iconOnly = false,
    static: isStatic = false,
    iconBefore,
    iconAfter,
    onDropdownClick,
    className: extraClass,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  const baseClass = [
    styles.button,
    styles[variant],
    styles[size],
    iconOnly && styles.iconOnly,
    isStatic && styles.static,
    extraClass,
  ].filter(Boolean).join(' ')

  // ─── Split button ────────────────────────────────────────────────────────
  if (split) {
    return (
      <div className={[styles.splitGroup, styles[variant], styles[size]].filter(Boolean).join(' ')}>
        <button
          type={type}
          className={styles.splitMain}
          disabled={rest.disabled}
          onClick={rest.onClick}
        >
          {iconBefore}
          {children}
          {iconAfter}
        </button>
        <button
          type="button"
          className={styles.splitChevron}
          disabled={rest.disabled}
          onClick={onDropdownClick}
          aria-label="More options"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    )
  }

  // ─── Link button ─────────────────────────────────────────────────────────
  if (href) {
    return external ? (
      <a href={href} className={baseClass} target="_blank" rel="noopener noreferrer">
        {iconBefore}{children}{iconAfter}
      </a>
    ) : (
      <Link href={href} className={baseClass}>
        {iconBefore}{children}{iconAfter}
      </Link>
    )
  }

  return (
    <button ref={ref} type={type} className={baseClass} {...rest}>
      {iconBefore}
      {children}
      {iconAfter}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
