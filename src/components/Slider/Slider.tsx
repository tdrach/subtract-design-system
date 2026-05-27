'use client'

import * as RadixSlider from '@radix-ui/react-slider'
import styles from './Slider.module.scss'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SliderProps {
  /** Current value(s). Pass a 2-element array for a range slider. */
  value?: number[]
  /** Default value(s) for uncontrolled usage. */
  defaultValue?: number[]
  /** Called with the new value array on every change. */
  onValueChange?: (value: number[]) => void
  /** Called when the user finishes dragging. */
  onValueCommit?: (value: number[]) => void
  /** Minimum value. Defaults to 0. */
  min?: number
  /** Maximum value. Defaults to 100. */
  max?: number
  /** Step increment. Defaults to 1. */
  step?: number
  /** Disable interaction. */
  disabled?: boolean
  /** Accessible label for screen readers. */
  'aria-label'?: string
  /** Accessible label id. */
  'aria-labelledby'?: string
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Slider({
  value,
  defaultValue = [0],
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: SliderProps) {
  const thumbCount = (value ?? defaultValue).length

  return (
    <RadixSlider.Root
      className={[styles.root, disabled ? styles.disabled : ''].filter(Boolean).join(' ')}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      onValueCommit={onValueCommit}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
    >
      <RadixSlider.Track className={styles.track}>
        <RadixSlider.Range className={styles.range} />
      </RadixSlider.Track>

      {Array.from({ length: thumbCount }).map((_, i) => (
        <RadixSlider.Thumb
          key={i}
          className={styles.thumb}
          aria-label={thumbCount > 1 ? `${ariaLabel ?? 'Value'} ${i + 1}` : ariaLabel}
          aria-labelledby={ariaLabelledBy}
        />
      ))}
    </RadixSlider.Root>
  )
}
