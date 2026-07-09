'use client'

import { useRef, useState } from 'react'
import styles from './NumberInput.module.scss'

export interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  /**
   * Increment for arrow-key stepping. ↑/↓ nudge by `step`, Shift+↑/↓ by `step × 10`
   * (Figma-style). Pick whole numbers for dimensions, fractions for fine values
   * (tolerances, scale factors). Default 1.
   */
  step?: number
  /**
   * Muted prefix rendered inside the field, before the value — e.g. `W`, `X`, `∠`.
   * Lets a labelled dimension field collapse into a single dense control
   * (Figma: the inspector "W 42 mm" input) instead of a separate label + input.
   */
  label?: React.ReactNode
  /** Unit shown inside the field, after the value, e.g. `mm`, `°`, `%`. */
  suffix?: string
  min?: number
  max?: number
  /** Density. `md` (default) = 44px / `$text-base`; `sm` = 28px / `$text-small` dense. */
  size?: 'sm' | 'md'
  disabled?: boolean
  className?: string
  'aria-label'?: string
  /**
   * Fired on focus, before the first `onChange`. Wire an undo/history snapshot
   * here so a whole edit session (typing or arrow-stepping) is one undo step.
   */
  onFocus?: () => void
}

const round = (n: number) => Math.round(n * 1000) / 1000

/**
 * Dense numeric field with a draft-while-typing buffer (commit on blur/Enter)
 * and Figma-style arrow-key stepping. Editing is resolution-independent: the
 * parent owns the number and any clamping beyond `min`/`max`.
 */
export function NumberInput({
  value, onChange, step = 1, label, suffix, min, max, size = 'md', disabled, className,
  onFocus, 'aria-label': ariaLabel,
}: NumberInputProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const display = draft ?? String(round(value))

  const clamp = (n: number) => {
    if (min !== undefined) n = Math.max(min, n)
    if (max !== undefined) n = Math.min(max, n)
    return n
  }

  const commit = () => {
    if (draft === null) return
    const t = draft.trim()
    if (t !== '') {
      const v = parseFloat(t)
      if (!Number.isNaN(v)) onChange(clamp(round(v)))
    }
    setDraft(null)
  }

  // ↑/↓ step by `step` (Shift ×10). Operates on the in-progress draft if any,
  // else the committed value; commits immediately so parent clamping shows through.
  const stepBy = (dir: 1 | -1, shift: boolean) => {
    if (disabled) return
    const base = draft !== null && draft.trim() !== '' && !Number.isNaN(parseFloat(draft))
      ? parseFloat(draft) : value
    onChange(clamp(round(base + dir * step * (shift ? 10 : 1))))
    setDraft(null)
  }

  return (
    <span
      className={[
        styles.wrap,
        size === 'sm' ? styles.sm : styles.md,
        disabled ? styles.disabled : null,
        className,
      ].filter(Boolean).join(' ')}
      // Clicking the label / unit / padding focuses the input — the whole field
      // is one hit target, not just the value glyphs.
      onMouseDown={(e) => {
        if (disabled) return
        if (e.target !== inputRef.current) { e.preventDefault(); inputRef.current?.focus() }
      }}
    >
      {label != null ? <span className={styles.label}>{label}</span> : null}
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        className={styles.input}
        value={display}
        disabled={disabled}
        aria-label={ariaLabel}
        onFocus={() => { onFocus?.(); setDraft(String(round(value))) }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); return }
          if (e.key === 'ArrowUp') { e.preventDefault(); stepBy(1, e.shiftKey) }
          else if (e.key === 'ArrowDown') { e.preventDefault(); stepBy(-1, e.shiftKey) }
        }}
      />
      {suffix ? <span className={styles.suffix}>{suffix}</span> : null}
    </span>
  )
}

export default NumberInput
