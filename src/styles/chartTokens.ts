/** Design token values for SVG charts (mirrors `tokens.scss`, 16px root). */

const ROOT_PX = 16

function rem(value: number) {
  return value * ROOT_PX
}

export const chartColor = {
  /** $black / $ink-dark */
  ink: '#0c0c0c',
  /** $muted */
  muted: '#0c0c0c7a',
  /** $white */
  white: '#ffffff',
  /** $demure */
  demure: '#dcddd7',
  /** Chart axis / tick labels */
  axis: 'rgba(12,12,12,0.28)',
  grid: 'rgba(12,12,12,0.07)',
} as const

/** $radius-sm */
export const chartRadius = {
  sm: 8,
  indicator: 3,
} as const

export const chartType = {
  /** $text-small */
  small: rem(0.8),
  /** $text-large */
  large: rem(1.75),
} as const

export const chartWeight = {
  /** $weight-medium */
  medium: 500,
  /** $weight-semibold */
  semibold: 600,
  /** $weight-bold (SemiBold face) */
  bold: 700,
  /** $weight-extrabold (Bold face) */
  extrabold: 800,
} as const

export const chartLetterSpacing = {
  /** $letter-spacing-tight */
  tight: '-0.025rem',
} as const

/** $text-small · $weight-medium · $letter-spacing-tight · $muted */
export const chartTextCaption = {
  fontSize: chartType.small,
  fontWeight: chartWeight.medium,
  letterSpacing: chartLetterSpacing.tight,
  fill: chartColor.muted,
  fontFamily: 'inherit',
} as const

/** $text-large · $weight-medium · $letter-spacing-tight · $ink-dark */
export const chartTextValue = {
  fontSize: chartType.large,
  fontWeight: chartWeight.medium,
  letterSpacing: chartLetterSpacing.tight,
  fill: chartColor.ink,
  fontFamily: 'inherit',
} as const
