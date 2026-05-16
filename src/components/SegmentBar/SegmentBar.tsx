'use client'

import { useCallback } from 'react'
import { useTooltip, useTooltipInPortal } from '@visx/tooltip'
import { localPoint } from '@visx/event'
import {
  chartTooltipStyles,
  ChartTooltipDetail,
  ChartTooltipRow,
} from '../ChartTooltip'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SegmentBarSegment {
  id: string
  label: string
  value: number
  color: string
}

export interface SegmentBarProps {
  segments: SegmentBarSegment[]
  /** Total bar width in px. Defaults to 560. */
  width?: number
  /** Bar height in px. Defaults to 24. */
  height?: number
  /** Gap between segments in px. Defaults to 2. */
  gap?: number
  /** Overall border radius in px. Defaults to 6. */
  radius?: number
  /** Format the value shown in the tooltip. Defaults to toLocaleString. */
  valueFormat?: (v: number) => string
  /** Unique suffix for SVG IDs. */
  uid?: string
}

type Computed = SegmentBarSegment & { x: number; w: number; pct: number }

// ─── Component ───────────────────────────────────────────────────────────────

export function SegmentBar({
  segments,
  width = 560,
  height = 24,
  gap = 2,
  radius = 6,
  valueFormat,
  uid = 'a',
}: SegmentBarProps) {
  const formatVal = valueFormat ?? ((v: number) => v.toLocaleString())
  const total     = segments.reduce((s, seg) => s + seg.value, 0)

  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop, tooltipOpen } =
    useTooltip<Computed>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({ detectBounds: true, scroll: true })

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGRectElement>, seg: Computed) => {
    const point = localPoint(e.currentTarget.ownerSVGElement!, e)
    showTooltip({ tooltipData: seg, tooltipLeft: point?.x, tooltipTop: point?.y })
  }, [showTooltip])

  // Compute each segment's x offset and width
  const totalGap = gap * Math.max(segments.length - 1, 0)
  const usableW  = width - totalGap
  let cursor = 0
  const computed: Computed[] = segments.map(seg => {
    const w   = (seg.value / total) * usableW
    const out = { ...seg, x: cursor, w, pct: Math.round((seg.value / total) * 100) }
    cursor += w + gap
    return out
  })

  return (
    <div ref={containerRef} style={{ position: 'relative', width, display: 'inline-block' }}>
      <svg
        width={width}
        height={height}
        style={{ display: 'block' }}
        aria-hidden="true"
      >
        <defs>
          {/* Single rounded-corner clip for the whole bar */}
          <clipPath id={`sb-clip-${uid}`}>
            <rect x={0} y={0} width={width} height={height} rx={radius} ry={radius} />
          </clipPath>
          {/* Mask to punch out gaps between segments */}
          {gap > 0 && (
            <mask id={`sb-mask-${uid}`}>
              <rect x={0} y={0} width={width} height={height} fill="white" />
              {computed.slice(0, -1).map(seg => (
                <rect
                  key={`mask-gap-${seg.id}`}
                  x={seg.x + seg.w}
                  y={0}
                  width={gap}
                  height={height}
                  fill="black"
                />
              ))}
            </mask>
          )}
        </defs>

        <g
          clipPath={`url(#sb-clip-${uid})`}
          mask={gap > 0 ? `url(#sb-mask-${uid})` : undefined}
        >
          {computed.map(seg => (
            <rect
              key={seg.id}
              x={seg.x}
              y={0}
              width={seg.w}
              height={height}
              fill={seg.color}
              onMouseMove={e => handleMouseMove(e, seg)}
              onMouseLeave={hideTooltip}
              style={{ cursor: 'default' }}
            />
          ))}
        </g>
      </svg>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          left={tooltipLeft}
          top={tooltipTop}
          style={chartTooltipStyles}
        >
          <ChartTooltipRow
            color={tooltipData.color}
            label={tooltipData.label}
            value={formatVal(tooltipData.value)}
          />
          <ChartTooltipDetail>{tooltipData.pct}%</ChartTooltipDetail>
        </TooltipInPortal>
      )}
    </div>
  )
}
