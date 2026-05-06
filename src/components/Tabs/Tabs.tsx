'use client'

import React from 'react'
import styles from './Tabs.module.scss'

// ─── TabBar ───────────────────────────────────────────────────────────────────

export interface TabBarProps {
  /** Accessible label for the nav element */
  ariaLabel?: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /** Show the bottom border rule. Defaults to true. */
  border?: boolean
}

export function TabBar({ ariaLabel = 'Navigation', children, className, style, border = true }: TabBarProps) {
  return (
    <nav
      className={[styles.tabBar, !border && styles.tabBarNoBorder, className].filter(Boolean).join(' ')}
      role="tablist"
      aria-label={ariaLabel}
      style={style}
    >
      {children}
    </nav>
  )
}

// ─── Tab ─────────────────────────────────────────────────────────────────────

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether this tab is the currently selected one */
  active?: boolean
  children: React.ReactNode
}

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  function Tab({ active = false, children, className, ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={active}
        className={[styles.tab, active && styles.tabActive, className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </button>
    )
  }
)
