'use client'

import type { CSSProperties, ReactNode } from 'react'
import { defaultStyles } from '@visx/tooltip'
import {
  chartColor,
  chartLetterSpacing,
  chartRadius,
  chartType,
  chartWeight,
} from '../../styles/chartTokens'

/** Light tooltip shell — $white surface, $demure border, $radius-sm */
export const chartTooltipStyles: CSSProperties = {
  ...defaultStyles,
  background: chartColor.white,
  color: chartColor.ink,
  padding: '12px 14px',
  borderRadius: chartRadius.sm,
  border: `1px solid ${chartColor.demure}`,
  fontSize: chartType.small,
  fontFamily: 'inherit',
  boxShadow: '0 4px 12px rgba(12, 12, 12, 0.08)',
  lineHeight: 1.4,
  width: 'max-content',
  maxWidth: 280,
}

const headerStyle: CSSProperties = {
  fontSize: chartType.small,
  fontWeight: chartWeight.medium,
  color: chartColor.ink,
  letterSpacing: chartLetterSpacing.tight,
  marginBottom: 2,
}

const bodyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}

const indicatorStyle: CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: chartRadius.indicator,
  flexShrink: 0,
  paddingBottom: 1,
  marginTop: -1,
}

const labelStyle: CSSProperties = {
  fontSize: chartType.small,
  fontWeight: chartWeight.medium,
  color: chartColor.muted,
  flex: 1,
}

const valueStyle: CSSProperties = {
  fontSize: chartType.small,
  fontWeight: chartWeight.medium,
  color: chartColor.ink,
  fontVariantNumeric: 'tabular-nums',
}

const detailStyle: CSSProperties = {
  fontSize: chartType.small,
  fontWeight: chartWeight.medium,
  color: chartColor.muted,
  letterSpacing: chartLetterSpacing.tight,
}

export function ChartTooltipHeader({ children }: { children: ReactNode }) {
  return <div style={headerStyle}>{children}</div>
}

export function ChartTooltipBody({ children }: { children: ReactNode }) {
  return <div style={bodyStyle}>{children}</div>
}

export function ChartTooltipRow({
  color,
  label,
  value,
}: {
  color: string
  label?: ReactNode
  value: ReactNode
}) {
  const hasLabel = label != null && label !== ''

  return (
    <div style={rowStyle}>
      <span style={{ ...indicatorStyle, background: color }} />
      {hasLabel && <span style={labelStyle}>{label}</span>}
      <span style={hasLabel ? { ...valueStyle, marginLeft: 'auto' } : valueStyle}>
        {value}
      </span>
    </div>
  )
}

export function ChartTooltipDetail({ children }: { children: ReactNode }) {
  return <div style={detailStyle}>{children}</div>
}
