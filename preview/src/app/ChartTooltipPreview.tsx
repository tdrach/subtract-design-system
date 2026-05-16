import type { ReactNode } from 'react'
import {
  chartTooltipStyles,
  ChartTooltipBody,
  ChartTooltipDetail,
  ChartTooltipHeader,
  ChartTooltipRow,
} from '@subtract/ds'
import styles from './page.module.scss'

function TooltipCard({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className={styles.tooltipPreviewItem}>
      <p className={styles.tokenName}>{label}</p>
      <div className={styles.tooltipPreviewSurface}>
        <div style={chartTooltipStyles}>{children}</div>
      </div>
    </div>
  )
}

export function ChartTooltipPreview() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Chart tooltip</h2>
      <p className={styles.chartIntro}>
        Static previews for tweaking tooltip typography and layout. Matches the
        hover tooltips on all Visx charts.
      </p>
      <div className={styles.tooltipPreviewGrid}>
        <TooltipCard label="multi-series — LineChart">
          <ChartTooltipHeader>Jun 7</ChartTooltipHeader>
          <ChartTooltipBody>
            <ChartTooltipRow color="#11A0FF" label="Revenue" value="496" />
            <ChartTooltipRow color="#06D021" label="Sign-ups" value="128" />
          </ChartTooltipBody>
        </TooltipCard>

        <TooltipCard label="single series">
          <ChartTooltipHeader>Sun</ChartTooltipHeader>
          <ChartTooltipBody>
            <ChartTooltipRow color="#06D021" label="Revenue" value="496" />
          </ChartTooltipBody>
        </TooltipCard>

        <TooltipCard label="CalendarChart">
          <ChartTooltipHeader>Apr 12, 2026</ChartTooltipHeader>
          <ChartTooltipRow color="#FF6200" value="24" />
        </TooltipCard>

        <TooltipCard label="SegmentBar">
          <ChartTooltipRow color="#11A0FF" label="Product" value="42" />
          <ChartTooltipDetail>38%</ChartTooltipDetail>
        </TooltipCard>

        <TooltipCard label="GanttChart">
          <ChartTooltipHeader>Design phase</ChartTooltipHeader>
          <ChartTooltipDetail>12 → 28</ChartTooltipDetail>
          <ChartTooltipDetail>Duration: 16</ChartTooltipDetail>
        </TooltipCard>

        <TooltipCard label="BubbleMatrix">
          <ChartTooltipHeader>North · Q2</ChartTooltipHeader>
          <ChartTooltipRow color="#11A0FF" value="1,240" />
        </TooltipCard>
      </div>
    </section>
  )
}
