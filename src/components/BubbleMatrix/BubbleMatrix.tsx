'use client'

import { useMemo, useCallback } from 'react'
import { useTooltip, useTooltipInPortal } from '@visx/tooltip'
import {
  chartTooltipStyles,
  ChartTooltipHeader,
  ChartTooltipRow,
} from '../ChartTooltip'
import { localPoint } from '@visx/event'
import { chartTextCaption } from '../../styles/chartTokens'

// ─── DS token constants ───────────────────────────────────────────────────────

const GRID        = 'rgba(12,12,12,0.07)'
const CONNECTOR   = 'rgba(12,12,12,0.10)'
const DEFAULT_COLOR = '#11A0FF'

// ─── Generic matrix layout constants ─────────────────────────────────────────

const LABEL_W_DEFAULT = 100   // px for row labels on the left
const COL_H_DEFAULT   = 40    // height of each row
const HEADER_H        = 28    // height of column header row
const MAX_R           = 14    // max bubble radius
const MIN_R           = 2     // min bubble radius (non-zero values)
const GLOW_THRESHOLD  = 0.5   // show glow when bubble is ≥ 50% of max

// ─── Calendar mode constants ──────────────────────────────────────────────────

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

// Four discrete radii — full and compact variants
const RADII         = [5, 9, 15, 24] as const
const RADII_COMPACT = [3, 6, 10, 16] as const
const CAL_GLOW_R    = 9   // minimum radius to show calendar glow


// ─── Types ────────────────────────────────────────────────────────────────────

/** Data point for calendar mode. */
export interface CalendarDataPoint {
  /** Date string in 'YYYY-MM-DD' format. */
  date: string
  /** Raw value ≥ 0; normalised internally to the month's max. */
  value: number
}

export interface BubbleMatrixCell {
  /** Row id matching a row in `rows`. */
  rowId: string
  /** Column id matching a col in `cols`. */
  colId: string
  /** Numeric value controlling bubble size. */
  value: number
}

export interface BubbleMatrixRow {
  id: string
  label: string
}

export interface BubbleMatrixCol {
  id: string
  label: string
}

export interface BubbleMatrixProps {
  // ── Generic matrix mode ───────────────────────────────────────────────────
  rows?: BubbleMatrixRow[]
  cols?: BubbleMatrixCol[]
  data?: BubbleMatrixCell[]

  // ── Calendar mode ─────────────────────────────────────────────────────────
  /**
   * When provided, the component renders as a calendar bubble chart.
   * Each day in the supplied month is mapped to one of four discrete
   * bubble sizes (r5 / r9 / r15 / r24) scaled to the month's peak value.
   */
  calendarData?: CalendarDataPoint[]
  /**
   * Month to render in calendar mode. Defaults to the current month.
   */
  month?: Date
  /**
   * Compact / sparkline mode: hides day-of-week headers, tighter cell
   * height, and smaller bubble radii. Calendar mode only.
   */
  compact?: boolean
  /**
   * Called when an in-month day cell is clicked. Receives 'YYYY-MM-DD'.
   * Calendar mode only.
   */
  onCellClick?: (date: string) => void

  // ── Shared props ──────────────────────────────────────────────────────────
  /** Bubble fill color. Defaults to blue. */
  color?: string
  /** Total SVG width in px. Defaults to 560 (matrix) or 360 (calendar). */
  width?: number
  /** Height per row in px. Defaults to 40. Matrix mode only. */
  rowHeight?: number
  /** Width reserved for row labels. Defaults to 100. Matrix mode only. */
  labelWidth?: number
  /** Show column header labels. Defaults to true. Matrix mode only. */
  showHeaders?: boolean
  /** Show row labels. Defaults to true. Matrix mode only. */
  showLabels?: boolean
  /** Format the value shown in the tooltip. Defaults to toLocaleString. */
  valueFormat?: (v: number) => string
  /** Unique suffix for SVG IDs. */
  uid?: string
}

type TooltipData =
  | { mode: 'calendar'; date: string; value: number }
  | { mode: 'matrix';   row: BubbleMatrixRow; col: BubbleMatrixCol; value: number }

// ─── Component ───────────────────────────────────────────────────────────────

export function BubbleMatrix({
  rows = [],
  cols = [],
  data = [],
  calendarData,
  month,
  compact = false,
  onCellClick,
  color = DEFAULT_COLOR,
  width,
  rowHeight = COL_H_DEFAULT,
  labelWidth = LABEL_W_DEFAULT,
  showHeaders = true,
  showLabels = true,
  valueFormat,
  uid = 'a',
}: BubbleMatrixProps) {
  const isCalendar = Boolean(calendarData)
  const resolvedWidth = width ?? (isCalendar ? 360 : 560)

  const formatVal = valueFormat ?? ((v: number) => v.toLocaleString())

  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop, tooltipOpen } =
    useTooltip<TooltipData>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({ detectBounds: true, scroll: true })

  // ── Calendar computed ─────────────────────────────────────────────────────

  const calendarComputed = useMemo(() => {
    if (!calendarData) return null

    const ref  = month ?? new Date()
    const year = ref.getFullYear()
    const mon  = ref.getMonth()

    const lookup = new Map(calendarData.map(d => [d.date, d.value]))

    const firstDow      = new Date(year, mon, 1).getDay()
    const daysInMonth   = new Date(year, mon + 1, 0).getDate()
    const daysInPrevMon = new Date(year, mon, 0).getDate()

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
    const numWeeks   = Math.ceil(totalSlots / 7)
    const CELL_W     = resolvedWidth / 7
    const CELL_H     = compact ? Math.max(CELL_W, 28) : Math.max(CELL_W, 48)
    const HDR_H      = compact ? 0 : 28

    type CalCell = {
      cx: number; cy: number; day: number; inMonth: boolean; value: number
      dateStr: string | null
    }

    const cells: CalCell[] = []
    for (let slot = 0; slot < numWeeks * 7; slot++) {
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

    const svgH = HDR_H + numWeeks * CELL_H
    return { cells, getRadius, svgH, CELL_W, CELL_H, HDR_H }
  }, [calendarData, month, resolvedWidth, compact])

  // ── Matrix computed ───────────────────────────────────────────────────────

  const matrixComputed = useMemo(() => {
    if (isCalendar) return null
    if (!rows.length || !cols.length) return null

    const lookup = new Map(data.map(d => [`${d.rowId}:${d.colId}`, d.value]))

    const allVals = data.map(d => d.value).filter(v => v > 0)
    const maxVal  = Math.max(...allVals, 1)

    const effLabelW = showLabels ? labelWidth : 0
    const headerH   = showHeaders ? HEADER_H : 0
    const gridW     = resolvedWidth - effLabelW
    const colW      = gridW / cols.length
    const svgH      = headerH + rows.length * rowHeight

    function getRadius(value: number): number {
      if (value <= 0) return 0
      const t = value / maxVal
      return MIN_R + t * (MAX_R - MIN_R)
    }

    type CellGeo = {
      cx: number; cy: number; r: number
      row: BubbleMatrixRow; col: BubbleMatrixCol; value: number
    }
    const cells: CellGeo[] = []
    rows.forEach((row, ri) => {
      cols.forEach((col, ci) => {
        const value = lookup.get(`${row.id}:${col.id}`) ?? 0
        const cx    = effLabelW + ci * colW + colW / 2
        const cy    = headerH + ri * rowHeight + rowHeight / 2
        cells.push({ cx, cy, r: getRadius(value), row, col, value })
      })
    })

    const colCenters = cols.map((_, ci) => effLabelW + ci * colW + colW / 2)

    return { effLabelW, headerH, gridW, colW, svgH, cells, colCenters, maxVal }
  }, [isCalendar, rows, cols, data, resolvedWidth, rowHeight, labelWidth, showLabels, showHeaders])

  // ── Tooltip helpers ───────────────────────────────────────────────────────

  const handleCalendarCellEnter = useCallback((
    e: React.MouseEvent<SVGRectElement>,
    dateStr: string | null, value: number
  ) => {
    if (!dateStr || value === 0) return
    const point = localPoint(e.currentTarget.ownerSVGElement!, e)
    if (!point) return
    showTooltip({
      tooltipData: { mode: 'calendar', date: dateStr, value },
      tooltipLeft: point.x,
      tooltipTop:  point.y,
    })
  }, [showTooltip])

  const handleMatrixCellMouse = useCallback((
    e: React.MouseEvent<SVGCircleElement>,
    cell: { row: BubbleMatrixRow; col: BubbleMatrixCol; value: number }
  ) => {
    if (cell.value === 0) return
    const point = localPoint(e.currentTarget.ownerSVGElement!, e)
    if (!point) return
    showTooltip({
      tooltipData: { mode: 'matrix', row: cell.row, col: cell.col, value: cell.value },
      tooltipLeft: point.x,
      tooltipTop:  point.y,
    })
  }, [showTooltip])

  function tooltipDateLabel(dateStr: string) {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en', {
      weekday: 'short', month: 'short', day: 'numeric',
    })
  }

  // ─── Calendar render ──────────────────────────────────────────────────────

  if (isCalendar && calendarComputed) {
    const { cells, getRadius, svgH, CELL_W, CELL_H } = calendarComputed

    return (
      <div ref={containerRef} style={{ position: 'relative', width: resolvedWidth, display: 'inline-block' }}>
        <svg
          width={resolvedWidth}
          height={svgH}
          viewBox={`0 0 ${resolvedWidth} ${svgH}`}
          style={{ display: 'block', overflow: 'visible' }}
          aria-hidden="true"
        >
            {/* ── Day-of-week column headers (hidden in compact mode) ───────── */}
          {!compact && DAYS.map((d, i) => (
            <text
              key={d}
              x={i * (resolvedWidth / 7) + (resolvedWidth / 7) / 2}
              y={18}
              textAnchor="middle"
              {...chartTextCaption}
            >
              {d}
            </text>
          ))}

          {/* ── Glows — blurred ellipses rendered behind bubbles ─────────── */}
          {cells.map((c, i) => {
            if (!c.inMonth) return null
            const r = getRadius(c.value)
            if (r < CAL_GLOW_R) return null
            return (
              <ellipse
                key={`cal-glow-${i}`}
                cx={c.cx}
                cy={c.cy}
                rx={r * 2.2}
                ry={r * 1.8}
                fill={color}
                opacity={0.15}
                style={{ filter: 'blur(8px)' }}
                pointerEvents="none"
              />
            )
          })}

          {/* ── Bubbles and out-of-month date numbers ─────────────────────── */}
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
              <g key={`cal-cell-${i}`}>
                {r > 0 && (
                  <circle
                    cx={c.cx}
                    cy={c.cy}
                    r={r}
                    fill={color}
                    style={tooltipOpen && tooltipData?.mode === 'calendar' && tooltipData.date === c.dateStr
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
                  style={{ cursor: onCellClick ? 'pointer' : 'default' }}
                  onMouseMove={(e) => handleCalendarCellEnter(e, c.dateStr, c.value)}
                  onMouseLeave={hideTooltip}
                  onClick={() => c.dateStr && onCellClick?.(c.dateStr)}
                />
              </g>
            )
          })}
        </svg>

        {/* ── Tooltip ──────────────────────────────────────────────────────── */}
        {tooltipOpen && tooltipData?.mode === 'calendar' && (
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

  // ─── Generic matrix render ────────────────────────────────────────────────

  if (!matrixComputed) return null
  const { effLabelW, headerH, svgH, cells, colCenters } = matrixComputed

  return (
    <div ref={containerRef} style={{ position: 'relative', width: resolvedWidth, display: 'inline-block' }}>
      <svg
        width={resolvedWidth}
        height={svgH}
        style={{ display: 'block', overflow: 'visible' }}
        aria-hidden="true"
      >
        {/* ── Vertical connector lines per column ─────────────────────────── */}
        {colCenters.map((cx, ci) => (
          <line
            key={`connector-${ci}`}
            x1={cx} y1={headerH}
            x2={cx} y2={svgH}
            stroke={CONNECTOR}
            strokeWidth={1}
          />
        ))}

        {/* ── Horizontal row dividers ──────────────────────────────────────── */}
        {rows.map((_, ri) => (
          <line
            key={`row-${ri}`}
            x1={effLabelW} y1={headerH + ri * (svgH - headerH) / rows.length}
            x2={resolvedWidth} y2={headerH + ri * (svgH - headerH) / rows.length}
            stroke={GRID}
            strokeWidth={1}
          />
        ))}

        {/* ── Column headers ───────────────────────────────────────────────── */}
        {showHeaders && cols.map((col, ci) => (
          <text
            key={`header-${col.id}`}
            x={colCenters[ci]}
            y={HEADER_H - 8}
            textAnchor="middle"
            {...chartTextCaption}
          >
            {col.label}
          </text>
        ))}

        {/* ── Row labels ───────────────────────────────────────────────────── */}
        {showLabels && rows.map((row, ri) => (
          <text
            key={`label-${row.id}`}
            x={effLabelW - 10}
            y={headerH + ri * (svgH - headerH) / rows.length + (svgH - headerH) / rows.length / 2 + 4}
            textAnchor="end"
            {...chartTextCaption}
          >
            {row.label}
          </text>
        ))}

        {/* ── Glows for large bubbles ──────────────────────────────────────── */}
        {cells.map((cell, i) => {
          if (cell.value <= 0 || cell.r < MAX_R * GLOW_THRESHOLD) return null
          return (
            <ellipse
              key={`glow-${i}`}
              cx={cell.cx}
              cy={cell.cy}
              rx={cell.r * 2.2}
              ry={cell.r * 1.8}
              fill={color}
              opacity={0.15}
              style={{ filter: 'blur(8px)' }}
              pointerEvents="none"
            />
          )
        })}

        {/* ── Bubbles ─────────────────────────────────────────────────────── */}
        {cells.map((cell, i) => {
          if (cell.r === 0) return null
          return (
            <circle
              key={`bubble-${i}`}
              cx={cell.cx}
              cy={cell.cy}
              r={cell.r}
              fill={color}
              opacity={0.85}
              onMouseMove={e => handleMatrixCellMouse(e, cell)}
              onMouseLeave={hideTooltip}
              style={{ cursor: 'default' }}
            />
          )
        })}
      </svg>

      {/* ── Tooltip ──────────────────────────────────────────────────────────── */}
      {tooltipOpen && tooltipData?.mode === 'matrix' && (
        <TooltipInPortal
          left={tooltipLeft}
          top={tooltipTop}
          style={chartTooltipStyles}
        >
          <ChartTooltipHeader>
            {tooltipData.col.label} · {tooltipData.row.label}
          </ChartTooltipHeader>
          <ChartTooltipRow color={color} value={formatVal(tooltipData.value)} />
        </TooltipInPortal>
      )}
    </div>
  )
}
