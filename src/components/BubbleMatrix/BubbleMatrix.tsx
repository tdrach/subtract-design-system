'use client'

import { useMemo, useCallback } from 'react'
import { scaleLinear } from '@visx/scale'
import { useTooltip, useTooltipInPortal } from '@visx/tooltip'
import {
  chartTooltipStyles,
  ChartTooltipHeader,
  ChartTooltipRow,
} from '../ChartTooltip'
import { localPoint } from '@visx/event'

// ─── DS token constants ───────────────────────────────────────────────────────

const MUTED       = 'rgba(12,12,12,0.28)'
const GRID        = 'rgba(12,12,12,0.07)'
const CONNECTOR   = 'rgba(12,12,12,0.10)'
const DEFAULT_COLOR = '#11A0FF'

// ─── Layout constants ─────────────────────────────────────────────────────────

const LABEL_W_DEFAULT = 100   // px for row labels on the left
const COL_H_DEFAULT   = 40    // height of each row
const HEADER_H        = 28    // height of column header row
const MAX_R           = 14    // max bubble radius
const MIN_R           = 2     // min bubble radius (non-zero values)
const GLOW_THRESHOLD  = 0.5   // show glow when bubble is ≥ 50% of max


// ─── Types ────────────────────────────────────────────────────────────────────

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
  rows: BubbleMatrixRow[]
  cols: BubbleMatrixCol[]
  data: BubbleMatrixCell[]
  /** Bubble fill color. Defaults to blue. */
  color?: string
  /** Total SVG width in px. Defaults to 560. */
  width?: number
  /** Height per row in px. Defaults to 40. */
  rowHeight?: number
  /** Width reserved for row labels. Defaults to 100. */
  labelWidth?: number
  /** Show column header labels. Defaults to true. */
  showHeaders?: boolean
  /** Show row labels. Defaults to true. */
  showLabels?: boolean
  /** Format the value shown in the tooltip. Defaults to toLocaleString. */
  valueFormat?: (v: number) => string
  /** Unique suffix for SVG IDs. */
  uid?: string
}

type TooltipData = {
  row: BubbleMatrixRow
  col: BubbleMatrixCol
  value: number
}

// ─── Component ───────────────────────────────────────────────────────────────

export function BubbleMatrix({
  rows,
  cols,
  data,
  color = DEFAULT_COLOR,
  width = 560,
  rowHeight = COL_H_DEFAULT,
  labelWidth = LABEL_W_DEFAULT,
  showHeaders = true,
  showLabels = true,
  valueFormat,
  uid = 'a',
}: BubbleMatrixProps) {
  const formatVal = valueFormat ?? ((v: number) => v.toLocaleString())

  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop, tooltipOpen } =
    useTooltip<TooltipData>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({ detectBounds: true, scroll: true })

  const computed = useMemo(() => {
    if (!rows.length || !cols.length) return null

    // Build lookup for quick access: 'rowId:colId' → value
    const lookup = new Map(data.map(d => [`${d.rowId}:${d.colId}`, d.value]))

    const allVals = data.map(d => d.value).filter(v => v > 0)
    const maxVal  = Math.max(...allVals, 1)

    const effLabelW = showLabels ? labelWidth : 0
    const headerH   = showHeaders ? HEADER_H : 0
    const gridW     = width - effLabelW
    const colW      = gridW / cols.length
    const svgH      = headerH + rows.length * rowHeight

    // Radius scale: 0 → 0, (0,1] → [MIN_R, MAX_R]
    function getRadius(value: number): number {
      if (value <= 0) return 0
      const t = value / maxVal
      return MIN_R + t * (MAX_R - MIN_R)
    }

    // Build cell geometry
    type CellGeo = {
      cx: number; cy: number; r: number
      row: BubbleMatrixRow; col: BubbleMatrixCol; value: number
      colIdx: number
    }
    const cells: CellGeo[] = []
    rows.forEach((row, ri) => {
      cols.forEach((col, ci) => {
        const value = lookup.get(`${row.id}:${col.id}`) ?? 0
        const cx    = effLabelW + ci * colW + colW / 2
        const cy    = headerH + ri * rowHeight + rowHeight / 2
        cells.push({ cx, cy, r: getRadius(value), row, col, value, colIdx: ci })
      })
    })

    // Column x-center positions (for vertical connector lines)
    const colCenters = cols.map((_, ci) => effLabelW + ci * colW + colW / 2)

    return { effLabelW, headerH, gridW, colW, svgH, cells, colCenters, maxVal }
  }, [rows, cols, data, width, rowHeight, labelWidth, showLabels, showHeaders])

  const handleCellMouse = useCallback((
    e: React.MouseEvent<SVGCircleElement>,
    cell: { row: BubbleMatrixRow; col: BubbleMatrixCol; value: number }
  ) => {
    if (cell.value === 0) return
    const point = localPoint(e.currentTarget.ownerSVGElement!, e)
    if (!point) return
    showTooltip({
      tooltipData: { row: cell.row, col: cell.col, value: cell.value },
      tooltipLeft: point.x,
      tooltipTop:  point.y,
    })
  }, [showTooltip])

  if (!computed) return null
  const { effLabelW, headerH, svgH, cells, colCenters } = computed

  return (
    <div ref={containerRef} style={{ position: 'relative', width, display: 'inline-block' }}>
      <svg
        width={width}
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
            x2={width}     y2={headerH + ri * (svgH - headerH) / rows.length}
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
            fontSize={10}
            fontWeight={600}
            letterSpacing="0.05em"
            fill={MUTED}
            fontFamily="inherit"
          >
            {col.label.toUpperCase()}
          </text>
        ))}

        {/* ── Row labels ───────────────────────────────────────────────────── */}
        {showLabels && rows.map((row, ri) => (
          <text
            key={`label-${row.id}`}
            x={effLabelW - 10}
            y={headerH + ri * (svgH - headerH) / rows.length + (svgH - headerH) / rows.length / 2 + 4}
            textAnchor="end"
            fontSize={12}
            fill={MUTED}
            fontFamily="inherit"
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
              onMouseMove={e => handleCellMouse(e, cell)}
              onMouseLeave={hideTooltip}
              style={{ cursor: 'default' }}
            />
          )
        })}
      </svg>

      {/* ── Tooltip ──────────────────────────────────────────────────────────── */}
      {tooltipOpen && tooltipData && (
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
