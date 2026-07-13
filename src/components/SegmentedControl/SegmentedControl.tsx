'use client'

import type { HTMLAttributes } from 'react'
import styles from './SegmentedControl.module.scss'

export interface SegmentedControlOption {
  /** Text or an icon — pass `title` when the label isn't readable text. */
  label: React.ReactNode
  value: string
  /** Tooltip + accessible name for icon-only labels. */
  title?: string
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SegmentedControlOption[]
  value: string
  onChange: (value: string) => void
  /** @default 'sm' */
  size?: 'sm' | 'md'
  className?: string
}

export function SegmentedControl({
  options,
  value,
  onChange,
  size = 'sm',
  className,
  ...rest
}: SegmentedControlProps) {
  return (
    <div
      role="group"
      className={[
        styles.root,
        size === 'md' ? styles.md : styles.sm,
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          className={styles.btn}
          onClick={(e) => {
            onChange(opt.value)
            e.currentTarget.blur()
          }}
          aria-pressed={opt.value === value}
          title={opt.title}
          aria-label={opt.title}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
