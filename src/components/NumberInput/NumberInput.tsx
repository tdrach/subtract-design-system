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
 * Tiny arithmetic for the draft — Figma-style: "180+20/2" commits as 190.
 * Four operators, parentheses, unary minus, decimals; ×/÷/− glyphs accepted.
 * Recursive descent, no eval(), no identifiers — anything else parses to NaN
 * and the field reverts exactly like any other bad draft.
 */
function evalExpression(src: string): number {
  const s = src.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\s+/g, '')
  let i = 0
  const number = (): number => {
    const start = i
    while (i < s.length && /[0-9.]/.test(s[i])) i++
    return start === i ? NaN : parseFloat(s.slice(start, i))
  }
  const factor = (): number => {
    if (s[i] === '-') { i++; return -factor() }
    if (s[i] === '+') { i++; return factor() }
    if (s[i] === '(') {
      i++
      const v = expr()
      if (s[i] !== ')') return NaN
      i++
      return v
    }
    return number()
  }
  const term = (): number => {
    let v = factor()
    while (s[i] === '*' || s[i] === '/') {
      const op = s[i++]
      const r = factor()
      v = op === '*' ? v * r : v / r
    }
    return v
  }
  const expr = (): number => {
    let v = term()
    while (s[i] === '+' || s[i] === '-') {
      const op = s[i++]
      const r = term()
      v = op === '+' ? v + r : v - r
    }
    return v
  }
  const v = expr()
  return i === s.length && Number.isFinite(v) ? v : NaN
}

/**
 * Dense numeric field with a draft-while-typing buffer (commit on blur/Enter),
 * Figma-style arrow-key stepping, and basic math on commit — type "180+20",
 * "42*3" or "(17+4)/2" and the field resolves it. Editing is resolution-
 * independent: the parent owns the number and any clamping beyond `min`/`max`.
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
      const v = evalExpression(t)
      if (!Number.isNaN(v)) onChange(clamp(round(v)))
    }
    setDraft(null)
  }

  // ↑/↓ step by `step` (Shift ×10). Operates on the in-progress draft if any
  // (expressions resolve first — "180+20" then ↑ steps from 200), else the
  // committed value; commits immediately so parent clamping shows through.
  const stepBy = (dir: 1 | -1, shift: boolean) => {
    if (disabled) return
    const draftVal = draft !== null && draft.trim() !== '' ? evalExpression(draft) : NaN
    const base = Number.isNaN(draftVal) ? value : draftVal
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
