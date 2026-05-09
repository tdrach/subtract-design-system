'use client'

import { useMemo, useCallback } from 'react'
import { scaleLinear } from '@visx/scale'
import { LinePath, AreaClosed } from '@visx/shape'
import { curveCatmullRom } from '@visx/curve'
import { GridRows } from '@visx/grid'
import { LinearGradient } from '@visx/gradient'
import { PatternCircles } from '@visx/pattern'
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip'
import { localPoint } from '@visx/event'

// ─── DS token constants ───────────────────────────────────────────────────────

const MUTED = 'rgba(12,12,12,0.28)'  // axis labels, callout series labels
const GRID  = 'rgba(12,12,12,0.07)'  // horizontal grid lines
const BLACK = '#0c0c0c'              // callout values

// ─── Layout constants ─────────────────────────────────────────────────────────

const Y_LABEL_W   = 52    // px reserved for y-axis labels (0 when showYAxis=false)
const RIGHT_W     = 130   // px reserved for right-side callouts (0 in sparkline)
const CIRCLE_R    = 6     // end-of-line hollow circle radius
const DOT_PITCH   = 7     // dot texture grid pitch (px)
const DOT_R       = 0.9   // dot texture circle radius
const X_AXIS_H    = 24    // px reserved for x-axis labels when present
const PADDING_TOP = 10    // px headroom so the top tick label isn't clipped
const TICK_DASH   = 4     // px width of sparkline edge tick marks

// ─── Tooltip styles ───────────────────────────────────────────────────────────

const TOOLTIP_STYLES: React.CSSProperties = {
  ...defaultStyles,
  background: '#0c0c0c',
  color: '#fff',
  padding: '8px 12px',
  borderRadius: 8,
  fontSize: 13,
  fontFamily: 'inherit',
  boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
  lineHeight: 1,
}

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
 * Convert 'YYYY-MM-DD' dates into sparse month labels for the x-axis.
 */
function datesToMonthLabels(dates: string[]): string[] {
  let lastMonth = ''
  return dates.map(d => {
    const month = new Date(d + 'T12:00:00').toLocaleString('en', { month: 'short' })
    if (month !== lastMonth) { lastMonth = month; return month }
    return ''
  })
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
  /** Displayed as small uppercase text in the right-side callout */
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
  /** Total SVG width in px. Defaults to 560. */
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
  width = 560,
  height = 280,
  showYAxis = true,
  valueFormat,
  dots,
  uid = 'a',
  sparkline = false,
}: LineChartProps) {
  const showDots  = dots ?? series.length === 1
  const formatVal = valueFormat ?? ((v: number) => v.toLocaleString())
  const xLabels   = (!sparkline && dates?.length) ? datesToMonthLabels(dates) : (!sparkline ? xLabelsProp : undefined)
  const hasXAxis  = !!xLabels?.length
  const yLabelW   = (showYAxis && !sparkline) ? Y_LABEL_W : 0
  const rightW    = sparkline ? 0 : RIGHT_W

  // ── Tooltip ────────────────────────────────────────────────────────────────

  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop, tooltipOpen } =
    useTooltip<number>()

  // ── Computed layout ────────────────────────────────────────────────────────

  const computed = useMemo(() => {
    if (!series.length || !series[0].values.length) return null

    const nPts    = series[0].values.length
    const allVals = series.flatMap(s => s.values)
    const dataMax = Math.max(...allVals)
    const dataMin = Math.min(...allVals)

    const ticks = niceYTicks(dataMin, dataMax)
    const yMin  = ticks[0]
    const yMax  = ticks[ticks.length - 1]

    const chartW = width  - yLabelW - rightW
    const chartH = height - (hasXAxis ? X_AXIS_H : 0) - PADDING_TOP

    const xScale = scaleLinear({ domain: [0, Math.max(nPts - 1, 1)], range: [yLabelW, yLabelW + chartW] })
    const yScale = scaleLinear({ domain: [yMin, yMax], range: [PADDING_TOP + chartH, PADDING_TOP] })

    // End-point callout geometry
    const callouts = series.map(s => {
      const lastVal = s.values[s.values.length - 1]
      return {
        ...s,
        endX: xScale(nPts - 1),
        endY: yScale(lastVal),
        lastVal,
      }
    })

    // X-axis label positions
    const xLabelGeo = xLabels?.map((label, i) => ({
      label,
      x: xScale(i),
      y: PADDING_TOP + chartH + X_AXIS_H - 4,
    }))

    return { nPts, ticks, yMin, yMax, chartW, chartH, xScale, yScale, callouts, xLabelGeo }
  }, [series, xLabels, width, height, yLabelW, rightW, hasXAxis])

  // ── Mouse interaction ─────────────────────────────────────────────────────

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGRectElement>) => {
    if (!computed) return
    const { nPts, xScale, chartW } = computed
    const point = localPoint(e.currentTarget.ownerSVGElement!, e)
    if (!point) return

    const clampedX = Math.max(yLabelW, Math.min(yLabelW + chartW, point.x))
    const fraction = (clampedX - yLabelW) / chartW
    const index    = Math.max(0, Math.min(nPts - 1, Math.round(fraction * (nPts - 1))))
    const snapX    = xScale(index)

    showTooltip({ tooltipData: index, tooltipLeft: snapX, tooltipTop: point.y })
  }, [computed, yLabelW, showTooltip])

  if (!computed) return null

  const { nPts, ticks, chartW, chartH, xScale, yScale, callouts, xLabelGeo } = computed
  const glowFilterId = `lc-glow-${uid}`

  return (
    <div style={{ position: 'relative', width, height: 'fit-content' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: 'block', overflow: 'visible' }}
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
            fontSize={11}
            fill={MUTED}
            fontFamily="inherit"
          >
            {v.toLocaleString()} -
          </text>
        ))}

        {/* ── Sparkline edge tick marks ─────────────────────────────────────── */}
        {sparkline && ticks.map(v => {
          const y = yScale(v)
          return (
            <g key={v}>
              <line x1={0}           y1={y} x2={TICK_DASH}        y2={y} stroke={GRID} strokeWidth={1} />
              <line x1={width - TICK_DASH} y1={y} x2={width} y2={y} stroke={GRID} strokeWidth={1} />
            </g>
          )
        })}

        {/* ── Area fills — rendered back-to-front ──────────────────────────── */}
        {[...series].reverse().map(s => (
          <g key={`fill-${s.id}`} clipPath={`url(#lc-clip-${uid})`}>
            <AreaClosed
              data={s.values}
              x={(_, i) => xScale(i)}
              y={v => yScale(v)}
              yScale={yScale}
              curve={curveCatmullRom}
              fill={`url(#lc-fill-${uid}-${s.id})`}
            />
            {showDots && (
              <AreaClosed
                data={s.values}
                x={(_, i) => xScale(i)}
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
              x={(_, i) => xScale(i)}
              y={v => yScale(v)}
              curve={curveCatmullRom}
              stroke={s.color}
              strokeWidth={3}
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
            stroke={MUTED}
            strokeWidth={1}
            strokeDasharray="3 3"
            pointerEvents="none"
          />
        )}

        {/* ── Hover dots on each series ─────────────────────────────────────── */}
        {tooltipOpen && tooltipData !== undefined && series.map(s => (
          <circle
            key={`hover-${s.id}`}
            cx={xScale(tooltipData)}
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
            strokeWidth={2.5}
          />
        ))}
        {!sparkline && callouts.map(s => {
          const x = s.endX + CIRCLE_R + 10
          return (
            <g key={`callout-${s.id}`}>
              <text
                x={x} y={s.endY - 8}
                fontSize={10} fontWeight={600} letterSpacing="0.06em"
                fill={MUTED} fontFamily="inherit"
              >
                {s.label.toUpperCase()}
              </text>
              <text
                x={x} y={s.endY + 18}
                fontSize={22} fontWeight={700} letterSpacing="-0.03em"
                fill={BLACK} fontFamily="inherit"
              >
                {formatVal(s.lastVal)}
              </text>
            </g>
          )
        })}

        {/* ── X-axis labels ────────────────────────────────────────────────── */}
        {!sparkline && xLabelGeo?.map(({ label, x, y }, i) =>
          label ? (
            <text
              key={i}
              x={x} y={y}
              textAnchor="middle"
              fontSize={12} fill={MUTED} fontFamily="inherit"
            >
              {label}
            </text>
          ) : null
        )}

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
        <TooltipWithBounds
          left={tooltipLeft}
          top={tooltipTop}
          style={TOOLTIP_STYLES}
        >
          {dates?.[tooltipData] && (
            <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 8, letterSpacing: '0.02em' }}>
              {formatTooltipDate(dates[tooltipData])}
            </div>
          )}
          {series.map(s => (
            <div
              key={s.id}
              style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
              <span style={{ opacity: 0.55, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {s.label}
              </span>
              <span style={{ fontWeight: 700, fontSize: 13, marginLeft: 'auto', paddingLeft: 16 }}>
                {formatVal(s.values[tooltipData])}
              </span>
            </div>
          ))}
        </TooltipWithBounds>
      )}
    </div>
  )
}
