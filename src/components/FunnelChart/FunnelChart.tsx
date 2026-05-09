'use client'

import { useMemo, useCallback } from 'react'
import { scaleLinear } from '@visx/scale'
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip'
import { localPoint } from '@visx/event'

// ─── DS token constants ───────────────────────────────────────────────────────

const BLACK = '#0c0c0c'
const DIVIDER = 'rgba(255,255,255,0.55)'

// ─── Layout constants ─────────────────────────────────────────────────────────

const BADGE_H      = 34   // pill badge height
const BADGE_PAD_X  = 16   // horizontal padding inside badge
const BADGE_MIN_W  = 72   // minimum badge width

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
  lineHeight: 1.4,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Parse #rrggbb → rgba string */
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha.toFixed(2)})`
}

/** Catmull-Rom → cubic Bézier smooth path, starting with M or L */
function smoothSegment(pts: { x: number; y: number }[], startCmd: 'M' | 'L' = 'M'): string {
  if (!pts.length) return ''
  const f  = (n: number) => n.toFixed(2)
  const d: string[] = [`${startCmd} ${f(pts[0].x)},${f(pts[0].y)}`]
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

/** Closed area path: top curve left→right, bottom curve right→left */
function bandAreaPath(
  topPts: { x: number; y: number }[],
  botPts: { x: number; y: number }[]
): string {
  const top = smoothSegment(topPts, 'M')
  const bot = smoothSegment([...botPts].reverse(), 'L')
  return `${top} ${bot} Z`
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FunnelStage {
  /** Optional label (not currently rendered; reserved for future use). */
  label?: string
  /** Total value shown in the pill badge at this stage. */
  value: number
  /**
   * Relative proportions of each band at this stage.
   * Length must match across all stages. If omitted, equal proportions are used.
   */
  bands?: number[]
}

export interface FunnelChartProps {
  stages: FunnelStage[]
  /**
   * Base hex color used to auto-generate a layered band palette.
   * Ignored if `colors` is provided.
   */
  color?: string
  /**
   * Explicit fill colors per band, from outermost (lightest) to innermost (darkest).
   * Overrides `color`.
   */
  colors?: string[]
  /**
   * Number of layered bands when `bands` data is not provided per stage.
   * Defaults to 4.
   */
  layerCount?: number
  /** Total SVG width in px. Defaults to 560. */
  width?: number
  /** Total SVG height in px. Defaults to 260. */
  height?: number
  /** Show vertical divider lines and value badges at each stage. Defaults to true. */
  showBadges?: boolean
  /** Format the badge value. Defaults to toLocaleString. */
  valueFormat?: (v: number) => string
  /** Unique suffix for SVG IDs. */
  uid?: string
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FunnelChart({
  stages,
  color = '#7c3aed',
  colors: colorsProp,
  layerCount = 4,
  width = 560,
  height = 260,
  showBadges = true,
  valueFormat,
  uid = 'a',
}: FunnelChartProps) {
  const formatVal = valueFormat ?? ((v: number) => v.toLocaleString())

  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop, tooltipOpen } =
    useTooltip<FunnelStage & { index: number }>()

  const computed = useMemo(() => {
    if (stages.length < 2) return null

    // Determine band count from data or prop
    const nBands = Math.max(
      layerCount,
      ...stages.map(s => s.bands?.length ?? 0)
    )

    // Resolve band colors: outermost (index 0) → lightest, innermost → darkest
    const bandColors = colorsProp ?? Array.from({ length: nBands }, (_, i) => {
      // Alpha from 0.18 (outermost) to 1.0 (innermost), reversed display order
      const alpha = 0.18 + (i / (nBands - 1)) * 0.82
      return hexToRgba(color, alpha)
    })

    const centerY  = height / 2
    const maxHalfH = height / 2 - 8  // vertical padding

    const xScale = scaleLinear({
      domain: [0, stages.length - 1],
      range:  [0, width],
    })

    // At each stage, compute normalized cumulative proportions for each band
    // cumProps[stageIdx][bandIdx] = cumulative height fraction from center outward
    const cumProps = stages.map(stage => {
      const raw = stage.bands ?? Array(nBands).fill(1)
      // Pad / trim to nBands
      const bands = Array.from({ length: nBands }, (_, b) => raw[b] ?? 1)
      const total = bands.reduce((s, v) => s + v, 0)
      let running = 0
      return bands.map(v => {
        running += v / total
        return Math.min(running, 1)
      })
    })

    // Build band geometry: for each band (outermost to innermost),
    // compute top and bottom boundary points at each stage x position.
    //
    // Band[b] occupies from cumProps[s][b-1] to cumProps[s][b] (from center outward).
    // We render from b=nBands-1 (outermost) down to b=0 (innermost), so each
    // inner band sits on top visually.
    const bands = Array.from({ length: nBands }, (_, b) => {
      const topPts = stages.map((_, si) => ({
        x: xScale(si),
        y: centerY - cumProps[si][b] * maxHalfH,
      }))
      const botPts = stages.map((_, si) => ({
        x: xScale(si),
        y: centerY + cumProps[si][b] * maxHalfH,
      }))
      return {
        topPts,
        botPts,
        color: bandColors[b],
        path: bandAreaPath(topPts, botPts),
      }
    })

    // Innermost band rendered last (on top) → reverse for draw order
    const drawOrder = [...bands].reverse()

    return { drawOrder, xScale, centerY }
  }, [stages, color, colorsProp, layerCount, width, height])

  const handleStageMouse = useCallback(
    (e: React.MouseEvent<SVGLineElement | SVGRectElement>, stage: FunnelStage, index: number) => {
      const point = localPoint(e.currentTarget.ownerSVGElement!, e)
      showTooltip({
        tooltipData: { ...stage, index },
        tooltipLeft: point?.x,
        tooltipTop:  point?.y,
      })
    },
    [showTooltip]
  )

  if (!computed) return null
  const { drawOrder, xScale, centerY } = computed

  return (
    <div style={{ position: 'relative', width, display: 'inline-block' }}>
      <svg
        width={width}
        height={height}
        style={{ display: 'block', overflow: 'hidden' }}
        aria-hidden="true"
      >
        {/* ── Band areas — outermost rendered first (behind) ──────────────── */}
        {drawOrder.map((band, i) => (
          <path
            key={i}
            d={band.path}
            fill={band.color}
          />
        ))}

        {/* ── Stage dividers and badges ───────────────────────────────────── */}
        {showBadges && stages.map((stage, i) => {
          // Show badge at all interior stages (not the leftmost edge)
          if (i === 0) return null
          const x         = xScale(i)
          const valStr    = formatVal(stage.value)
          const badgeW    = Math.max(BADGE_MIN_W, valStr.length * 8.5 + BADGE_PAD_X * 2)
          const badgeX    = x - badgeW / 2
          const badgeY    = centerY - BADGE_H / 2

          return (
            <g key={i}>
              {/* Divider line */}
              <line
                x1={x} y1={0}
                x2={x} y2={height}
                stroke={DIVIDER}
                strokeWidth={1}
                onMouseMove={e => handleStageMouse(e, stage, i)}
                onMouseLeave={hideTooltip}
                style={{ cursor: 'default' }}
              />
              {/* Badge pill */}
              <rect
                x={badgeX}
                y={badgeY}
                width={badgeW}
                height={BADGE_H}
                rx={BADGE_H / 2}
                fill="white"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }}
              />
              {/* Badge hit area for tooltip */}
              <rect
                x={badgeX}
                y={badgeY}
                width={badgeW}
                height={BADGE_H}
                rx={BADGE_H / 2}
                fill="transparent"
                onMouseMove={e => handleStageMouse(e, stage, i)}
                onMouseLeave={hideTooltip}
                style={{ cursor: 'default' }}
              />
              <text
                x={x}
                y={centerY + 5}
                textAnchor="middle"
                fontSize={13}
                fontWeight={600}
                letterSpacing="-0.02em"
                fill={BLACK}
                fontFamily="inherit"
                style={{ pointerEvents: 'none' }}
              >
                {valStr}
              </text>
            </g>
          )
        })}
      </svg>

      {/* ── Tooltip ──────────────────────────────────────────────────────── */}
      {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          left={tooltipLeft}
          top={tooltipTop}
          style={TOOLTIP_STYLES}
        >
          {tooltipData.label && (
            <div style={{ opacity: 0.5, fontSize: 11, letterSpacing: '0.02em', marginBottom: 5 }}>
              {tooltipData.label}
            </div>
          )}
          <div style={{ fontWeight: 700, fontSize: 15 }}>
            {formatVal(tooltipData.value)}
          </div>
        </TooltipWithBounds>
      )}
    </div>
  )
}
