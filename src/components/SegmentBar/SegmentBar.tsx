'use client'

import { useCallback, useLayoutEffect, useRef, useState } from 'react'
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
  /**
   * Total bar width in px. When omitted, the bar fills its container fluidly
   * (measured via ResizeObserver, rendered at real pixel width so tooltip
   * coordinates stay accurate). Pass a number to pin an exact width.
   */
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
  width: widthProp,
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

  // ── Fluid width ────────────────────────────────────────────────────────────
  // With no explicit `width`, measure the wrapper and render at that real pixel
  // width. Real pixels (not a viewBox scale) keep SVG user units === CSS px, so
  // localPoint()-based tooltip coordinates stay aligned at any container size.
  const [measuredWidth, setMeasuredWidth] = useState(0)
  const measureRef = useRef<HTMLDivElement | null>(null)

  const setWrapperNode = useCallback((node: HTMLDivElement | null) => {
    measureRef.current = node
    containerRef(node)
  }, [containerRef])

  useLayoutEffect(() => {
    if (widthProp != null) return // explicit width — no measuring needed
    const el = measureRef.current
    if (!el) return
    const update = () => {
      const w = Math.floor(el.getBoundingClientRect().width)
      if (w > 0) setMeasuredWidth(w)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [widthProp])

  // Explicit width always renders exactly; fluid falls back to 560 pre-measure.
  const width = widthProp ?? (measuredWidth > 0 ? measuredWidth : 560)

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
    <div
      ref={setWrapperNode}
      style={
        widthProp != null
          ? { position: 'relative', width: widthProp, display: 'inline-block' }
          : { position: 'relative', width: '100%', display: 'block' }
      }
    >
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
