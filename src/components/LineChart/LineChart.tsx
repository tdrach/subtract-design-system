'use client'

import { useMemo, useCallback, useState, useRef, useLayoutEffect } from 'react'
import { scaleLinear } from '@visx/scale'
import { LinePath, AreaClosed } from '@visx/shape'
import { curveCatmullRom } from '@visx/curve'
import { GridRows } from '@visx/grid'
import { LinearGradient } from '@visx/gradient'
import { PatternCircles } from '@visx/pattern'
import { useTooltip, useTooltipInPortal } from '@visx/tooltip'
import {
  chartTooltipStyles,
  ChartTooltipBody,
  ChartTooltipHeader,
  ChartTooltipRow,
} from '../ChartTooltip'
import { localPoint } from '@visx/event'
import { chartColor, chartTextCaption, chartTextValue } from '../../styles/chartTokens'

// ─── DS token constants ───────────────────────────────────────────────────────

const AXIS_MUTED = chartColor.axis
const GRID       = chartColor.grid

// ─── Layout constants ─────────────────────────────────────────────────────────

const Y_LABEL_W         = 52    // px reserved for y-axis labels (0 when showYAxis=false)
const CALLOUT_MAX_W     = 88    // max width for callout label + value column
const CALLOUT_DOT_GAP   = 10    // space between end dot and callout column
const CALLOUT_RIGHT_PAD = 24    // $space-12 — inset from SVG edge so callout text doesn't clip
const CIRCLE_R    = 4     // end-of-line hollow circle radius (8×8 px)
const DOT_PITCH   = 7     // dot texture grid pitch (px)
const DOT_R       = 0.9   // dot texture circle radius
const X_AXIS_H        = 24    // px reserved for x-axis labels when present
const X_LABEL_EDGE    = 28    // px from plot edge — switch textAnchor so labels aren't clipped
const PADDING_TOP     = 10    // px headroom so the top tick label isn't clipped
const TICK_DASH   = 4     // px width of sparkline edge tick marks

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Parse #rrggbb → [r, g, b] */
function hexRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

/**
 * Builds a CSS `filter` string that replicates the 6-layer Figma drop-shadow.
 */
function lineGlow(color: string): string {
  const [r, g, b] = hexRgb(color)
  const c = (a: number) => `rgba(${r},${g},${b},${a.toFixed(2)})`
  return [
    `drop-shadow(0px 2.77px 2.21px ${c(0.14)})`,
    `drop-shadow(0px 6.65px 5.32px ${c(0.20)})`,
    `drop-shadow(0px 12.52px 10.02px ${c(0.25)})`,
    `drop-shadow(0px 22.34px 17.87px ${c(0.30)})`,
    `drop-shadow(0px 41.78px 33.42px ${c(0.36)})`,
    `drop-shadow(0px 100px 80px ${c(0.50)})`,
  ].join(' ')
}

/**
 * Compute y-axis tick values. Guarantees last tick ≥ dataMax.
 */
function niceYTicks(dataMin: number, dataMax: number, targetCount = 7): number[] {
  const range    = dataMax - dataMin || 1
  const rawStep  = range / (targetCount - 1)
  const exp      = Math.floor(Math.log10(rawStep))
  const mag      = Math.pow(10, exp)
  const norm     = rawStep / mag
  const niceStep = norm <= 1 ? mag : norm <= 2 ? 2 * mag : norm <= 5 ? 5 * mag : 10 * mag
  const lo       = Math.floor(dataMin / niceStep) * niceStep
  const ticks: number[] = []
  for (let v = lo; v < dataMax + niceStep; v += niceStep) {
    ticks.push(Math.round(v))
  }
  if (ticks[ticks.length - 1] < dataMax) ticks.push(Math.round(ticks[ticks.length - 1] + niceStep))
  return ticks
}

/**
 * Generate month boundary labels positioned at their actual date index.
 * Returns [{label, index}] — one entry per month change.
 */
function monthBoundaries(dates: string[]): { label: string; index: number }[] {
  const out: { label: string; index: number }[] = []
  let lastMonth = ''
  dates.forEach((d, i) => {
    const month = new Date(d + 'T12:00:00').toLocaleString('en', { month: 'short' })
    if (month !== lastMonth) { lastMonth = month; out.push({ label: month, index: i }) }
  })
  return out
}

/** Pick textAnchor so x-axis labels aren't clipped at the plot edges. */
function xLabelTextAnchor(
  x: number,
  plotLeft: number,
  plotRight: number,
): 'start' | 'middle' | 'end' {
  if (x - plotLeft < X_LABEL_EDGE) return 'start'
  if (plotRight - x < X_LABEL_EDGE) return 'end'
  return 'middle'
}

/** Format a date string for the tooltip */
function formatTooltipDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LineSeriesData {
  id: string
  /** Displayed in the right-side callout */
  label: string
  /** One value per x-axis tick. All series must have the same length. */
  values: number[]
  /** Hex color e.g. "#16a34a" — used for line, glow, fill, and dot texture */
  color: string
}

export interface LineChartProps {
  series: LineSeriesData[]
  /**
   * ISO date strings ('YYYY-MM-DD'), one per data point.
   * When provided, the x-axis shows month labels and the tooltip shows the date.
   */
  dates?: string[]
  /** Explicit x-axis tick labels (overridden by `dates` if both are set). */
  xLabels?: string[]
  /**
   * Optional max width in px. When omitted, the chart fills its container width.
   * Pass a number to cap width in compact layouts (cards, grids).
   */
  width?: number
  /** Chart area height in px (x-axis labels add ~24 px if present). Defaults to 280. */
  height?: number
  /**
   * Show y-axis grid lines and tick labels on the left.
   * Set to false for compact / sparkline-style cards. Defaults to true.
   */
  showYAxis?: boolean
  /**
   * Format values shown in the tooltip and the right-side callout.
   * Defaults to `v.toLocaleString()`.
   */
  valueFormat?: (v: number) => string
  /**
   * Overlay a dot texture on the area fill.
   * Defaults to true for a single series, false for multi-series.
   */
  dots?: boolean
  /**
   * Unique suffix appended to SVG gradient / clip IDs.
   * Required when rendering more than one LineChart on the same page.
   */
  uid?: string
  /**
   * Sparkline mode: removes all labels and callouts, renders only the line,
   * area fill, and subtle tick marks at the left and right edges.
   * Tooltip still works on hover.
   */
  sparkline?: boolean
}

// ─── Component ───────────────────────────────────────────────────────────────

export function LineChart({
  series,
  dates,
  xLabels: xLabelsProp,
  width: maxWidth,
  height = 280,
  showYAxis = true,
  valueFormat,
  dots,
  uid = 'a',
  sparkline = false,
}: LineChartProps) {
  const showDots  = dots ?? series.length === 1
  const formatVal = valueFormat ?? ((v: number) => v.toLocaleString())
  const hasXAxis  = !sparkline && !!(dates?.length || xLabelsProp?.length)
  const yLabelW   = (showYAxis && !sparkline) ? Y_LABEL_W : 0
  const rightW    = sparkline
    ? 0
    : CALLOUT_MAX_W + CIRCLE_R + CALLOUT_DOT_GAP + CALLOUT_RIGHT_PAD

  // ── Tooltip ────────────────────────────────────────────────────────────────

  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop, tooltipOpen } =
    useTooltip<number>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({ detectBounds: true, scroll: true })

  // ── Responsive width (fills container up to maxWidth) ──────────────────────

  const [layoutWidth, setLayoutWidth] = useState(maxWidth ?? 0)
  const measureRef = useRef<HTMLDivElement | null>(null)

  const setContainerNode = useCallback((node: HTMLDivElement | null) => {
    measureRef.current = node
    containerRef(node)
  }, [containerRef])

  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return

    const update = () => {
      const w = Math.floor(el.getBoundingClientRect().width)
      if (w > 0) setLayoutWidth(w)
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [maxWidth])

  // ── Computed layout ────────────────────────────────────────────────────────

  const computed = useMemo(() => {
    if (!series.length || !series[0].values.length) return null

    // Use measured width when available; fallback until the container ref mounts.
    const w = layoutWidth > 0 ? layoutWidth : (maxWidth ?? 560)

    const nPts    = series[0].values.length
    const allVals = series.flatMap(s => s.values)
    const dataMax = Math.max(...allVals)
    const dataMin = Math.min(...allVals)

    const ticks = niceYTicks(dataMin, dataMax)
    const yMin  = ticks[0]
    const yMax  = ticks[ticks.length - 1]

    const chartW = w - yLabelW - rightW
    const chartH = height - (hasXAxis ? X_AXIS_H : 0) - PADDING_TOP

    // ── Time-based x positioning ─────────────────────────────────────────────
    // When `dates` are provided, data points are placed proportionally to their
    // actual timestamp so the x-axis reflects real elapsed time, not data density.
    const timeMs = (dates?.length === nPts && nPts > 1)
      ? dates.map(d => new Date(d + 'T12:00:00').getTime())
      : null
    const tMin = timeMs ? timeMs[0] : 0
    const tMax = timeMs ? timeMs[timeMs.length - 1] : 0
    const tRange = timeMs ? (tMax - tMin || 1) : 1

    const xByIndex = (i: number): number => {
      if (timeMs) return yLabelW + ((timeMs[i] - tMin) / tRange) * chartW
      return yLabelW + (i / Math.max(nPts - 1, 1)) * chartW
    }

    const yScale = scaleLinear({ domain: [yMin, yMax], range: [PADDING_TOP + chartH, PADDING_TOP] })

    // End-point callout geometry
    const callouts = series.map(s => {
      const lastVal = s.values[s.values.length - 1]
      return { ...s, endX: xByIndex(nPts - 1), endY: yScale(lastVal), lastVal }
    })

    // X-axis label positions — month boundaries at their real time positions
    const labelY = PADDING_TOP + chartH + X_AXIS_H - 4
    const xLabelGeo = timeMs && !sparkline
      ? monthBoundaries(dates!).map(({ label, index }) => ({
          label, x: xByIndex(index), y: labelY,
        }))
      : xLabelsProp && !sparkline
        ? xLabelsProp.map((label, i) => ({ label, x: xByIndex(i), y: labelY }))
        : undefined

    return { nPts, ticks, yMin, yMax, chartW, chartH, xByIndex, timeMs, tMin, tRange, yScale, callouts, xLabelGeo, svgWidth: w }
  }, [series, dates, xLabelsProp, layoutWidth, maxWidth, height, yLabelW, rightW, hasXAxis, sparkline])

  // ── Mouse interaction ─────────────────────────────────────────────────────

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGRectElement>) => {
    if (!computed) return
    const { nPts, xByIndex, timeMs, tMin, tRange, chartW } = computed
    const point = localPoint(e.currentTarget.ownerSVGElement!, e)
    if (!point) return

    const clampedX = Math.max(yLabelW, Math.min(yLabelW + chartW, point.x))
    let index: number

    if (timeMs) {
      // Map mouse x → timestamp → nearest data point
      const t = tMin + ((clampedX - yLabelW) / chartW) * tRange
      let best = 0, bestDist = Infinity
      for (let i = 0; i < nPts; i++) {
        const d = Math.abs(timeMs[i] - t)
        if (d < bestDist) { bestDist = d; best = i }
      }
      index = best
    } else {
      const fraction = (clampedX - yLabelW) / chartW
      index = Math.max(0, Math.min(nPts - 1, Math.round(fraction * (nPts - 1))))
    }

    showTooltip({ tooltipData: index, tooltipLeft: xByIndex(index), tooltipTop: point.y })
  }, [computed, yLabelW, showTooltip])

  if (!computed) return null

  const { nPts, ticks, chartW, chartH, xByIndex, yScale, callouts, xLabelGeo, svgWidth } = computed
  const glowFilterId = `lc-glow-${uid}`

  return (
    <div
      ref={setContainerNode}
      style={{
        position: 'relative',
        width: '100%',
        ...(maxWidth != null ? { maxWidth } : {}),
        height: 'fit-content',
      }}
    >
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${svgWidth} ${height}`}
        style={{ display: 'block' }}
        aria-hidden="true"
      >
        <defs>
          {/* Per-series gradient area fills */}
          {series.map(s => (
            <LinearGradient
              key={s.id}
              id={`lc-fill-${uid}-${s.id}`}
              from={s.color}
              to={s.color}
              fromOpacity={showDots ? 0.14 : series.length > 1 ? 0.07 : 0.12}
              toOpacity={0}
              vertical
            />
          ))}

          {/* Dot texture patterns */}
          {showDots && series.map(s => (
            <PatternCircles
              key={s.id}
              id={`lc-dots-${uid}-${s.id}`}
              width={DOT_PITCH}
              height={DOT_PITCH}
              radius={DOT_R}
              fill={s.color}
              complement
            />
          ))}

          {/* Clip to chart drawing area — keeps glow filter inside bounds */}
          <clipPath id={`lc-clip-${uid}`}>
            <rect x={yLabelW} y={PADDING_TOP} width={chartW} height={chartH} />
          </clipPath>
          {!sparkline && (
            <clipPath id={`lc-callout-clip-${uid}`}>
              <rect
                x={svgWidth - CALLOUT_RIGHT_PAD - CALLOUT_MAX_W}
                y={0}
                width={CALLOUT_MAX_W}
                height={height}
              />
            </clipPath>
          )}
        </defs>

        {/* ── Y-axis: grid lines + labels ─────────────────────────────────── */}
        {showYAxis && !sparkline && (
          <GridRows
            scale={yScale}
            width={chartW}
            left={yLabelW}
            stroke={GRID}
            strokeWidth={1}
            tickValues={ticks}
          />
        )}
        {showYAxis && !sparkline && ticks.map(v => (
          <text
            key={v}
            x={yLabelW - 8}
            y={yScale(v) + 4}
            textAnchor="end"
            {...chartTextCaption}
          >
            {v.toLocaleString()}
          </text>
        ))}

        {/* ── Sparkline: full-width horizontal grid lines ───────────────────── */}
        {sparkline && (
          <GridRows
            scale={yScale}
            width={svgWidth}
            left={0}
            stroke={GRID}
            strokeWidth={1}
            tickValues={ticks}
          />
        )}

        {/* ── Area fills — rendered back-to-front ──────────────────────────── */}
        {[...series].reverse().map(s => (
          <g key={`fill-${s.id}`} clipPath={`url(#lc-clip-${uid})`}>
            <AreaClosed
              data={s.values}
              x={(_, i) => xByIndex(i)}
              y={v => yScale(v)}
              yScale={yScale}
              curve={curveCatmullRom}
              fill={`url(#lc-fill-${uid}-${s.id})`}
            />
            {showDots && (
              <AreaClosed
                data={s.values}
                x={(_, i) => xByIndex(i)}
                y={v => yScale(v)}
                yScale={yScale}
                curve={curveCatmullRom}
                fill={`url(#lc-dots-${uid}-${s.id})`}
              />
            )}
          </g>
        ))}

        {/* ── Lines + glow — each in its own clip group ────────────────────── */}
        {[...series].reverse().map(s => (
          <g key={`line-${s.id}`} clipPath={`url(#lc-clip-${uid})`}>
            <LinePath
              data={s.values}
              x={(_, i) => xByIndex(i)}
              y={v => yScale(v)}
              curve={curveCatmullRom}
              stroke={s.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: lineGlow(s.color) }}
            />
          </g>
        ))}

        {/* ── Crosshair ────────────────────────────────────────────────────── */}
        {tooltipOpen && tooltipLeft !== undefined && (
          <line
            x1={tooltipLeft}
            x2={tooltipLeft}
            y1={PADDING_TOP}
            y2={PADDING_TOP + chartH}
            stroke={AXIS_MUTED}
            strokeWidth={1}
            strokeDasharray="3 3"
            pointerEvents="none"
          />
        )}

        {/* ── Hover dots on each series ─────────────────────────────────────── */}
        {tooltipOpen && tooltipData !== undefined && series.map(s => (
          <circle
            key={`hover-${s.id}`}
            cx={xByIndex(tooltipData)}
            cy={yScale(s.values[tooltipData])}
            r={4}
            fill={s.color}
            stroke="white"
            strokeWidth={2}
            pointerEvents="none"
          />
        ))}

        {/* ── End-point hollow circles + right-side callouts ───────────────── */}
        {!sparkline && callouts.map(s => (
          <circle
            key={`dot-${s.id}`}
            cx={s.endX}
            cy={s.endY}
            r={CIRCLE_R}
            fill="white"
            stroke={s.color}
            strokeWidth={2}
          />
        ))}
        {!sparkline && callouts.map(s => {
          const textX = svgWidth - CALLOUT_RIGHT_PAD
          return (
            <g key={`callout-${s.id}`} clipPath={`url(#lc-callout-clip-${uid})`}>
              <text x={textX} y={s.endY - 8} textAnchor="end" {...chartTextCaption}>
                {s.label}
              </text>
              <text x={textX} y={s.endY + 18} textAnchor="end" {...chartTextValue}>
                {formatVal(s.lastVal)}
              </text>
            </g>
          )
        })}

        {/* ── X-axis labels ────────────────────────────────────────────────── */}
        {!sparkline && xLabelGeo?.map(({ label, x, y }, i) => {
          if (!label) return null
          const plotRight = yLabelW + chartW
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor={xLabelTextAnchor(x, yLabelW, plotRight)}
              {...chartTextCaption}
            >
              {label}
            </text>
          )
        })}

        {/* ── Mouse overlay — must be last so it's on top ──────────────────── */}
        <rect
          x={yLabelW}
          y={PADDING_TOP}
          width={chartW}
          height={chartH}
          fill="transparent"
          onMouseMove={handleMouseMove}
          onMouseLeave={hideTooltip}
        />
      </svg>

      {/* ── Tooltip ──────────────────────────────────────────────────────────── */}
      {tooltipOpen && tooltipData !== undefined && (
        <TooltipInPortal
          left={tooltipLeft}
          top={tooltipTop}
          style={chartTooltipStyles}
        >
          {dates?.[tooltipData] && (
            <ChartTooltipHeader>{formatTooltipDate(dates[tooltipData])}</ChartTooltipHeader>
          )}
          <ChartTooltipBody>
            {series.map(s => (
              <ChartTooltipRow
                key={s.id}
                color={s.color}
                label={s.label}
                value={formatVal(s.values[tooltipData])}
              />
            ))}
          </ChartTooltipBody>
        </TooltipInPortal>
      )}
    </div>
  )
}
