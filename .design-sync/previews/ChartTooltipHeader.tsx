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
 * behind it stands in for the chart it hovers over. The parts inherit the
 * brand font from their container, exactly as they do inside a chart card.
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

/** LineChart, multi-series — the header is the hovered date. */
export function DailyDate() {
  return (
    <Floating>
      <ChartTooltipHeader>Jun 7</ChartTooltipHeader>
      <ChartTooltipBody>
        <ChartTooltipRow color="#11A0FF" label="Print hours" value="18.4" />
        <ChartTooltipRow color="#06D021" label="Parts shipped" value="126" />
      </ChartTooltipBody>
    </Floating>
  )
}

/** LineChart with weekday x-labels — the header is a short tick label. */
export function WeekdayLabel() {
  return (
    <Floating>
      <ChartTooltipHeader>Sun</ChartTooltipHeader>
      <ChartTooltipBody>
        <ChartTooltipRow color="#06D021" label="Parts shipped" value="42" />
      </ChartTooltipBody>
    </Floating>
  )
}

/** CalendarChart — the header carries the full date, the row only a value. */
export function FullDate() {
  return (
    <Floating>
      <ChartTooltipHeader>Apr 12, 2026</ChartTooltipHeader>
      <ChartTooltipRow color="#FF6200" value="24" />
    </Floating>
  )
}

/** GanttChart — the header is the task name, details carry the span. */
export function TaskName() {
  return (
    <Floating>
      <ChartTooltipHeader>Enclosure lid — draft</ChartTooltipHeader>
      <ChartTooltipDetail>12 → 28</ChartTooltipDetail>
      <ChartTooltipDetail>Duration: 16</ChartTooltipDetail>
    </Floating>
  )
}

/** BubbleMatrix — the header is the row · column the bubble sits at. */
export function CrossedCategory() {
  return (
    <Floating>
      <ChartTooltipHeader>Printer 03 · Week 24</ChartTooltipHeader>
      <ChartTooltipRow color="#11A0FF" value="1,240" />
    </Floating>
  )
}
