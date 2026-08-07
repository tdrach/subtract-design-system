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

/** Labelled rows — swatch, series name, value pushed to the right edge. */
export function LabelledRows() {
  return (
    <Floating>
      <ChartTooltipHeader>Jun 7</ChartTooltipHeader>
      <ChartTooltipBody>
        <ChartTooltipRow color="#11A0FF" label="Print hours" value="18.4" />
        <ChartTooltipRow color="#06D021" label="Parts shipped" value="126" />
        <ChartTooltipRow color="#FFA811" label="Filament (kg)" value="2.8" />
      </ChartTooltipBody>
    </Floating>
  )
}

/** No label — CalendarChart / BubbleMatrix pass only `color` + `value`. */
export function ValueOnly() {
  return (
    <Floating>
      <ChartTooltipHeader>Apr 12, 2026</ChartTooltipHeader>
      <ChartTooltipRow color="#FF6200" value="24 jobs" />
    </Floating>
  )
}

/** SegmentBar — one row for the hovered segment, its share underneath. */
export function ShareOfTotal() {
  return (
    <Floating>
      <ChartTooltipRow color="#11A0FF" label="PLA" value="42" />
      <ChartTooltipDetail>38%</ChartTooltipDetail>
    </Floating>
  )
}

/** The swatch carries the semantic palette — one row per job state. */
export function SemanticColors() {
  return (
    <Floating>
      <ChartTooltipHeader>Print queue · Week 24</ChartTooltipHeader>
      <ChartTooltipBody>
        <ChartTooltipRow color="#06D021" label="Complete" value="128" />
        <ChartTooltipRow color="#11A0FF" label="Printing" value="12" />
        <ChartTooltipRow color="#FFA811" label="Needs review" value="7" />
        <ChartTooltipRow color="#FF2111" label="Failed" value="3" />
        <ChartTooltipRow color="rgba(12,12,12,0.32)" label="Queued" value="24" />
      </ChartTooltipBody>
    </Floating>
  )
}
