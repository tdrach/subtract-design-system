'use client'

import { useMemo } from 'react'

// ─── DS token constants ───────────────────────────────────────────────────────

const MUTED = 'rgba(12,12,12,0.28)'  // axis labels, callout series labels
const GRID  = 'rgba(12,12,12,0.07)'  // horizontal grid lines
const BLACK = '#0c0c0c'              // callout values

// ─── Layout constants ─────────────────────────────────────────────────────────

const Y_LABEL_W = 52   // px reserved for y-axis labels (0 when showYAxis=false)
const RIGHT_W   = 130  // px reserved for right-side callouts
const CIRCLE_R  = 6    // end-of-line hollow circle radius
const DOT_PITCH = 7    // dot texture grid pitch (px)
const DOT_R     = 0.9  // dot texture circle radius
const X_AXIS_H  = 24   // px reserved for x-axis labels when present

// ─── Helpers ─────────────────────────────────────────────────────────────────

function f(n: number) { return n.toFixed(2) }

/** Catmull-Rom → cubic Bézier smooth path */
function smoothCurve(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  const d: string[] = [`M ${f(pts[0].x)},${f(pts[0].y)}`]
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d.push(`C ${f(cp1x)},${f(cp1y)} ${f(cp2x)},${f(cp2y)} ${f(p2.x)},${f(p2.y)}`)
  }
  return d.join(' ')
}

/** Closed area path: smooth line → drop to baseline → close */
function areaPath(pts: { x: number; y: number }[], baseY: number): string {
  if (pts.length < 2) return ''
  const last  = pts[pts.length - 1]
  const first = pts[0]
  return `${smoothCurve(pts)} L ${f(last.x)},${f(baseY)} L ${f(first.x)},${f(baseY)} Z`
}

/** Parse #rrggbb → [r, g, b] */
function hexRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

/**
 * Builds a CSS `filter` string that replicates the 6-layer Figma drop-shadow.
 * Opacity values decoded from hex alpha: #168F3F24 → 0x24/255 ≈ 0.14, etc.
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
 * Compute y-axis tick values. Always ensures the last tick ≥ dataMax
 * so smooth curves never exceed the clip boundary.
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
  // Guard: ensure last tick always covers dataMax (floating-point safety)
  if (ticks[ticks.length - 1] < dataMax) ticks.push(Math.round(ticks[ticks.length - 1] + niceStep))
  return ticks
}

/**
 * Convert an array of 'YYYY-MM-DD' dates into sparse x-axis labels.
 * Only the first occurrence of each month gets a label; the rest are empty.
 */
function datesToMonthLabels(dates: string[]): string[] {
  let lastMonth = ''
  return dates.map(d => {
    const month = new Date(d + 'T12:00:00').toLocaleString('en', { month: 'short' })
    if (month !== lastMonth) { lastMonth = month; return month }
    return ''
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
   * When provided, the x-axis automatically shows month labels at each
   * month boundary. Supersedes `xLabels`.
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
   * Format the last value shown in the right-side callout.
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
}: LineChartProps) {
  const showDots   = dots ?? series.length === 1
  const formatVal  = valueFormat ?? ((v: number) => v.toLocaleString())
  // Effective x-axis labels: dates → sparse month labels; else explicit labels
  const xLabels    = dates?.length ? datesToMonthLabels(dates) : xLabelsProp
  const hasXAxis   = !!xLabels?.length
  const yLabelW    = showYAxis ? Y_LABEL_W : 0

  const computed = useMemo(() => {
    if (!series.length || !series[0].values.length) return null

    const nPts    = series[0].values.length
    const allVals = series.flatMap(s => s.values)
    const dataMax = Math.max(...allVals)
    const dataMin = Math.min(...allVals)

    const ticks = niceYTicks(dataMin, dataMax)
    const yMin  = ticks[0]
    const yMax  = ticks[ticks.length - 1]

    const chartW = width  - yLabelW - RIGHT_W
    const chartH = height - (hasXAxis ? X_AXIS_H : 0)

    const scaleX = (i: number) => yLabelW + (i / Math.max(nPts - 1, 1)) * chartW
    const scaleY = (v: number) => chartH - ((v - yMin) / (yMax - yMin)) * chartH

    const seriesGeo = series.map(s => {
      const pts  = s.values.map((v, i) => ({ x: scaleX(i), y: scaleY(v) }))
      const last = pts[pts.length - 1]
      return {
        ...s,
        pts,
        linePath: smoothCurve(pts),
        fillPath: areaPath(pts, chartH),
        endX: last.x,
        endY: last.y,
        lastVal: s.values[s.values.length - 1],
      }
    })

    const tickGeo = ticks.map(v => ({
      v,
      y: scaleY(v),
      label: v.toLocaleString(),
    }))

    const xLabelGeo = xLabels?.map((label, i) => ({
      label,
      x: scaleX(i),
      y: chartH + X_AXIS_H - 4,
    }))

    return { seriesGeo, tickGeo, xLabelGeo, chartW, chartH }
  }, [series, xLabels, width, height, yLabelW, hasXAxis])

  if (!computed) return null

  const { seriesGeo, tickGeo, xLabelGeo, chartW, chartH } = computed

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        {/* Per-series gradient area fills */}
        {seriesGeo.map(s => (
          <linearGradient key={s.id} id={`lc-fill-${uid}-${s.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={s.color} stopOpacity={showDots ? 0.14 : 0.12} />
            <stop offset="100%" stopColor={s.color} stopOpacity={0.01} />
          </linearGradient>
        ))}

        {/* Dot texture patterns */}
        {showDots && seriesGeo.map(s => (
          <pattern
            key={s.id}
            id={`lc-dots-${uid}-${s.id}`}
            x="0" y="0" width={DOT_PITCH} height={DOT_PITCH}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={DOT_PITCH / 2} cy={DOT_PITCH / 2} r={DOT_R} fill={s.color} opacity={0.20} />
          </pattern>
        ))}

        {/*
          Clip strictly to the chart drawing area.
          Wrapping lines in a <g clipPath> means the drop-shadow filter
          is also clipped, so glows can't bleed above the top grid line
          or below the bottom grid line.
        */}
        <clipPath id={`lc-clip-${uid}`}>
          <rect x={yLabelW} y={0} width={chartW} height={chartH} />
        </clipPath>
      </defs>

      {/* ── Y-axis: grid lines + labels ───────────────────────────────────── */}
      {showYAxis && tickGeo.map(({ v, y, label }) => (
        <g key={v}>
          <line
            x1={yLabelW} y1={y}
            x2={yLabelW + chartW} y2={y}
            stroke={GRID} strokeWidth={1}
          />
          <text
            x={yLabelW - 8} y={y + 4}
            textAnchor="end"
            fontSize={11} fill={MUTED} fontFamily="inherit"
          >
            {label} -
          </text>
        </g>
      ))}

      {/* ── Area fills — rendered back-to-front ───────────────────────────── */}
      {[...seriesGeo].reverse().map(s => (
        <g key={`fill-${s.id}`} clipPath={`url(#lc-clip-${uid})`}>
          <path d={s.fillPath} fill={`url(#lc-fill-${uid}-${s.id})`} />
          {showDots && <path d={s.fillPath} fill={`url(#lc-dots-${uid}-${s.id})`} />}
        </g>
      ))}

      {/*
        ── Lines + glow — each wrapped in its own clip group ─────────────────
        Applying clipPath to the <g> means the CSS drop-shadow filter rendered
        on the inner <path> is clipped by the group boundary, preventing glows
        from escaping above yMax or below yMin.
      */}
      {[...seriesGeo].reverse().map(s => (
        <g key={`line-${s.id}`} clipPath={`url(#lc-clip-${uid})`}>
          <path
            d={s.linePath}
            stroke={s.color}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: lineGlow(s.color) }}
          />
        </g>
      ))}

      {/* ── End-point hollow circles (outside clip — intentionally) ───────── */}
      {seriesGeo.map(s => (
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

      {/* ── Right-side callouts: series label + last value ────────────────── */}
      {seriesGeo.map(s => {
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

      {/* ── X-axis labels — empty strings (from date gaps) are skipped ─────── */}
      {xLabelGeo?.map(({ label, x, y }, i) =>
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
    </svg>
  )
}
