import * as React from 'react'
import styles from './Tag.module.scss'

export type TagTone = 'active' | 'positive' | 'warning' | 'error' | 'neutral'

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic style — mirrors the Figma Tag variants (Style=…). */
  tone?: TagTone
}

/**
 * Status tag: a tinted label chip for states like Active / Positive / Warning /
 * Error / Neutral. Distinct from `TagPill`, which renders user-colored content
 * tags inside `TagSelector`.
 */
export function Tag({ tone = 'neutral', className, children, ...rest }: TagProps) {
  return (
    <span
      className={[styles.tag, styles[tone], className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </span>
  )
}
