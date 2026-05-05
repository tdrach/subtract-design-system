'use client'

import { useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WeightDataPoint {
  date: string
  weight_lbs: number
  body_fat: number | null
}

export interface WeightChartProps {
  data: WeightDataPoint[]
  width: number
  height: number
  /**
   * Unique suffix appended to SVG gradient / mask IDs.
   * Required when rendering more than one chart per page.
   */
  uid?: string
}

// ─── Design tokens (mirrors tokens.scss values) ───────────────────────────────

const BLUE  = '#0035ff'  // $blue
const GREEN = '#16a34a'  // lean mass
const AMBER = '#d97706'  // body fat %

const MUTED      = 'rgba(12,12,12,0.32)'   // axis labels
const PILL_FONT  = 'inherit'               // picks up $font-text from cascade
const RADIUS_SM  = 5                       // $radius-micro

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

/** Map a value array to Y coordinates within [topPad, chartH - botPad] */
function makeYScale(values: number[], chartH: number, topPad: number, botPad: number) {
  const min   = Math.min(...values)
  const max   = Math.max(...values)
  const range = max - min || 1
  const span  = chartH - topPad - botPad
  return (v: number) => topPad + span * (1 - (v - min) / range)
}

// ─── Component ───────────────────────────────────────────────────────────────

export function WeightChart({ data, width, height, uid = 'a' }: WeightChartProps) {
  const LABEL_H = 18
  const PAD_X   = 12

  const chartW = width  - PAD_X * 2
  const chartH = height - LABEL_H

  // Ribbon thickness scales with chart height
  const BAND = Math.max(8, chartH * 0.22)

  const computed = useMemo(() => {
    if (data.length < 2) return null

    // ── Weight series ────────────────────────────────────────────────────────
    const weights = data.map(d => d.weight_lbs)
    const weightY = makeYScale(weights, chartH, BAND + 4, BAND + 4)

    const weightPts = data.map((d, i) => ({
      x: PAD_X + (i / (data.length - 1)) * chartW,
      y: weightY(d.weight_lbs),
      v: d.weight_lbs,
      date: d.date,
    }))

    const topPts = weightPts.map(p => ({ x: p.x, y: p.y - BAND }))
    const botPts = weightPts.map(p => ({ x: p.x, y: p.y + BAND }))

    const topCurve   = smoothCurve(topPts)
    const botCurve   = smoothCurve([...botPts].reverse())
    const bandPath   = topCurve + ' L' + botCurve.slice(1) + ' Z'
    const weightPath = smoothCurve(weightPts)

    // ── Body-fat + lean mass (sparse — only entries with data) ───────────────
    const bfEntries = data
      .map((d, i) => ({ d, i }))
      .filter(({ d }) => d.body_fat !== null) as { d: WeightDataPoint & { body_fat: number }; i: number }[]

    let bfPath  = ''
    let bfPts: { x: number; y: number; v: number }[] = []
    let leanPath = ''
    let leanPts: { x: number; y: number; v: number }[] = []

    if (bfEntries.length >= 2) {
      const bfValues   = bfEntries.map(({ d }) => d.body_fat)
      const bfY        = makeYScale(bfValues, chartH, 6, LABEL_H + 4)
      bfPts = bfEntries.map(({ d, i }) => ({
        x: PAD_X + (i / (data.length - 1)) * chartW,
        y: bfY(d.body_fat),
        v: d.body_fat,
      }))
      bfPath = smoothCurve(bfPts)

      const leanValues = bfEntries.map(({ d }) => d.weight_lbs * (1 - d.body_fat / 100))
      const leanY      = makeYScale(leanValues, chartH, 6, LABEL_H + 4)
      leanPts = bfEntries.map(({ d, i }) => {
        const lean = d.weight_lbs * (1 - d.body_fat / 100)
        return { x: PAD_X + (i / (data.length - 1)) * chartW, y: leanY(lean), v: lean }
      })
      leanPath = smoothCurve(leanPts)
    }

    // ── Month labels ─────────────────────────────────────────────────────────
    const monthMarks: { x: number; label: string }[] = []
    let lastMonth = ''
    for (const pt of weightPts) {
      const month = new Date(pt.date + 'T12:00:00').toLocaleString('en', { month: 'short' })
      if (month !== lastMonth) {
        monthMarks.push({ x: pt.x, label: month })
        lastMonth = month
      }
    }

    // ── Weight callout pills at first / mid / last ────────────────────────────
    const idxs = [...new Set([0, Math.floor((data.length - 1) / 2), data.length - 1])]
    const weightCallouts = idxs.map(i => ({
      x:    weightPts[i].x,
      topY: topPts[i].y,
      v:    weightPts[i].v,
    }))

    // ── Right-edge callouts for secondary series ──────────────────────────────
    const bfLatest   = bfPts.at(-1)   ?? null
    const leanLatest = leanPts.at(-1) ?? null

    return { bandPath, weightPath, topPts, botPts, bfPath, leanPath,
             monthMarks, weightCallouts, bfLatest, leanLatest }
  }, [data, chartW, chartH, BAND, PAD_X])

  if (!computed || data.length < 2) return null

  const {
    bandPath, weightPath, topPts, botPts,
    bfPath, leanPath,
    monthMarks, weightCallouts, bfLatest, leanLatest,
  } = computed

  const gradId = `wc-band-${uid}`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={BLUE} stopOpacity="0.03" />
          <stop offset="50%"  stopColor={BLUE} stopOpacity="0.26" />
          <stop offset="100%" stopColor={BLUE} stopOpacity="0.03" />
        </linearGradient>
      </defs>

      {/* Vertical guide ticks at callout positions */}
      {weightCallouts.map((c, i) => (
        <line key={i}
          x1={c.x} y1={0} x2={c.x} y2={chartH}
          stroke={BLUE} strokeOpacity={0.07} strokeWidth={1}
        />
      ))}

      {/* Body fat % — dashed amber */}
      {bfPath && (
        <path d={bfPath}
          stroke={AMBER} strokeWidth={1.25} fill="none"
          strokeOpacity={0.55} strokeDasharray="3 2"
        />
      )}

      {/* Lean mass — solid green */}
      {leanPath && (
        <path d={leanPath}
          stroke={GREEN} strokeWidth={1.25} fill="none"
          strokeOpacity={0.55}
        />
      )}

      {/* Weight ribbon fill */}
      <path d={bandPath} fill={`url(#${gradId})`} />

      {/* Weight centre line */}
      <path d={weightPath}
        stroke={BLUE} strokeWidth={1.5} fill="none" strokeOpacity={0.6}
      />

      {/* Ribbon edge traces */}
      <path d={smoothCurve(topPts)}
        stroke={BLUE} strokeWidth={0.75} fill="none" strokeOpacity={0.14}
      />
      <path d={smoothCurve(botPts)}
        stroke={BLUE} strokeWidth={0.75} fill="none" strokeOpacity={0.14}
      />

      {/* Weight callout pills */}
      {weightCallouts.map((c, i) => {
        const label = c.v.toFixed(1)
        const pillW = label.length * 5.2 + 14
        const pillH = 16
        const pillX = c.x - pillW / 2
        const pillY = c.topY - pillH - 4
        return (
          <g key={i}>
            <rect x={pillX} y={pillY} width={pillW} height={pillH}
              rx={pillH / 2}
              fill="white" stroke={BLUE} strokeOpacity={0.16} strokeWidth={1}
            />
            <text
              x={c.x} y={pillY + pillH - 4.5}
              textAnchor="middle"
              fontSize={10} fontWeight="500"
              fill={BLUE} fillOpacity={0.8}
              fontFamily={PILL_FONT}
            >
              {label}
            </text>
          </g>
        )
      })}

      {/* Body fat latest callout */}
      {bfLatest && (() => {
        const label = `${bfLatest.v.toFixed(1)}%`
        const pillW = label.length * 5.2 + 12
        const pillH = 15
        const pillX = Math.min(bfLatest.x - pillW / 2, width - pillW - 2)
        const pillY = bfLatest.y - pillH / 2
        return (
          <g>
            <rect x={pillX} y={pillY} width={pillW} height={pillH}
              rx={RADIUS_SM}
              fill="white" stroke={AMBER} strokeOpacity={0.4} strokeWidth={1}
            />
            <text
              x={pillX + pillW / 2} y={pillY + pillH - 4}
              textAnchor="middle"
              fontSize={10} fontWeight="500"
              fill={AMBER} fillOpacity={0.9}
              fontFamily={PILL_FONT}
            >
              {label}
            </text>
          </g>
        )
      })()}

      {/* Lean mass latest callout */}
      {leanLatest && (() => {
        const label = `${leanLatest.v.toFixed(1)} lbs`
        const pillW = label.length * 5.2 + 12
        const pillH = 15
        const pillX = Math.min(leanLatest.x - pillW / 2, width - pillW - 2)
        const pillY = leanLatest.y - pillH - 2
        return (
          <g>
            <rect x={pillX} y={pillY} width={pillW} height={pillH}
              rx={RADIUS_SM}
              fill="white" stroke={GREEN} strokeOpacity={0.4} strokeWidth={1}
            />
            <text
              x={pillX + pillW / 2} y={pillY + pillH - 4}
              textAnchor="middle"
              fontSize={10} fontWeight="500"
              fill={GREEN} fillOpacity={0.9}
              fontFamily={PILL_FONT}
            >
              {label}
            </text>
          </g>
        )
      })()}

      {/* Month axis labels */}
      {monthMarks.map((m, i) => (
        <text key={i}
          x={m.x} y={height - 4}
          textAnchor="middle"
          fontSize={10}
          fill={MUTED}
          fontFamily={PILL_FONT}
        >
          {m.label}
        </text>
      ))}
    </svg>
  )
}
