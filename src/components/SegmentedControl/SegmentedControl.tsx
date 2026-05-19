'use client'

import styles from './SegmentedControl.module.scss'

export interface SegmentedControlOption {
  label: string
  value: string
}

export interface SegmentedControlProps {
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
}: SegmentedControlProps) {
  return (
    <div
      role="group"
      className={[
        styles.root,
        size === 'md' ? styles.md : styles.sm,
        className,
      ].filter(Boolean).join(' ')}
    >
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          className={[styles.btn, opt.value === value ? styles.active : ''].filter(Boolean).join(' ')}
          onClick={() => onChange(opt.value)}
          aria-pressed={opt.value === value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
