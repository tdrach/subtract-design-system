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

/** The canonical body: every series at the hovered x, one row each. */
export function MultiSeries() {
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

/** A body of one — the wrapper still sets the row rhythm under the header. */
export function SingleSeries() {
  return (
    <Floating>
      <ChartTooltipHeader>Sun</ChartTooltipHeader>
      <ChartTooltipBody>
        <ChartTooltipRow color="#06D021" label="Print hours" value="6.2" />
      </ChartTooltipBody>
    </Floating>
  )
}

/** Four machines stacked — the body holds the 6px gap and the value column. */
export function MachineBreakdown() {
  return (
    <Floating>
      <ChartTooltipHeader>Week 24</ChartTooltipHeader>
      <ChartTooltipBody>
        <ChartTooltipRow color="#11A0FF" label="Printer 01" value="42.0 h" />
        <ChartTooltipRow color="#06D021" label="Printer 02" value="38.5 h" />
        <ChartTooltipRow color="#FFA811" label="Printer 03" value="27.2 h" />
        <ChartTooltipRow color="#7c3aed" label="Printer 04" value="19.8 h" />
      </ChartTooltipBody>
    </Floating>
  )
}

/** Body plus a trailing detail line — the summary under the series rows. */
export function WithSummary() {
  return (
    <Floating>
      <ChartTooltipHeader>Jun 7 · Farm total</ChartTooltipHeader>
      <ChartTooltipBody>
        <ChartTooltipRow color="#06D021" label="Complete" value="128" />
        <ChartTooltipRow color="#11A0FF" label="Printing" value="12" />
        <ChartTooltipRow color="#FF2111" label="Failed" value="3" />
      </ChartTooltipBody>
      <ChartTooltipDetail>97.8% success rate</ChartTooltipDetail>
    </Floating>
  )
}
