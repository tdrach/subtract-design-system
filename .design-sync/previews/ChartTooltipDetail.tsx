import {
  chartTooltipStyles,
  ChartTooltipHeader,
  ChartTooltipBody,
  ChartTooltipRow,
  ChartTooltipDetail,
} from '@subtract/ds'

const BRAND = "var(--font-indivisible, 'Indivisible', sans-serif)"

/**
 * The tooltip as it floats over a chart: `chartTooltipStyles` supplies the
 * surface (white, $demure border, $radius-sm, shadow), the padded canvas
 * behind it stands in for the chart it hovers over.
 */
function Floating({ children }: { children: any }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 420,
        minHeight: 220,
        padding: 24,
        borderRadius: 12,
        background: 'var(--light)',
        border: '1px solid var(--demure)',
        fontFamily: BRAND,
      }}
    >
      {/* `position: static` re-flows the visx-absolute shell into this frame;
          every other declaration is the shipped tooltip surface, untouched. */}
      <div style={{ ...chartTooltipStyles, position: 'static' }}>{children}</div>
    </div>
  )
}

/** GanttChart — two detail lines under the task name: span, then duration. */
export function TaskSpan() {
  return (
    <Floating>
      <ChartTooltipHeader>Enclosure lid — draft</ChartTooltipHeader>
      <ChartTooltipDetail>12 → 28</ChartTooltipDetail>
      <ChartTooltipDetail>Duration: 16</ChartTooltipDetail>
    </Floating>
  )
}

/** The same shape with a formatted domain — dates instead of day indices. */
export function DateRange() {
  return (
    <Floating>
      <ChartTooltipHeader>Tooling · CNC fixture</ChartTooltipHeader>
      <ChartTooltipDetail>Jun 3 → Jun 11</ChartTooltipDetail>
      <ChartTooltipDetail>Duration: 8 days</ChartTooltipDetail>
    </Floating>
  )
}

/** SegmentBar — the detail is the segment's share of the whole bar. */
export function ShareOfTotal() {
  return (
    <Floating>
      <ChartTooltipRow color="#FFA811" label="PETG" value="28" />
      <ChartTooltipDetail>24%</ChartTooltipDetail>
    </Floating>
  )
}

/** A detail line closing a multi-series body — the derived summary. */
export function SeriesFootnote() {
  return (
    <Floating>
      <ChartTooltipHeader>Jun 7</ChartTooltipHeader>
      <ChartTooltipBody>
        <ChartTooltipRow color="#11A0FF" label="Print hours" value="18.4" />
        <ChartTooltipRow color="#06D021" label="Parts shipped" value="126" />
      </ChartTooltipBody>
      <ChartTooltipDetail>+12% vs. previous week</ChartTooltipDetail>
    </Floating>
  )
}
