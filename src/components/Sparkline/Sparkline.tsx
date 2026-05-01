interface DataPoint {
  value: number
  label?: string
}

interface Props {
  data: DataPoint[]
  width?: number
  height?: number
  /** Line stroke color — defaults to currentColor */
  color?: string
  /** Fill the area under the line */
  fill?: boolean
  className?: string
}

export function Sparkline({
  data,
  width = 120,
  height = 32,
  color = 'currentColor',
  fill = true,
  className,
}: Props) {
  if (data.length < 2) return null

  const values = data.map((d) => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const pad = 2
  const w = width  - pad * 2
  const h = height - pad * 2

  function x(i: number) { return pad + (i / (data.length - 1)) * w }
  function y(v: number) { return pad + h - ((v - min) / range) * h }

  const points = data.map((d, i) => `${x(i)},${y(d.value)}`)
  const linePath = `M ${points.join(' L ')}`
  const fillPath = `${linePath} L ${x(data.length - 1)},${pad + h} L ${x(0)},${pad + h} Z`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
      aria-hidden
    >
      {fill && (
        <path
          d={fillPath}
          fill={color}
          opacity={0.08}
        />
      )}
      <path
        d={linePath}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Endpoint dot */}
      <circle
        cx={x(data.length - 1)}
        cy={y(values[values.length - 1])}
        r={2.5}
        fill={color}
      />
    </svg>
  )
}
