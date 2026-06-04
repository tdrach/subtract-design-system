'use client'

import { useMemo, useCallback } from 'react'
import { scaleLinear } from '@visx/scale'
import { useTooltip, useTooltipInPortal } from '@visx/tooltip'
import { localPoint } from '@visx/event'
import {
  chartTooltipStyles,
  ChartTooltipDetail,
  ChartTooltipHeader,
} from '../ChartTooltip'
import { chartTextCaption } from '../../styles/chartTokens'

// ─── DS token constants ───────────────────────────────────────────────────────

const GRID    = 'rgba(12,12,12,0.07)'
const DEFAULT_COLOR = '#11A0FF'

// ─── Layout constants ─────────────────────────────────────────────────────────

const LABEL_W_DEFAULT = 120   // px for row labels
const ROW_H_DEFAULT   = 40    // height per row
const BAR_H           = 20    // height of each bar rect
const BAR_RADIUS      = 4     // border radius on bars
const AXIS_H          = 28    // x-axis height
const TICK_COUNT      = 5     // default x-axis tick count
const TICK_DASH       = 4     // px for sparkline edge ticks

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GanttTask {
  id: string
  /** Row label shown on the left. */
  label: string
  /** Start value on the x-axis (numeric; use Date.getTime() for real dates). */
  start: number
  /** End value on the x-axis. */
  end: number
  /** Bar fill color. Defaults to primary blue. */
  color?: string
}

export interface GanttChartProps {
  tasks: GanttTask[]
  /** Total SVG width in px. Defaults to 560. */
  width?: number
  /** Height per task row in px. Defaults to 40. */
  rowHeight?: number
  /** Width reserved for row labels. Defaults to 120. Set to 0 for sparkline. */
  labelWidth?: number
  /** Explicit x-axis domain. Auto-computed from task extents if omitted. */
  domain?: [number, number]
  /** Number of x-axis tick marks. Defaults to 5. */
  tickCount?: number
  /**
   * Format x-axis tick labels and tooltip start/end values.
   * Defaults to toLocaleString.
   */
  valueFormat?: (v: number) => string
  /**
   * Override the total SVG height. Defaults to tasks.length × rowHeight + axisHeight.
   * In sparkline mode the axis is removed so this controls the chart area height.
   */
  height?: number
  /**
   * Sparkline mode: hides labels, axis, and grid. Shows only bars with
   * subtle vertical tick marks at column positions.
   */
  sparkline?: boolean
  /** Unique suffix for SVG IDs. */
  uid?: string
}

// ─── Component ───────────────────────────────────────────────────────────────

export function GanttChart({
  tasks,
  width = 560,
  rowHeight = ROW_H_DEFAULT,
  labelWidth = LABEL_W_DEFAULT,
  domain,
  tickCount = TICK_COUNT,
  valueFormat,
  height: heightProp,
  sparkline = false,
  uid = 'a',
}: GanttChartProps) {
  const formatVal = valueFormat ?? ((v: number) => v.toLocaleString())

  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop, tooltipOpen } =
    useTooltip<GanttTask>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({ detectBounds: true, scroll: true })

  const computed = useMemo(() => {
    if (!tasks.length) return null

    const effLabelW = sparkline ? 0 : labelWidth
    const domainMin = domain?.[0] ?? Math.min(...tasks.map(t => t.start))
    const domainMax = domain?.[1] ?? Math.max(...tasks.map(t => t.end))
    const chartW    = width - effLabelW
    const chartH    = tasks.length * rowHeight

    const xScale = scaleLinear({
      domain: [domainMin, domainMax],
      range:  [effLabelW, width],
    })

    // Nice round ticks across the domain
    const step = (domainMax - domainMin) / (tickCount - 1)
    const ticks = Array.from({ length: tickCount }, (_, i) =>
      domainMin + Math.round(i * step)
    )

    return { effLabelW, chartW, chartH, xScale, ticks }
  }, [tasks, width, rowHeight, labelWidth, domain, tickCount, sparkline])

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGRectElement>, task: GanttTask) => {
    const point = localPoint(e.currentTarget.ownerSVGElement!, e)
    showTooltip({ tooltipData: task, tooltipLeft: point?.x, tooltipTop: point?.y })
  }, [showTooltip])

  if (!computed) return null
  const { effLabelW, chartH, xScale, ticks } = computed
  const totalH = heightProp ?? chartH + (sparkline ? 0 : AXIS_H)
  // In sparkline mode with an explicit height, scale row heights to fit
  const effRowH = heightProp && sparkline ? heightProp / tasks.length : rowHeight

  return (
    <div ref={containerRef} style={{ position: 'relative', width, display: 'inline-block' }}>
      <svg
        width={width}
        height={totalH}
        style={{ display: 'block', overflow: 'visible' }}
        aria-hidden="true"
      >
        {/* ── Vertical grid lines ────────────────────────────────────────── */}
        {!sparkline && ticks.map(v => (
          <line
            key={v}
            x1={xScale(v)} y1={0}
            x2={xScale(v)} y2={chartH}
            stroke={GRID} strokeWidth={1}
          />
        ))}

        {/* ── Task rows ─────────────────────────────────────────────────── */}
        {tasks.map((task, i) => {
          const x1    = xScale(task.start)
          const x2    = xScale(task.end)
          const barW  = Math.max(x2 - x1, BAR_RADIUS * 2)
          const rh    = sparkline ? effRowH : rowHeight
          const bh    = sparkline ? Math.max(Math.min(rh - 8, BAR_H), 4) : BAR_H
          const barY  = i * rh + (rh - bh) / 2
          const color = task.color ?? DEFAULT_COLOR

          return (
            <g key={task.id}>
              {/* Row label */}
              {!sparkline && (
                <text
                  x={effLabelW - 10}
                  y={i * rowHeight + rowHeight / 2 + 4}
                  textAnchor="end"
                  {...chartTextCaption}
                >
                  {task.label}
                </text>
              )}
              {/* Bar */}
              <rect
                x={x1}
                y={barY}
                width={barW}
                height={bh}
                rx={BAR_RADIUS}
                fill={color}
                onMouseMove={e => handleMouseMove(e, task)}
                onMouseLeave={hideTooltip}
                style={{ cursor: 'default' }}
              />
            </g>
          )
        })}

        {/* ── X-axis ────────────────────────────────────────────────────── */}
        {!sparkline && (
          <>
            <line
              x1={effLabelW} y1={chartH}
              x2={width}     y2={chartH}
              stroke={GRID} strokeWidth={1}
            />
            {ticks.map(v => (
              <text
                key={v}
                x={xScale(v)}
                y={chartH + AXIS_H - 6}
                textAnchor="middle"
                {...chartTextCaption}
              >
                {formatVal(v)}
              </text>
            ))}
          </>
        )}

        {/* ── Sparkline vertical edge ticks ──────────────────────────────── */}
        {sparkline && ticks.map(v => {
          const x = xScale(v)
          return (
            <g key={v}>
              <line x1={x} y1={0}              x2={x} y2={TICK_DASH}         stroke={GRID} strokeWidth={1} />
              <line x1={x} y1={totalH - TICK_DASH} x2={x} y2={totalH}       stroke={GRID} strokeWidth={1} />
            </g>
          )
        })}
      </svg>

      {/* ── Tooltip ──────────────────────────────────────────────────────── */}
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          left={tooltipLeft}
          top={tooltipTop}
          style={chartTooltipStyles}
        >
          <ChartTooltipHeader>{tooltipData.label}</ChartTooltipHeader>
          <ChartTooltipDetail>
            {formatVal(tooltipData.start)} → {formatVal(tooltipData.end)}
          </ChartTooltipDetail>
          <ChartTooltipDetail>
            Duration: {formatVal(tooltipData.end - tooltipData.start)}
          </ChartTooltipDetail>
        </TooltipInPortal>
      )}
    </div>
  )
}
