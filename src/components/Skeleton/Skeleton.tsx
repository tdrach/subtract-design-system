import styles from './Skeleton.module.scss'

export interface SkeletonProps {
  width?: number | string
  height?: number | string
  radius?: number | string
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ width, height = 14, radius, className, style }: SkeletonProps) {
  return (
    <span
      className={[styles.skeleton, className].filter(Boolean).join(' ')}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden
    />
  )
}
