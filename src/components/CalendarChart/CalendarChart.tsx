'use client'

import { useMemo } from 'react'

// ─── DS token constants ───────────────────────────────────────────────────────

const MUTED    = 'rgba(12,12,12,0.32)'  // $muted-dark — column headers
const MUTED_SM = 'rgba(12,12,12,0.18)'  // out-of-month date numbers
const ORANGE   = '#FF6200'              // default bubble color

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const

// Four discrete radii matching the Figma spec (px)
const RADII = [5, 9, 15, 24] as const

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CalendarDataPoint {
  date: string   // 'YYYY-MM-DD'
  value: number  // raw value ≥ 0; normalised internally to the month's max
}

export interface CalendarChartProps {
  data: CalendarDataPoint[]
  /** Month to render. Defaults to the current month. */
  month?: Date
  /** Bubble fill color. Defaults to orange (#FF6200). */
  color?: string
  /** Total SVG width in px. Defaults to 360. */
  width?: number
  /**
   * Unique suffix appended to SVG gradient IDs.
   * Required when rendering more than one CalendarChart on the same page.
   */
  uid?: string
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CalendarChart({
  data,
  month,
  color = ORANGE,
  width = 360,
  uid = 'a',
}: CalendarChartProps) {
  const ref  = month ?? new Date()
  const year = ref.getFullYear()
  const mon  = ref.getMonth()

  const computed = useMemo(() => {
    // Date → value lookup
    const lookup = new Map(data.map(d => [d.date, d.value]))

    // Calendar bounds
    const firstDow      = new Date(year, mon, 1).getDay()       // 0 = Sun
    const daysInMonth   = new Date(year, mon + 1, 0).getDate()
    const daysInPrevMon = new Date(year, mon, 0).getDate()

    // Normalise against the displayed month only
    const monthVals: number[] = []
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(mon + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const v   = lookup.get(key) ?? 0
      if (v > 0) monthVals.push(v)
    }
    const maxVal = Math.max(...monthVals, 1)

    function getRadius(value: number): number {
      const n = value / maxVal
      if (n >= 0.75) return RADII[3]
      if (n >= 0.50) return RADII[2]
      if (n >= 0.25) return RADII[1]
      if (n >  0)    return RADII[0]
      return 0
    }

    // Grid geometry
    const totalSlots = firstDow + daysInMonth
    const rows       = Math.ceil(totalSlots / 7)
    const CELL_W     = width / 7
    const CELL_H     = Math.max(CELL_W, 48)
    const HDR_H      = 28

    type Cell = {
      cx: number; cy: number; day: number; inMonth: boolean; value: number
    }

    const cells: Cell[] = []
    for (let slot = 0; slot < rows * 7; slot++) {
      const col = slot % 7
      const row = Math.floor(slot / 7)
      const cx  = col * CELL_W + CELL_W / 2
      const cy  = HDR_H + row * CELL_H + CELL_H / 2

      if (slot < firstDow) {
        // Previous month overflow
        const day = daysInPrevMon - firstDow + slot + 1
        cells.push({ cx, cy, day, inMonth: false, value: 0 })
      } else if (slot < firstDow + daysInMonth) {
        const day     = slot - firstDow + 1
        const dateStr = `${year}-${String(mon + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const value   = lookup.get(dateStr) ?? 0
        cells.push({ cx, cy, day, inMonth: true, value })
      } else {
        // Next month overflow
        const day = slot - firstDow - daysInMonth + 1
        cells.push({ cx, cy, day, inMonth: false, value: 0 })
      }
    }

    const svgH = HDR_H + rows * CELL_H
    return { cells, getRadius, svgH }
  }, [data, year, mon, width])

  const { cells, getRadius, svgH } = computed
  const glowId = `cc-glow-${uid}`

  return (
    <svg
      width={width}
      height={svgH}
      viewBox={`0 0 ${width} ${svgH}`}
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        {/* Soft radial glow gradient, offset downward like the Figma spec */}
        <radialGradient id={glowId} cx="50%" cy="35%" r="50%">
          <stop offset="0%"   stopColor={color} stopOpacity={0.38} />
          <stop offset="100%" stopColor={color} stopOpacity={0}    />
        </radialGradient>
      </defs>

      {/* ── Day-of-week column headers ─────────────────────────────────────── */}
      {DAYS.map((d, i) => (
        <text
          key={d}
          x={i * (width / 7) + (width / 7) / 2}
          y={18}
          textAnchor="middle"
          fontSize={10}
          fontWeight={600}
          letterSpacing="0.06em"
          fill={MUTED}
          fontFamily="inherit"
        >
          {d}
        </text>
      ))}

      {/* ── Glows — rendered behind bubbles ───────────────────────────────── */}
      {cells.map((c, i) => {
        if (!c.inMonth) return null
        const r = getRadius(c.value)
        if (r < 9) return null
        return (
          <ellipse
            key={`glow-${i}`}
            cx={c.cx}
            cy={c.cy + r * 0.6}
            rx={r * 2.6}
            ry={r * 2.0}
            fill={`url(#${glowId})`}
          />
        )
      })}

      {/* ── Bubbles and out-of-month date numbers ─────────────────────────── */}
      {cells.map((c, i) => {
        if (!c.inMonth) {
          return (
            <text
              key={`oom-${i}`}
              x={c.cx}
              y={c.cy + 5}
              textAnchor="middle"
              fontSize={14}
              fontWeight={400}
              fill={MUTED_SM}
              fontFamily="inherit"
            >
              {c.day}
            </text>
          )
        }

        const r = getRadius(c.value)
        if (r === 0) return null

        return (
          <circle
            key={`bubble-${i}`}
            cx={c.cx}
            cy={c.cy}
            r={r}
            fill={color}
          />
        )
      })}
    </svg>
  )
}
