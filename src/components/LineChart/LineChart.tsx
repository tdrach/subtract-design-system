'use client'

import { useMemo } from 'react'

// ─── DS token constants ───────────────────────────────────────────────────────

const MUTED = 'rgba(12,12,12,0.28)'  // axis labels, callout series labels
const GRID  = 'rgba(12,12,12,0.07)'  // horizontal grid lines
const BLACK = '#0c0c0c'              // callout values

// ─── Layout constants ─────────────────────────────────────────────────────────

const Y_LABEL_W = 52   // px reserved for y-axis labels on the left
const RIGHT_W   = 130  // px reserved for right-side callouts
const CIRCLE_R  = 6    // end-of-line hollow circle radius
const DOT_PITCH = 7    // dot pattern grid size (px)
const DOT_R     = 0.9  // dot pattern circle radius

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

/** Closed area path: smooth line + vertical drop to baseline + close */
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
 * Opacity values decoded from the hex alpha in the spec (#168F3F24 → 0x24/255 ≈ 0.14).
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

/** Compute evenly-spaced, human-readable y-axis tick values for a given range */
function niceYTicks(dataMin: number, dataMax: number, targetCount = 7): number[] {
  const range    = dataMax - dataMin || 1
  const rawStep  = range / (targetCount - 1)
  const exp      = Math.floor(Math.log10(rawStep))
  const mag      = Math.pow(10, exp)
  const norm     = rawStep / mag
  const niceStep = norm <= 1 ? mag : norm <= 2 ? 2 * mag : norm <= 5 ? 5 * mag : 10 * mag
  const lo       = Math.floor(dataMin / niceStep) * niceStep
  const ticks: number[] = []
  for (let v = lo; v <= dataMax + niceStep * 0.01; v += niceStep) {
    ticks.push(Math.round(v))
  }
  return ticks
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LineSeriesData {
  id: string
  /** Displayed as small uppercase text in the right-side callout */
  label: string
  /** One value per x-axis tick. All series must have the same length. */
  values: number[]
  /** Hex color, e.g. "#16a34a" — used for line, glow, fill, and dot texture */
  color: string
}

export interface LineChartProps {
  series: LineSeriesData[]
  /** X-axis tick labels. Length should match series[*].values.length. */
  xLabels?: string[]
  /** Total SVG width in px. Defaults to 560. */
  width?: number
  /** Chart area height in px (excluding x-axis labels). Defaults to 280. */
  height?: number
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
  xLabels,
  width = 560,
  height = 280,
  dots,
  uid = 'a',
}: LineChartProps) {
  const showDots = dots ?? series.length === 1

  const computed = useMemo(() => {
    if (!series.length || !series[0].values.length) return null

    const nPts    = series[0].values.length
    const allVals = series.flatMap(s => s.values)
    const dataMax = Math.max(...allVals)
    const dataMin = Math.min(...allVals)

    const ticks = niceYTicks(dataMin, dataMax)
    const yMin  = ticks[0]
    const yMax  = ticks[ticks.length - 1]

    const X_AXIS_H = xLabels?.length ? 24 : 0
    const chartW   = width  - Y_LABEL_W - RIGHT_W
    const chartH   = height - X_AXIS_H

    const scaleX = (i: number) => Y_LABEL_W + (i / Math.max(nPts - 1, 1)) * chartW
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
  }, [series, xLabels, width, height])

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

        {/* Dot texture patterns — only for single-series or when dots=true */}
        {showDots && seriesGeo.map(s => (
          <pattern
            key={s.id}
            id={`lc-dots-${uid}-${s.id}`}
            x="0" y="0" width={DOT_PITCH} height={DOT_PITCH}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={DOT_PITCH / 2} cy={DOT_PITCH / 2} r={DOT_R}
              fill={s.color} opacity={0.20}
            />
          </pattern>
        ))}

        {/* Clip to chart drawing area only */}
        <clipPath id={`lc-clip-${uid}`}>
          <rect x={Y_LABEL_W} y={0} width={chartW} height={chartH} />
        </clipPath>
      </defs>

      {/* ── Y-axis: grid lines + labels ───────────────────────────────────── */}
      {tickGeo.map(({ v, y, label }) => (
        <g key={v}>
          <line
            x1={Y_LABEL_W} y1={y}
            x2={Y_LABEL_W + chartW} y2={y}
            stroke={GRID} strokeWidth={1}
          />
          <text
            x={Y_LABEL_W - 8} y={y + 4}
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
          {showDots && (
            <path d={s.fillPath} fill={`url(#lc-dots-${uid}-${s.id})`} />
          )}
        </g>
      ))}

      {/* ── Lines + glow — rendered back-to-front ─────────────────────────── */}
      {[...seriesGeo].reverse().map(s => (
        <path
          key={`line-${s.id}`}
          d={s.linePath}
          stroke={s.color}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          clipPath={`url(#lc-clip-${uid})`}
          style={{ filter: lineGlow(s.color) }}
        />
      ))}

      {/* ── End-point hollow circles ──────────────────────────────────────── */}
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

      {/* ── Right-side callouts: label + value ────────────────────────────── */}
      {seriesGeo.map(s => {
        const x = s.endX + CIRCLE_R + 10
        return (
          <g key={`callout-${s.id}`}>
            {/* Series label — small uppercase */}
            <text
              x={x} y={s.endY - 8}
              fontSize={10} fontWeight={600} letterSpacing="0.06em"
              fill={MUTED} fontFamily="inherit"
            >
              {s.label.toUpperCase()}
            </text>
            {/* Last value — large */}
            <text
              x={x} y={s.endY + 18}
              fontSize={22} fontWeight={700} letterSpacing="-0.03em"
              fill={BLACK} fontFamily="inherit"
            >
              {s.lastVal.toLocaleString()}
            </text>
          </g>
        )
      })}

      {/* ── X-axis labels ─────────────────────────────────────────────────── */}
      {xLabelGeo?.map(({ label, x, y }) => (
        <text
          key={label}
          x={x} y={y}
          textAnchor="middle"
          fontSize={12} fill={MUTED} fontFamily="inherit"
        >
          {label}
        </text>
      ))}
    </svg>
  )
}
