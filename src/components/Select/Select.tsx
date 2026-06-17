import styles from './Select.module.scss'

export type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  className?: string
  /** Density. `md` (default) = 44px / `$text-base`; `sm` = 28px / `$text-small`. */
  size?: 'sm' | 'md'
}

/** Styled native `<select>` (pass `<option>`s as children). Chevron is drawn by
 *  the component; the native control keeps full keyboard + a11y behavior. */
export function Select({ className, size = 'md', children, ...props }: SelectProps) {
  return (
    <span className={[styles.wrap, size === 'sm' ? styles.sm : styles.md, className].filter(Boolean).join(' ')}>
      <select className={styles.select} {...props}>{children}</select>
      <svg className={styles.chevron} width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
        <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export default Select
