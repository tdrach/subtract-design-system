'use client'

import React from 'react'
import styles from './Tabs.module.scss'

// ─── TabBar ───────────────────────────────────────────────────────────────────

export interface TabBarProps {
  /** Accessible label for the nav element */
  ariaLabel?: string
  children: React.ReactNode
  className?: string
}

export function TabBar({ ariaLabel = 'Navigation', children, className }: TabBarProps) {
  return (
    <nav
      className={[styles.tabBar, className].filter(Boolean).join(' ')}
      role="tablist"
      aria-label={ariaLabel}
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
