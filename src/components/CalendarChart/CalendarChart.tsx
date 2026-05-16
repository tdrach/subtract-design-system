'use client'

import { useMemo, useCallback } from 'react'
import { useTooltip, useTooltipInPortal } from '@visx/tooltip'
import { localPoint } from '@visx/event'
import { chartTextCaption } from '../../styles/chartTokens'
import {
  chartTooltipStyles,
  ChartTooltipHeader,
  ChartTooltipRow,
} from '../ChartTooltip'

// ─── DS token constants ───────────────────────────────────────────────────────

const ORANGE = '#FF6200' // default bubble color

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

// Four discrete radii — full and compact variants
const RADII         = [5, 9, 15, 24] as const
const RADII_COMPACT = [3, 6, 10, 16] as const

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CalendarDataPoint {
  date: string   // 'YYYY-MM-DD'
  value: number  // raw value ≥ 0; normalised internally to the month's max
}

export interface CalendarChartProps {
  data: CalendarDataPoint[]
  /** Month to render. Defaults to the current month. */
  month?: Date
  /** Bubble fill color. Defaults to orange (#FF6200). */
  color?: string
  /** Total SVG width in px. Defaults to 360. */
  width?: number
  /**
   * Compact / sparkline mode: hides day-of-week headers, tighter cell
   * height, and smaller bubble radii. Use for card previews.
   */
  compact?: boolean
  /**
   * Format the tooltip value. Defaults to `v.toLocaleString()`.
   */
  valueFormat?: (v: number) => string
  /**
   * Unique suffix appended to SVG filter IDs.
   * Required when rendering more than one CalendarChart on the same page.
   */
  uid?: string
  /**
   * Called when an in-month day cell is clicked. Receives 'YYYY-MM-DD'.
   * When provided, cells show a pointer cursor.
   */
  onDayClick?: (date: string) => void
}

type TooltipData = {
  date: string
  value: number
  cx: number
  cy: number
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CalendarChart({
  data,
  month,
  color = ORANGE,
  width = 360,
  compact = false,
  valueFormat,
  uid = 'a',
  onDayClick,
}: CalendarChartProps) {
  const formatVal = valueFormat ?? ((v: number) => v.toLocaleString())
  const ref  = month ?? new Date()
  const year = ref.getFullYear()
  const mon  = ref.getMonth()

  // ── Tooltip ────────────────────────────────────────────────────────────────

  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop, tooltipOpen } =
    useTooltip<TooltipData>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({ detectBounds: true, scroll: true })

  // ── Computed layout ────────────────────────────────────────────────────────

  const computed = useMemo(() => {
    const lookup = new Map(data.map(d => [d.date, d.value]))

    const firstDow      = new Date(year, mon, 1).getDay()
    const daysInMonth   = new Date(year, mon + 1, 0).getDate()
    const daysInPrevMon = new Date(year, mon, 0).getDate()

    // Normalise against the displayed month only
    const monthVals: number[] = []
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(mon + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const v   = lookup.get(key) ?? 0
      if (v > 0) monthVals.push(v)
    }
    const maxVal = Math.max(...monthVals, 1)
    const radii  = compact ? RADII_COMPACT : RADII

    function getRadius(value: number): number {
      const n = value / maxVal
      if (n >= 0.75) return radii[3]
      if (n >= 0.50) return radii[2]
      if (n >= 0.25) return radii[1]
      if (n >  0)    return radii[0]
      return 0
    }

    const totalSlots = firstDow + daysInMonth
    const rows       = Math.ceil(totalSlots / 7)
    const CELL_W     = width / 7
    const CELL_H     = compact ? Math.max(CELL_W, 28) : Math.max(CELL_W, 48)
    const HDR_H      = compact ? 0 : 28

    type Cell = {
      cx: number; cy: number; day: number; inMonth: boolean; value: number
      dateStr: string | null
    }

    const cells: Cell[] = []
    for (let slot = 0; slot < rows * 7; slot++) {
      const col = slot % 7
      const row = Math.floor(slot / 7)
      const cx  = col * CELL_W + CELL_W / 2
      const cy  = HDR_H + row * CELL_H + CELL_H / 2

      if (slot < firstDow) {
        const day = daysInPrevMon - firstDow + slot + 1
        cells.push({ cx, cy, day, inMonth: false, value: 0, dateStr: null })
      } else if (slot < firstDow + daysInMonth) {
        const day     = slot - firstDow + 1
        const dateStr = `${year}-${String(mon + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const value   = lookup.get(dateStr) ?? 0
        cells.push({ cx, cy, day, inMonth: true, value, dateStr })
      } else {
        const day = slot - firstDow - daysInMonth + 1
        cells.push({ cx, cy, day, inMonth: false, value: 0, dateStr: null })
      }
    }

    const svgH   = HDR_H + rows * CELL_H
    const CELL_W_out = CELL_W
    const CELL_H_out = CELL_H
    return { cells, getRadius, svgH, CELL_W: CELL_W_out, CELL_H: CELL_H_out }
  }, [data, year, mon, width, compact])

  const { cells, getRadius, svgH, CELL_W, CELL_H } = computed
  const glowId = `cc-glow-${uid}`

  // ── Mouse interaction ─────────────────────────────────────────────────────

  const handleCellEnter = useCallback((
    e: React.MouseEvent<SVGRectElement>,
    cell: { dateStr: string | null; value: number; cx: number; cy: number }
  ) => {
    if (!cell.dateStr || cell.value === 0) return
    const point = localPoint(e.currentTarget.ownerSVGElement!, e)
    if (!point) return
    showTooltip({
      tooltipData: { date: cell.dateStr, value: cell.value, cx: cell.cx, cy: cell.cy },
      tooltipLeft: point.x,
      tooltipTop:  point.y,
    })
  }, [showTooltip])

  // ── Tooltip date label ────────────────────────────────────────────────────

  function tooltipDateLabel(dateStr: string) {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en', {
      weekday: 'short', month: 'short', day: 'numeric',
    })
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width, display: 'inline-block' }}>
      <svg
        width={width}
        height={svgH}
        viewBox={`0 0 ${width} ${svgH}`}
        style={{ display: 'block', overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          <filter id={glowId} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" result="blur" />
          </filter>
        </defs>

        {/* ── Day-of-week column headers (hidden in compact mode) ─────────── */}
        {!compact && DAYS.map((d, i) => (
          <text
            key={d}
            x={i * (width / 7) + (width / 7) / 2}
            y={18}
            textAnchor="middle"
            {...chartTextCaption}
          >
            {d}
          </text>
        ))}

        {/* ── Glows — blurred ellipses rendered behind bubbles ────────────── */}
        {cells.map((c, i) => {
          if (!c.inMonth) return null
          const r = getRadius(c.value)
          if (r < 9) return null
          return (
            <ellipse
              key={`glow-${i}`}
              cx={c.cx}
              cy={c.cy + r * 0.5}
              rx={r * 2.0}
              ry={r * 1.6}
              fill={color}
              opacity={0.28}
              filter={`url(#${glowId})`}
            />
          )
        })}

        {/* ── Bubbles and out-of-month date numbers ───────────────────────── */}
        {cells.map((c, i) => {
          if (!c.inMonth) {
            if (compact) return null
            return (
              <text
                key={`oom-${i}`}
                x={c.cx}
                y={c.cy + 5}
                textAnchor="middle"
                {...chartTextCaption}
              >
                {c.day}
              </text>
            )
          }

          const r = getRadius(c.value)
          return (
            <g key={`cell-${i}`}>
              {r > 0 && (
                <circle
                  cx={c.cx}
                  cy={c.cy}
                  r={r}
                  fill={color}
                  style={tooltipOpen && tooltipData?.date === c.dateStr
                    ? { opacity: 0.7 }
                    : undefined
                  }
                />
              )}
              {/* Hit area — full cell, captures hover + click */}
              <rect
                x={c.cx - CELL_W / 2}
                y={c.cy - CELL_H / 2}
                width={CELL_W}
                height={CELL_H}
                fill="transparent"
                style={{ cursor: onDayClick ? 'pointer' : 'default' }}
                onMouseMove={(e) => handleCellEnter(e, c)}
                onMouseLeave={hideTooltip}
                onClick={() => c.dateStr && onDayClick?.(c.dateStr)}
              />
            </g>
          )
        })}
      </svg>

      {/* ── Tooltip ────────────────────────────────────────────────────────── */}
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          left={tooltipLeft}
          top={tooltipTop}
          style={chartTooltipStyles}
        >
          <ChartTooltipHeader>{tooltipDateLabel(tooltipData.date)}</ChartTooltipHeader>
          <ChartTooltipRow color={color} value={formatVal(tooltipData.value)} />
        </TooltipInPortal>
      )}
    </div>
  )
}
